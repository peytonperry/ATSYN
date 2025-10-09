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
  Accordion,
  AccordionControl,
  AccordionPanel,
  Rating,
  Group,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { apiService } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../components/Cart/CartContext";
import CartToast from "../../components/Cart/CartToast";
import { useAuth } from "../../components/Auth/AuthContext";

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
  reviewCount: number;
  averageRating: number;
  categoryId: number;
  stockAmount: number;
  isVisible: boolean;
  shippingTypeId: number;
  inStock: boolean;
  imageUrl: string;
  category: Category;
  photos: Photo[];
}

interface Review {
  id: number;
  productId: number;
  rating: number;
  title: string;
  comment: string;
  userName: string;
}

const shippingInfo =
  "We currently ship through USPS. Rates and tracking are updated directly from USPS. We will ship orders received within 1-2 business days of order receipt.";
const returnInfo =
  "Returns on sterilized products are not valid if they have been opened. Returns are only eligible within 30 days from receipt. Proof of purchase necessary. ATSYN does not offer returns of funds directly. Store credit will be issued for returned items. For all questions or concerns regarding returns contact: customerservice@alltheshityouneed.com";

function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [shippingOption, setShippingOption] = useState("shipping");
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState("");
  const [quantity, setQuantity] = useState<string | null>("1");
  const { id } = useParams();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product && quantity) {
      addToCart(product, parseInt(quantity));
      setToastProduct(product.title);
      setShowToast(true);
    }
  };

  function ReviewButton() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleClick = () => {
      if (user) {
        navigate(`/write-review/${product?.id}`);
      } else {
        navigate("/login", { state: { from: `/write-review/${product?.id}` } });
      }
    };

    return <Button onClick={handleClick}>Write a review</Button>;
  }

  const fetchData = async () => {
    try {
      const productData: Product = await apiService.get(`/Product/${id}`);
      const reviewData: Review[] = await apiService.get(
        `/Review/product/${id}`
      );

      setProduct(productData);
      setReviews(reviewData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
    }
  };
  const primaryPhoto =
    product?.photos?.find((p) => p.isPrimary) || product?.photos?.[0];
  const imageUrl = primaryPhoto
    ? apiService.getImageUrl(primaryPhoto.id)
    : product?.imageUrl || "";

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
          <Image src={imageUrl} radius="sm" fit="contain" h={400} />
        </Grid.Col>

        {/* Middle*/}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            <Title order={1}>{product?.title}</Title>
            <Group>
              <Rating value={product?.averageRating} fractions={2} readOnly />
              <Text>{product?.reviewCount} Reviews</Text>
            </Group>
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
          <Accordion>
            <Accordion.Item value="returns">
              <AccordionControl>Shipping & Returns</AccordionControl>
              <AccordionPanel>
                <Text fw={500}>Shipping</Text>
                <Text>{shippingInfo}</Text>
                <br />
                <Text fw={500}>Returns</Text>
                <Text>{returnInfo}</Text>
              </AccordionPanel>
            </Accordion.Item>
          </Accordion>
        </Grid.Col>
        <Grid.Col span={12}>
          <Paper p="md" radius="md" mt="xl">
            <Group justify="space-between">
              <Title order={2}>{product?.reviewCount || 0} Reviews</Title>
              <ReviewButton />
            </Group>

            {reviews.map((review) => (
              <div key={review.id}>
                <Paper withBorder p="md" radius="md" mt="xl">
                  <Text fw={500}>{review.userName}</Text>
                  <Group>
                    <Rating value={review.rating} readOnly />
                    <Text fw={700}>{review.title}</Text>
                  </Group>
                  <Text>{review.comment}</Text>
                </Paper>
              </div>
            ))}
          </Paper>
        </Grid.Col>
      </Grid>
      <CartToast
        show={showToast}
        productName={toastProduct}
        onClose={() => setShowToast(false)}
      />
    </Container>
  );
}

export default ProductDetailPage;
