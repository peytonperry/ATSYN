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
  MultiSelect,
} from "@mantine/core";
import { IconUpload, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { apiService } from "../../../../config/api";
import { CategorySelect } from "../CategoryManagement/CategorySelect";
import { useNavigate } from "react-router-dom";

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
  options: AttributeOption[];
}

interface ProductAttributeValue {
  attributeId: number;
  values: string[];
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
    if (formData.categoryId > 0) {
      fetchCategoryAttributes(formData.categoryId);
    } else {
      setCategoryAttributes([]);
      setSelectedAttributes([]);
    }
  }, [formData.categoryId]);

  const fetchCategoryAttributes = async (categoryId: number) => {
    try {
      const response = await apiService.get(
        `/ProductAttribute/category/${categoryId}`
      );
      setCategoryAttributes(response || []);
      setSelectedAttributes([]);
    } catch (error) {
      console.error("Error fetching category attributes:", error);
      setCategoryAttributes([]);
    }
  };

  const handleAttributeChange = (attributeId: number, values: string[]) => {
    setSelectedAttributes((prev) => {
      const existing = prev.findIndex((a) => a.attributeId === attributeId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { attributeId, values };
        return updated;
      }
      return [...prev, { attributeId, values }];
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

    const requiredAttributes = categoryAttributes.filter(
      (attr) => attr.isRequired
    );
    for (const attr of requiredAttributes) {
      const selected = selectedAttributes.find(
        (a) => a.attributeId === attr.id
      );
      if (!selected || selected.values.length === 0) {
        setErrorMsg(
          `Please select at least one value for required attribute: ${attr.name}`
        );
        setLoading(false);
        return;
      }
    }

    const attributeValuesFlattened = selectedAttributes.flatMap((attr) =>
      attr.values.map((value) => ({
        attributeId: attr.attributeId,
        value: value,
      }))
    );

    const productData = {
      ...formData,
      price: Number(formData.price),
      stockAmount: Number(formData.stockAmount),
      attributeValues: attributeValuesFlattened,
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
    } catch (error) {
      console.error("Error creating product:", error);
      setErrorMsg("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  {
    console.log(formData.stockAmount, formData.inStock);
  }

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
                label="Price"
                placeholder="0.00"
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
                label="Stock Amount"
                placeholder="0"
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
                <Title order={4} mt="md">
                  Product Attributes
                </Title>
                {categoryAttributes.map((attr) => (
                  <MultiSelect
                    key={attr.id}
                    label={attr.name}
                    placeholder={`Select ${attr.name.toLowerCase()} options`}
                    description={`This product is available in these ${attr.name.toLowerCase()} options`}
                    data={attr.options.map((opt) => ({
                      value: opt.value,
                      label: opt.value,
                    }))}
                    value={
                      selectedAttributes.find((a) => a.attributeId === attr.id)
                        ?.values || []
                    }
                    onChange={(values) =>
                      handleAttributeChange(attr.id, values)
                    }
                    required={attr.isRequired}
                    searchable
                    clearable
                  />
                ))}
              </>
            )}

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
