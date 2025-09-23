import {
  Container,
  Grid,
  Image,
  Title,
  Text,
  Select,
  Stack,
  Paper,
  Radio,
  Button,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { apiService } from "../config/api";
import { useParams } from "react-router-dom";

interface Category {
  id: number;
  name: string;
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
}

function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const data: Product = await apiService.get(`/api/Product/${id}`);
      console.log(data);
      setProduct(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
    }
  };

  const [quantity, setQuantity] = useState<string | null>("1");

  const quantityOptions = product
    ? Array.from({ length: product.stockAmount }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1),
      }))
    : [];

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <Container size="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Image src={product?.imageUrl} radius="sm" fit="contain" h={400} />
        </Grid.Col>
        {/* Left */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            <Title order={1}>{product?.title}</Title>
            <Text size="md">{product?.description}</Text>
          </Stack>
        </Grid.Col>
        {/* Middle*/}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Stack gap="md">
              <Text size="xl" fw={700}>
                ${product?.price}
              </Text>
              <Text size="sm">Free Returns</Text>
              <Text size="sm">Free Delivery</Text>
            </Stack>

            <div>
              <Text size="sm">Quantity:</Text>
              <Select
                value={quantity}
                onChange={setQuantity}
                data={quantityOptions}
              />
            </div>

            <div>
              <Text size="sm" mb="xs">
                Shipping:
              </Text>
              <Radio.Group value="shipping" name="ShippingOptions">
                <Stack>
                  <Radio label="Shipping" />
                  <Radio label="Local delivery" />
                  <Radio label="Store Pickup" />
                </Stack>
              </Radio.Group>
            </div>
            <Button fullWidth size="md" variant="outline">
              Add to Cart
            </Button>
            <Button fullWidth size="md" variant="outline">
              Buy Now
            </Button>
          </Paper>
        </Grid.Col>
        {/* Right */}
      </Grid>
    </Container>
  );
}

export default ProductDetailPage;
