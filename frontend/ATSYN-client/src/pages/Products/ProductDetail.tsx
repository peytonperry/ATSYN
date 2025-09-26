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
import { apiService } from "../../config/api";
import { useParams } from "react-router-dom";
import { useCart } from "../../components/Cart/CartContext";

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
  const [shippingOption, setShippingOption] = useState("shipping");
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState("");
  const { id } = useParams();

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product && quantity) {
      const productToAdd = {
        ...product,
        selectedQuantity: parseInt(quantity),
        selectedShipping: shippingOption,
      };

      addToCart(productToAdd);
      setToastProduct(product.title);
      setShowToast(true);
    }
  };

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
    <Container size="lg">
      <Grid>
        {/* Left */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Image src={product?.imageUrl} radius="sm" fit="contain" h={400} />
        </Grid.Col>

        {/* Middle*/}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            <Title order={1}>{product?.title}</Title>
            <Text size="md">{product?.description}</Text>
          </Stack>
        </Grid.Col>

        {/* Right */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Stack gap="md">
              <Text size="xl" fw={700}>
                ${product?.price}
              </Text>
              <Text size="sm">Free Returns</Text> {/* Will change */}
              <Text size="sm">Free Delivery</Text> {/* Will change */}
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
                <Radio.Group
                  value={shippingOption}
                  onChange={setShippingOption}
                >
                  <Stack>
                    <Radio value="shipping" label="Shipping" />
                    <Radio value="delivery" label="Local delivery" />
                    <Radio value="pickup" label="Store Pickup" />
                  </Stack>
                </Radio.Group>
                {/* Quantity of items and shipping option will need to be in a form*/}
              </div>
              <Button
                className="btn"
                fullWidth
                size="md"
                variant="outline"
                onClick={handleAddToCart}
                disabled={!product?.inStock || !quantity}
              >
                {product?.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default ProductDetailPage;
