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
} from "@mantine/core";
import { IconUpload, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { apiService } from "../../../../../config/api";
import { CategorySelect } from "./CategorySelect";

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
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

    const productData = {
      ...formData,
      price: Number(formData.price),
      stockAmount: Number(formData.stockAmount),
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
        isVisible: true,
        shippingTypeId: 0,
        imageUrl: "",
        category: { id: 0, name: "" },
      });
      setPhotos([]);
    } catch (error) {
      console.error("Error creating product:", error);
      setErrorMsg("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
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

            <Checkbox label="In Stock" checked={formData.stockAmount > 0} />

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
