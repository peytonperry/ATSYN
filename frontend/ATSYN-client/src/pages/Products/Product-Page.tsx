import { useEffect, useRef, useState } from "react";
import {
  Container,
  Title,
  Text,
  TextInput,
  Select,
  Button,
  Card,
  Image,
  Badge,
  Group,
  Stack,
  Loader,
  Center,
  Grid,
  Paper,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { apiService } from "../../config/api";
import { useCart } from "../../components/Cart/CartContext";
import CartToast from "../../components/Cart/CartToast";

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

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const hasFetched = useRef(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState("");

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category.name === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const fetchData = async () => {
    try {
      const data: Product[] = await apiService.get("/Product");
      console.log(data);
      setProducts(data);

      const uniqueCategories: Category[] = Array.from(
        new Map(
          data.map((product: Product) => [
            product.category.id,
            product.category,
          ])
        ).values()
      );
      setCategories(uniqueCategories);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, []);

  const ProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (product: Product) => {
      addToCart(product);
      setToastProduct(product.title);
      setShowToast(true);
    };

    const convertGoogleDriveUrl = (url: string) => {
      if (url.includes("drive.google.com")) {
        const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
        if (fileId) {
          return `https://lh3.googleusercontent.com/d/${fileId}`;
        }
      }
      return url;
    };

    return (
      <Card
        className="product-card"
        styles={{
          root: {
            background: "linear-gradient(145deg, #2a2a2a, #1f1f1f)",
            border: "1px solid #333",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 20px 40px rgba(138, 0, 196, 0.3)",
            },
          },
        }}
      >
        <Card.Section>
          <div style={{ position: "relative" }}>
            {product.imageUrl ? (
              <Image
                className="product-image"
                src={convertGoogleDriveUrl(product.imageUrl)}
                alt={product.title}
                height={200}
                fallbackSrc="https://placehold.co/400x300?text=No+Image"
                onError={() => {
                  console.log(
                    "Image failed to load:",
                    convertGoogleDriveUrl(product.imageUrl)
                  );
                }}
                onLoad={() => {
                  console.log(
                    "Image loaded successfully:",
                    convertGoogleDriveUrl(product.imageUrl)
                  );
                }}
              />
            ) : (
              <Center h={200} bg="gray.1">
                <Text c="dimmed">No Image Available</Text>
              </Center>
            )}

            <Group
              gap="xs"
              style={{ position: "absolute", top: 10, right: 10 }}
            >
              <Badge color={product.inStock ? "green" : "red"} variant="filled">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
              {!product.isVisible && (
                <Badge color="gray" variant="filled">
                  Hidden
                </Badge>
              )}
            </Group>
          </div>
        </Card.Section>

        <Stack gap="md" mt="md">
          <Title className="product-title" order={3} lineClamp={2}>
            {product.title}
          </Title>

          {product.description && (
            <Text className="product-description" lineClamp={3}>
              {product.description}
            </Text>
          )}

          <Group className="price-amount">
            <Text>${product.price.toFixed(2)}</Text>
          </Group>

          <Group justify="space-between">
            <div>
              <Text>Category:</Text>
              <Badge className="category-tag">{product.category.name}</Badge>
            </div>
            <div>
              <Text className="stock-badge">Stock:</Text>
              <Text className="stock-count">{product.stockAmount}</Text>
            </div>
          </Group>

          <Button
            className="add-to-cart-btn"
            onClick={() => handleAddToCart(product)}
            disabled={!product.inStock}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </Stack>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Center h={400}>
          <Stack align="center" gap="md">
            <Title order={2}>Loading Products...</Title>
            <Loader size="lg" />
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xl">
            Our Products
          </Title>

          <Paper
            p="md"
            mb="sm"
            radius="lg"
            withBorder
            style={{
              backgroundColor: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <Group justify="space-between" align="center" gap="md" wrap="wrap">
              <Group gap="sm" grow>
                <TextInput
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.currentTarget.value)}
                  leftSection={<IconSearch size={16} />}
                  size="md"
                  w={{ base: "100%", sm: 260, md: 320 }}
                />

                <Select
                  placeholder="All Categories"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  data={categories.map((cat) => ({
                    value: cat.name,
                    label: cat.name,
                  }))}
                  clearable
                  size="md"
                  w={{ base: "100%", sm: 200 }}
                />
              </Group>

              {(searchTerm || selectedCategory) && (
                <Button
                  variant="light"
                  color="purple"
                  leftSection={<IconX size={16} />}
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              )}
            </Group>
          </Paper>

          <Text size="sm" mb="md" c="dimmed">
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && (
              <Text span fw={700}>
                {" "}
                for "{searchTerm}"
              </Text>
            )}
            {selectedCategory && (
              <Text span fw={700}>
                {" "}
                in {selectedCategory}
              </Text>
            )}
          </Text>
        </div>

        <Grid>
          {filteredProducts.map((product) => (
            <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} />
            </Grid.Col>
          ))}
        </Grid>

        {filteredProducts.length === 0 && products.length > 0 && (
          <Paper p="xl" withBorder>
            <Center>
              <Stack align="center" gap="md">
                <Title order={3}>No products found</Title>
                <Text c="dimmed">
                  Try adjusting your search or filter criteria
                </Text>
                <Button onClick={clearFilters} variant="light">
                  Clear Filters
                </Button>
              </Stack>
            </Center>
          </Paper>
        )}

        {products.length === 0 && !loading && (
          <Paper p="xl" withBorder>
            <Center>
              <Stack align="center" gap="md">
                <Title order={3}>No products found</Title>
                <Text c="dimmed">Check back later for new products!</Text>
              </Stack>
            </Center>
          </Paper>
        )}
      </Stack>

      <CartToast
        show={showToast}
        productName={toastProduct}
        onClose={() => setShowToast(false)}
      />
    </Container>
  );
}
