import {
  Container,
  Grid,
  Image,
  Title,
  TextInput,
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
} from "@mantine/core";
import { useEffect, useState } from "react";
import { apiService } from "../../../../../config/api";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetailAdminPage.css";
import { CategorySelect } from "./CategorySelect";

interface Category {
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

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  categoryId: number;
  stockAmount: number;
  isVisible: boolean;
  shippingTypeId: number;
  inStock: boolean;
  imageUrl: string;
  category: Category;
  photos: Photo[];
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data: Product = await apiService.get(`/Product/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  const getProductImageUrl = (product: Product) => {
    const primaryPhoto =
      product.photos?.find((p) => p.isPrimary) || product.photos?.[0];
    return primaryPhoto
      ? apiService.getImageUrl(primaryPhoto.id)
      : product.imageUrl || "";
  };

  const handleUpdate = async () => {
    if (!product) return;
    setSaving(true);
    try {
      await apiService.put(`/Product/${product.id}`, product);
      setMessage("Product updated successfully!");
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
        navigate("/admin/products");
      } catch (error) {
        console.error("Error deleting product:", error);
        setMessage("Failed to delete product.");
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

  return (
    <Container my="md" className="admin-product-container">
      {message && (
        <Notification
          color={message.includes("successfully") ? "green" : "red"}
          onClose={() => setMessage(null)}
          className="admin-product-notification"
        >
          {message}
        </Notification>
      )}

      <Grid gutter="lg">
        <Grid.Col span={6}>
          <div className="admin-product-image">
            <Image
              src={getProductImageUrl(product)}
              alt={product.title}
              height={400}
              fit="contain"
            />
          </div>
        </Grid.Col>

        <Grid.Col span={6}>
          <Paper p="md" radius="lg" className="admin-product-panel">
            <Stack gap="md">
              <Title order={2} className="admin-product-title">
                Edit Product
              </Title>

              <TextInput
                label="Title"
                value={product.title}
                onChange={(e) =>
                  setProduct({ ...product, title: e.currentTarget.value })
                }
              />
              <TextInput
                label="Description"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.currentTarget.value })
                }
              />
              <label>Category</label>
              <CategorySelect
                categories={product.category ? [product.category] : []}
                onCategoryChange={(category: Category) =>
                  setProduct({ ...product, categoryId: category.id })
                }
              />
              <TextInput
                label="Image URL"
                value={product.imageUrl}
                onChange={(e) =>
                  setProduct({ ...product, imageUrl: e.currentTarget.value })
                }
              />
              <NumberInput
                label="Price"
                value={product.price}
                onChange={(value) =>
                  setProduct({ ...product, price: Number(value) || 0 })
                }
                min={0}
              />
              <NumberInput
                label="Stock Amount"
                value={product.stockAmount}
                onChange={(value) =>
                  setProduct({ ...product, stockAmount: Number(value) || 0 })
                }
                min={0}
              />

              <Group justify="space-between" mt="md">
                <Button
                  color="green"
                  onClick={handleUpdate}
                  loading={saving}
                  className="update-btn"
                >
                  Save Changes
                </Button>
                <Button
                  color="red"
                  variant="light"
                  onClick={handleDelete}
                  className="delete-btn"
                >
                  Delete Product
                </Button>
              </Group>

              <Accordion variant="separated" mt="md">
                <Accordion.Item value="shipping">
                  <AccordionControl>Shipping Information</AccordionControl>
                  <AccordionPanel>{shippingInfo}</AccordionPanel>
                </Accordion.Item>
                <Accordion.Item value="returns">
                  <AccordionControl>Return Policy</AccordionControl>
                  <AccordionPanel>{returnInfo}</AccordionPanel>
                </Accordion.Item>
              </Accordion>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProductDetailAdminPage;
