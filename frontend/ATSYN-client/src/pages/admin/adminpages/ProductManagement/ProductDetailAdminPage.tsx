import {
  Container,
  Grid,
  Image,
  Title,
  TextInput,
  Textarea,
  NumberInput,
  Stack,
  Button,
  Accordion,
  AccordionControl,
  AccordionPanel,
  Group,
  Notification,
  Loader,
  Center,
  Paper,
  Select,
  Divider,
  ActionIcon,
  Checkbox,
  FileInput,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetailAdminPage.css";
import { apiService } from "../../../../config/api";
import { CategorySelect } from "../CategoryManagement/CategorySelect";
import { IconUpload, IconTrash } from "@tabler/icons-react";
import { BrandSelect } from "../CategoryManagement/BrandSelect";

interface Category {
  id: number;
  name: string;
  parentCategoryId?: number | null;
}

interface Brand {
  id: number;
  name: string;
}

interface Photo {
  id: number;
  fileName: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
  isPrimary: boolean;
  displayOrder: number;
  altText: string;
  imageUrl: string;
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

interface ProductAttributeValue {
  id?: number;
  attributeId: number;
  attributeName?: string;
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
  brand?: Brand;
  photos: Photo[];
  attributeValues: ProductAttributeValue[];
}

const shippingInfo =
  "We currently ship through USPS. Rates and tracking are updated directly from USPS. We will ship orders received within 1-2 business days of order receipt.";

const returnInfo =
  "Returns on sterilized products are not valid if they have been opened. Returns are only eligible within 30 days from receipt. Proof of purchase necessary. ATSYN does not offer returns of funds directly. Store credit will be issued for returned items.";

const ProductDetailAdminPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categoryAttributes, setCategoryAttributes] = useState<
    CategoryAttribute[]
  >([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    ProductAttributeValue[]
  >([]);
  const [selectedRootCategoryId, setSelectedRootCategoryId] = useState<
    number | null
  >(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.categoryId) {
      fetchCategoryAttributes(product.categoryId);
    }
  }, [product?.categoryId]);

  useEffect(() => {
    if (product && categories.length > 0 && !selectedRootCategoryId) {
      const productCategory = categories.find(
        (c) => c.id === product.categoryId
      );
      if (productCategory) {
        const rootId = productCategory.parentCategoryId || product.categoryId;
        setSelectedRootCategoryId(rootId);
      }
    }
  }, [product, categories, selectedRootCategoryId]);

  const fetchCategories = async () => {
    try {
      const data = await apiService.get("/Category");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const data = await apiService.get("/Brand");
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const data: Product = await apiService.get(`/Product/${id}`);
      setProduct(data);
      setSelectedAttributes(data.attributeValues || []);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryAttributes = async (categoryId: number) => {
    try {
      const data = await apiService.get(
        `/ProductAttribute/category/${categoryId}`
      );
      setCategoryAttributes(data);
    } catch (error) {
      console.error("Error fetching category attributes:", error);
    }
  };

  const getProductImageUrl = (product: Product) => {
    const primaryPhoto =
      product.photos?.find((p) => p.isPrimary) || product.photos?.[0];
    return primaryPhoto
      ? apiService.getImageUrl(primaryPhoto.id)
      : product.imageUrl || "";
  };

  const addAttributeVariant = (attributeId: number) => {
    setSelectedAttributes([
      ...selectedAttributes,
      {
        attributeId,
        value: "",
        price: undefined,
        stockAmount: undefined,
      },
    ]);
  };

  const removeAttributeVariant = (index: number) => {
    setSelectedAttributes(selectedAttributes.filter((_, i) => i !== index));
  };

  const updateAttributeVariant = (index: number, field: string, value: any) => {
    const updated = [...selectedAttributes];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedAttributes(updated);
  };

  const handleUpdate = async () => {
    if (!product) return;

    const missingRequiredAttributes = categoryAttributes
      .filter((attr) => attr.isRequired)
      .filter(
        (attr) =>
          !selectedAttributes.some(
            (sa) => sa.attributeId === attr.id && sa.value
          )
      );

    if (missingRequiredAttributes.length > 0) {
      setMessage(
        `Please fill in required attributes: ${missingRequiredAttributes
          .map((a) => a.name)
          .join(", ")}`
      );
      return;
    }

    const emptyValues = selectedAttributes.filter((attr) => !attr.value);
    if (emptyValues.length > 0) {
      setMessage(
        "Please fill in all attribute values or remove empty entries."
      );
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        ...product,
        attributeValues: selectedAttributes.map((attr) => ({
          attributeId: attr.attributeId,
          value: attr.value,
          price: attr.price || null,
          stockAmount: attr.stockAmount || null,
        })),
      };

      await apiService.put(`/Product/${product.id}`, updateData);

      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          const photoFormData = new FormData();
          photoFormData.append("ProductId", product.id.toString());
          photoFormData.append("IsPrimary", (i === 0).toString());
          photoFormData.append("DisplayOrder", i.toString());
          photoFormData.append("AltText", product.title);
          photoFormData.append("File", photos[i]);

          await apiService.uploadFile("/Photo/upload", photoFormData);
        }
      }

      setMessage("Product updated successfully!");
      fetchProduct();
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await apiService.delete(`/Product/${product.id}`);
        navigate("/admin/all-products");
        setMessage("Product deleted successfully!");
      } catch (error: any) {
        console.error("Error deleting product:", error);

        const errorMessage = error?.response?.data?.message;

        if (errorMessage) {
          setMessage(errorMessage);
        } else {
          setMessage("Failed to delete product. Please try again.");
        }
      }
    }
  };

  if (loading) {
    return (
      <Center className="admin-product-loader">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!product) {
    return <div className="admin-product-error">Product not found</div>;
  }

  const attributesByType = categoryAttributes.reduce((acc, attr) => {
    if (!acc[attr.id]) {
      acc[attr.id] = {
        attribute: attr,
        values: selectedAttributes.filter((sa) => sa.attributeId === attr.id),
      };
    }
    return acc;
  }, {} as Record<number, { attribute: CategoryAttribute; values: ProductAttributeValue[] }>);

  return (
    <Container size="xl" my="md" className="admin-product-container">
      <Button
        className="button"
        variant="subtle"
        onClick={() => navigate("/admin/all-products")}
      >
        ← Back to View All Products
      </Button>

      {message && (
        <Notification
          color={
            message.includes("successfully")
              ? "green"
              : message.includes("Cannot delete")
              ? "yellow"
              : "red"
          }
          onClose={() => setMessage(null)}
          className="admin-product-notification"
          title={
            message.includes("Cannot delete")
              ? "⚠️ Delete Restricted"
              : undefined
          }
          withCloseButton
        >
          {message}
        </Notification>
      )}

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" radius="lg">
            <Stack gap="md">
              <div className="admin-product-image">
                <Image
                  src={getProductImageUrl(product)}
                  alt={product.title}
                  height={400}
                  fit="contain"
                />
              </div>

              <FileInput
                label="Upload Additional Photos"
                placeholder="Choose files"
                multiple
                accept="image/*"
                leftSection={<IconUpload size={16} />}
                value={photos}
                onChange={setPhotos}
              />

              {photos.length > 0 && (
                <Text size="sm" c="dimmed">
                  {photos.length} photo(s) selected
                </Text>
              )}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" radius="lg" className="admin-product-panel">
            <Stack gap="md">
              <Title order={2} className="admin-product-title">
                Edit Product
              </Title>

              <TextInput
                label="Title"
                placeholder="Product title"
                value={product.title}
                onChange={(e) =>
                  setProduct({ ...product, title: e.currentTarget.value })
                }
                required
              />

              <Textarea
                label="Description"
                placeholder="Product description"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.currentTarget.value })
                }
                minRows={3}
                required
              />

              <Select
                label="Root Category"
                placeholder="Select root category"
                data={categories
                  .filter((cat) => !cat.parentCategoryId)
                  .map((cat) => ({
                    value: cat.id.toString(),
                    label: cat.name,
                  }))}
                value={selectedRootCategoryId?.toString() || null}
                onChange={(value) => {
                  if (value) {
                    const rootCatId = parseInt(value);
                    setSelectedRootCategoryId(rootCatId);
                    const subcategories = categories.filter(
                      (c) => c.parentCategoryId === rootCatId
                    );

                    if (subcategories.length === 0) {
                      setProduct({ ...product, categoryId: rootCatId });
                    } else {
                      const currentIsSubOfNewRoot =
                        product.category?.parentCategoryId === rootCatId;
                      if (!currentIsSubOfNewRoot) {
                        setProduct({
                          ...product,
                          categoryId: subcategories[0].id,
                        });
                      }
                    }
                    setSelectedAttributes([]);
                  }
                }}
                searchable
              />

              {(() => {
                const subcategories = selectedRootCategoryId
                  ? categories.filter(
                      (c) => c.parentCategoryId === selectedRootCategoryId
                    )
                  : [];

                if (subcategories.length > 0) {
                  return (
                    <Select
                      label="Subcategory"
                      placeholder="Select subcategory"
                      data={subcategories.map((cat) => ({
                        value: cat.id.toString(),
                        label: cat.name,
                      }))}
                      value={
                        product.category?.parentCategoryId ===
                        selectedRootCategoryId
                          ? product.categoryId.toString()
                          : subcategories[0].id.toString()
                      }
                      onChange={(value) => {
                        if (value) {
                          setProduct({
                            ...product,
                            categoryId: parseInt(value),
                          });
                          setSelectedAttributes([]);
                        }
                      }}
                      searchable
                      required
                    />
                  );
                }
                return null;
              })()}

              <BrandSelect
                brands={brands}
                value={product.brandId || null}
                onBrandChange={(brand: Brand | null) => {
                  setProduct({ ...product, brandId: brand?.id || null });
                }}
                onBrandCreate={async (brandName: string) => {
                  const newBrand = await apiService.post("/Brand", {
                    name: brandName,
                  });
                  setBrands([...brands, newBrand]);
                  setMessage("Brand created successfully!");
                  return newBrand;
                }}
              />

              <NumberInput
                label="Base Price"
                placeholder="0.00"
                value={product.price}
                onChange={(value) =>
                  setProduct({ ...product, price: Number(value) || 0 })
                }
                min={0}
                decimalScale={2}
                fixedDecimalScale
                prefix="$"
                required
              />

              <NumberInput
                label="Base Stock Amount"
                placeholder="0"
                value={product.stockAmount}
                onChange={(value) =>
                  setProduct({ ...product, stockAmount: Number(value) || 0 })
                }
                min={0}
                required
              />

              <Checkbox
                label="Product is visible to customers"
                checked={product.isVisible}
                onChange={(e) =>
                  setProduct({ ...product, isVisible: e.currentTarget.checked })
                }
              />

              <Checkbox
                label="Product is in stock"
                checked={product.inStock}
                onChange={(e) =>
                  setProduct({ ...product, inStock: e.currentTarget.checked })
                }
              />
            </Stack>
          </Paper>
        </Grid.Col>

        {categoryAttributes.length > 0 && (
          <Grid.Col span={12}>
            <Paper p="md" radius="lg">
              <Stack gap="md">
                <Title order={3}>Product Variants</Title>
                <Text size="sm" c="dimmed">
                  Add different variants with specific prices and stock amounts.
                  Leave price/stock empty to use base values.
                </Text>

                <Divider />

                {Object.values(attributesByType).map(
                  ({ attribute, values }) => (
                    <Stack key={attribute.id} gap="sm">
                      <Group justify="space-between">
                        <Text fw={600}>
                          {attribute.name}
                          {attribute.isRequired && (
                            <span style={{ color: "red" }}> *</span>
                          )}
                        </Text>
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => addAttributeVariant(attribute.id)}
                        >
                          Add {attribute.name} Option
                        </Button>
                      </Group>

                      {values.map((attrValue, index) => {
                        const globalIndex = selectedAttributes.findIndex(
                          (sa) => sa === attrValue
                        );
                        return (
                          <Paper key={globalIndex} p="sm" withBorder>
                            <Group gap="sm" align="flex-end">
                              {attribute.type === "select" &&
                              attribute.options.length > 0 ? (
                                <Select
                                  label="Value"
                                  placeholder={`Select ${attribute.name.toLowerCase()}`}
                                  data={attribute.options.map((opt) => ({
                                    value: opt.value,
                                    label: opt.value,
                                  }))}
                                  value={attrValue.value}
                                  onChange={(value) =>
                                    updateAttributeVariant(
                                      globalIndex,
                                      "value",
                                      value || ""
                                    )
                                  }
                                  style={{ flex: 1 }}
                                  required
                                />
                              ) : (
                                <TextInput
                                  label="Value"
                                  placeholder={`Enter ${attribute.name.toLowerCase()}`}
                                  value={attrValue.value}
                                  onChange={(e) =>
                                    updateAttributeVariant(
                                      globalIndex,
                                      "value",
                                      e.currentTarget.value
                                    )
                                  }
                                  style={{ flex: 1 }}
                                  required
                                />
                              )}

                              <NumberInput
                                label="Price (optional)"
                                placeholder="Uses base price"
                                value={attrValue.price}
                                onChange={(value) =>
                                  updateAttributeVariant(
                                    globalIndex,
                                    "price",
                                    value ? Number(value) : undefined
                                  )
                                }
                                min={0}
                                decimalScale={2}
                                fixedDecimalScale
                                prefix="$"
                                style={{ width: 150 }}
                              />

                              <NumberInput
                                label="Stock (optional)"
                                placeholder="Uses base stock"
                                value={attrValue.stockAmount}
                                onChange={(value) =>
                                  updateAttributeVariant(
                                    globalIndex,
                                    "stockAmount",
                                    value ? Number(value) : undefined
                                  )
                                }
                                min={0}
                                style={{ width: 120 }}
                              />

                              <ActionIcon
                                color="red"
                                variant="light"
                                onClick={() =>
                                  removeAttributeVariant(globalIndex)
                                }
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Group>
                          </Paper>
                        );
                      })}

                      {values.length === 0 && attribute.isRequired && (
                        <Text size="sm" c="red">
                          This attribute is required. Please add at least one
                          option.
                        </Text>
                      )}
                    </Stack>
                  )
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        )}

        <Grid.Col span={12}>
          <Paper p="md" radius="lg">
            <Group justify="space-between">
              <Button
                color="green"
                onClick={handleUpdate}
                loading={saving}
                className="update-btn"
                size="lg"
              >
                Save Changes
              </Button>
              <Button
                color="red"
                variant="light"
                onClick={handleDelete}
                className="delete-btn"
                size="lg"
              >
                Delete Product
              </Button>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={12}>
          <Accordion variant="separated">
            <Accordion.Item value="shipping">
              <AccordionControl>Shipping Information</AccordionControl>
              <AccordionPanel>{shippingInfo}</AccordionPanel>
            </Accordion.Item>
            <Accordion.Item value="returns">
              <AccordionControl>Return Policy</AccordionControl>
              <AccordionPanel>{returnInfo}</AccordionPanel>
            </Accordion.Item>
          </Accordion>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProductDetailAdminPage;
