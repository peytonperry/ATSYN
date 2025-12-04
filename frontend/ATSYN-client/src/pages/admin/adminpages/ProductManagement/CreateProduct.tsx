import { useEffect, useState } from "react";
import {
  Container,
  TextInput,
  Textarea,
  NumberInput,
  Checkbox,
  Button,
  Stack,
  Group,
  FileInput,
  Title,
  Alert,
  Text,
  Paper,
  Select,
  Divider,
  ActionIcon,
} from "@mantine/core";
import {
  IconUpload,
  IconCheck,
  IconAlertCircle,
  IconTrash,
} from "@tabler/icons-react";
import { apiService } from "../../../../config/api";
import { CategorySelect } from "../CategoryManagement/CategorySelect";
import { useNavigate, useLocation } from "react-router-dom";

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface AttributeOption {
  id: number;
  value: string;
  displayOrder: number;
}

interface CategoryAttribute {
  id: number;
  name: string;
  type: string;
  categoryId: number;
  isRequired: boolean;
  displayOrder: number;
  isVisibleToCustomers: boolean;
  options: AttributeOption[];
}

// Updated to include price and stock for each attribute value
interface ProductAttributeValue {
  attributeId: number;
  value: string;
  price?: number;
  stockAmount?: number;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  categoryId: number;
  brandId?: number | null;
  stockAmount: number;
  isVisible: boolean;
  shippingTypeId: number;
  inStock: boolean;
  imageUrl: string;
  category: Category;
}

const CreateProduct: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    categoryId: 0,
    brandId: null as number | null,
    stockAmount: 0,
    inStock: true,
    isVisible: true,
    shippingTypeId: 0,
    imageUrl: "",
    category: { id: 0, name: "" },
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categoryAttributes, setCategoryAttributes] = useState<
    CategoryAttribute[]
  >([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    ProductAttributeValue[]
  >([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Reset all state when navigating to this page
  useEffect(() => {
    // This runs whenever the location changes (i.e., navigating back to this page)
    setFormData({
      title: "",
      description: "",
      price: 0,
      categoryId: 0,
      brandId: null,
      stockAmount: 0,
      inStock: true,
      isVisible: true,
      shippingTypeId: 0,
      imageUrl: "",
      category: { id: 0, name: "" },
    });
    setPhotos([]);
    setSelectedAttributes([]);
    setCategoryAttributes([]);
    setSuccessMsg("");
    setErrorMsg("");
  }, [location.pathname]);

  // Reset state when component mounts (navigating back to this page)
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      setCategoryAttributes([]);
      setSelectedAttributes([]);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get("/Category");
        const fetchedCategories: Category[] = response || [];
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await apiService.get("/Brand");
        const fetchedBrands: Brand[] = response || [];
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    // Immediately clear attributes when category changes
    setCategoryAttributes([]);
    setSelectedAttributes([]);

    if (formData.categoryId > 0) {
      fetchCategoryAttributes(formData.categoryId);
    }
  }, [formData.categoryId]);

  const fetchCategoryAttributes = async (categoryId: number) => {
    try {
      const response = await apiService.get(
        `/ProductAttribute/category/${categoryId}`
      );
      // Ensure response is an array
      const attributes = Array.isArray(response) ? response : [];
      setCategoryAttributes(attributes);
      setSelectedAttributes([]);
    } catch (error) {
      console.error("Error fetching category attributes:", error);
      setCategoryAttributes([]);
      setSelectedAttributes([]);
    }
  };

  // Add a new attribute value variant
  const addAttributeVariant = (attributeId: number) => {
    setSelectedAttributes((prev) => [
      ...prev,
      { attributeId, value: "", price: undefined, stockAmount: undefined },
    ]);
  };

  // Remove an attribute value variant
  const removeAttributeVariant = (index: number) => {
    setSelectedAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a specific attribute variant
  const updateAttributeVariant = (
    index: number,
    field: keyof ProductAttributeValue,
    value: string | number | undefined
  ) => {
    setSelectedAttributes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const uploadPhotos = async (productId: number) => {
    if (photos.length === 0) return;

    for (let i = 0; i < photos.length; i++) {
      const photoFormData = new FormData();
      photoFormData.append("ProductId", productId.toString());
      photoFormData.append("IsPrimary", (i === 0).toString());
      photoFormData.append("DisplayOrder", i.toString());
      photoFormData.append("AltText", formData.title);
      photoFormData.append("File", photos[i]);

      try {
        await apiService.uploadFile("/Photo/upload", photoFormData);
        console.log(`Photo ${i + 1} uploaded successfully`);
      } catch (error) {
        console.error(`Error uploading photo ${i + 1}:`, error);
        throw error;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Validate required attributes
    const requiredAttributes = categoryAttributes.filter(
      (attr) => attr.isRequired
    );
    for (const attr of requiredAttributes) {
      const hasValue = selectedAttributes.some(
        (a) => a.attributeId === attr.id && a.value
      );
      if (!hasValue) {
        setErrorMsg(
          `Please add at least one value for required attribute: ${attr.name}`
        );
        setLoading(false);
        return;
      }
    }

    // Validate all attribute values are filled
    for (const attr of selectedAttributes) {
      if (!attr.value) {
        setErrorMsg("Please fill in all attribute values or remove empty ones");
        setLoading(false);
        return;
      }
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      stockAmount: Number(formData.stockAmount),
      attributeValues: selectedAttributes.map((attr) => ({
        attributeId: attr.attributeId,
        value: attr.value,
        price: attr.price !== undefined ? Number(attr.price) : null,
        stockAmount:
          attr.stockAmount !== undefined ? Number(attr.stockAmount) : null,
      })),
    };

    try {
      const response: Product = await apiService.post("/Product", productData);
      console.log("Created product:", response);

      if (photos.length > 0) {
        await uploadPhotos(response.id);
        setSuccessMsg(
          `Product "${response.title}" created with ${photos.length} photo(s)!`
        );
      } else {
        setSuccessMsg(`Product "${response.title}" created successfully!`);
      }

      setFormData({
        title: "",
        description: "",
        price: 0,
        categoryId: 0,
        brandId: null,
        stockAmount: 0,
        inStock: true,
        isVisible: true,
        shippingTypeId: 0,
        imageUrl: "",
        category: { id: 0, name: "" },
      });
      setPhotos([]);
      setSelectedAttributes([]);
      setCategoryAttributes([]); // Also clear category attributes
    } catch (error) {
      console.error("Error creating product:", error);
      setErrorMsg("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Button variant="subtle" onClick={() => navigate("/admin/all-products")}>
        ← Back to View All Products
      </Button>
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="xl">
          Create Product
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Title"
              placeholder="Product title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.currentTarget.value })
              }
            />

            <Textarea
              label="Description"
              placeholder="Product description"
              required
              minRows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.currentTarget.value })
              }
            />

            <Group grow>
              <NumberInput
                label="Base Price"
                placeholder="0.00"
                description="Starting/lowest price (can be overridden by attribute pricing)"
                required
                min={0}
                decimalScale={2}
                fixedDecimalScale
                prefix="$"
                value={formData.price}
                onChange={(value) =>
                  setFormData({ ...formData, price: Number(value) || 0 })
                }
              />

              <NumberInput
                label="Base Stock Amount"
                placeholder="0"
                description="Total stock (or calculated from attributes)"
                required
                min={0}
                value={formData.stockAmount}
                onChange={(value) =>
                  setFormData({ ...formData, stockAmount: Number(value) || 0 })
                }
              />
            </Group>

            <label>Category</label>
            <CategorySelect
              categories={categories}
              onCategoryChange={(category) =>
                setFormData({
                  ...formData,
                  categoryId: category.id,
                  category: category,
                })
              }
              onCategoryCreate={async (newCategoryName) => {
                const response = await apiService.post("/api/Category", {
                  name: newCategoryName,
                });
                const createdCategory: Category = response;
                setCategories((prev) => [...prev, createdCategory]);
                return createdCategory;
              }}
            />

            <Select
              label="Brand (Optional)"
              placeholder="Select a brand"
              data={brands.map((brand) => ({
                value: brand.id.toString(),
                label: brand.name,
              }))}
              value={formData.brandId?.toString() || null}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  brandId: value ? parseInt(value) : null,
                })
              }
              clearable
              searchable
            />

            {categoryAttributes.length > 0 && (
              <>
                <Divider my="md" />
                <Title order={4}>Product Variants (with Pricing)</Title>
                <Text size="sm" c="dimmed">
                  Add different variations of this product (e.g., different
                  sizes) with their own prices
                </Text>

                {categoryAttributes.map((attr) => {
                  const attributeVariants = selectedAttributes.filter(
                    (a) => a.attributeId === attr.id
                  );

                  return (
                    <Paper key={attr.id} p="md" withBorder>
                      <Group justify="space-between" mb="sm">
                        <Text fw={500}>{attr.name}</Text>
                        <Button
                          size="xs"
                          onClick={() => addAttributeVariant(attr.id)}
                        >
                          Add {attr.name} Option
                        </Button>
                      </Group>

                      <Stack gap="sm">
                        {attributeVariants.map((variant, index) => {
                          const globalIndex = selectedAttributes.findIndex(
                            (a) => a === variant
                          );

                          return (
                            <Group key={globalIndex} grow>
                              <Select
                                label="Value"
                                placeholder={`Select ${attr.name.toLowerCase()}`}
                                data={attr.options.map((opt) => ({
                                  value: opt.value,
                                  label: opt.value,
                                }))}
                                value={variant.value}
                                onChange={(value) =>
                                  updateAttributeVariant(
                                    globalIndex,
                                    "value",
                                    value || ""
                                  )
                                }
                                required={attr.isRequired}
                                searchable
                              />

                              <NumberInput
                                label="Price (Optional)"
                                placeholder="0.00"
                                min={0}
                                decimalScale={2}
                                prefix="$"
                                value={variant.price}
                                onChange={(value) =>
                                  updateAttributeVariant(
                                    globalIndex,
                                    "price",
                                    value !== "" ? Number(value) : undefined
                                  )
                                }
                              />

                              <NumberInput
                                label="Stock (Optional)"
                                placeholder="0"
                                min={0}
                                value={variant.stockAmount}
                                onChange={(value) =>
                                  updateAttributeVariant(
                                    globalIndex,
                                    "stockAmount",
                                    value !== "" ? Number(value) : undefined
                                  )
                                }
                              />

                              <ActionIcon
                                color="red"
                                variant="light"
                                onClick={() =>
                                  removeAttributeVariant(globalIndex)
                                }
                                style={{ alignSelf: "flex-end" }}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Group>
                          );
                        })}

                        {attributeVariants.length === 0 && attr.isRequired && (
                          <Text size="sm" c="red">
                            This attribute is required. Please add at least one
                            option.
                          </Text>
                        )}
                      </Stack>
                    </Paper>
                  );
                })}
              </>
            )}

            <Divider my="md" />

            <FileInput
              label="Product Photos"
              placeholder="Click to select photos"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              leftSection={<IconUpload size={16} />}
              value={photos}
              onChange={(files) => setPhotos(files || [])}
            />

            {photos.length > 0 && (
              <Text size="sm" c="dimmed">
                {photos.length} photo(s) selected. First photo will be primary.
              </Text>
            )}

            <TextInput
              label="Image URL (Optional - deprecated)"
              placeholder="https://example.com/image.jpg"
              description="Use photo upload above instead"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.currentTarget.value })
              }
            />

            <Checkbox
              label="Visible to customers"
              checked={formData.isVisible}
              onChange={(e) =>
                setFormData({ ...formData, isVisible: e.currentTarget.checked })
              }
            />

            <Checkbox
              label="In Stock"
              checked={formData.stockAmount > 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stockAmount: e.currentTarget.checked ? 1 : 0,
                })
              }
            />

            {successMsg && (
              <Alert
                icon={<IconCheck size={16} />}
                color="green"
                withCloseButton
                onClose={() => setSuccessMsg("")}
              >
                {successMsg}
              </Alert>
            )}

            {errorMsg && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                withCloseButton
                onClose={() => setErrorMsg("")}
              >
                {errorMsg}
              </Alert>
            )}

            <Button type="submit" loading={loading} fullWidth size="lg">
              Create Product
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProduct;
