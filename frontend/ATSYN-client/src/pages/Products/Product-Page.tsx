import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  RangeSlider,
} from "@mantine/core";
import {
  IconHeart,
  IconHeartBroken,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { apiService } from "../../config/api";
import { useCart } from "../../components/Cart/CartContext";
import CartToast from "../../components/Cart/CartToast";
import { Anchor } from "@mantine/core";

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

export default function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const hasFetched = useRef(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  //setting categories based on backend
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  //filtering products
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

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange]);

  //get data from backend
  const fetchData = async () => {
    try {
      const data: Product[] = await apiService.get("/Product");

      const visibleProducts = data.filter((product) => product.isVisible);
      setProducts(visibleProducts);

      const uniqueCategories: Category[] = Array.from(
        new Map(
          visibleProducts.map((product: Product) => [
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
  useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, []);

  //setting price range for more filtering
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);
    }
  }, [products]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setPriceRange([minPrice, maxPrice]);
    setSearchParams({});
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (p: Product) => {
      addToCart(p, 1);
      setToastProduct(p.title);
      setShowToast(true);
    };

    const primaryPhoto =
      product.photos?.find((p) => p.isPrimary) || product.photos?.[0];
    const imageUrl = primaryPhoto
      ? apiService.getImageUrl(primaryPhoto.id)
      : product.imageUrl || "";

    return (
      <Card
        className="product-card"
        styles={{
          root: {
            background: "linear-gradient(145deg, #2a2a2a, #1f1f1f)",
            border: "1px solid #333",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 20px 40px rgba(138, 0, 196, 0.3)",
            },
          },
        }}
      >
        <Card.Section>
          <div style={{ position: "relative" }}>
            {imageUrl ? (
              <Anchor href={`/product/${product.id}`} underline="never">
                <Image
                  className="product-image"
                  src={imageUrl}
                  alt={primaryPhoto?.altText || product.title}
                  height={200}
                  fit="contain"
                  fallbackSrc="https://placehold.co/400x300?text=No+Image"
                />
              </Anchor>
            ) : (
              <Anchor href={`/product/${product.id}`} underline="never">
                <Center h={200} bg="gray.1">
                  <Text c="dimmed">No Image Available</Text>
                </Center>
              </Anchor>
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

        <Stack
          gap="md"
          mt="md"
          style={{ flex: 1, justifyContent: "space-between" }}
        >
          <div>
            <Title className="product-title" order={3} lineClamp={2} mb="sm">
              <Anchor
                href={`/product/${product.id}`}
                underline="never"
                style={{ color: "inherit" }}
              >
                {product.title}
              </Anchor>
            </Title>

            {product.description && (
              <Text className="product-description" lineClamp={3} mb="sm">
                {product.description}
              </Text>
            )}

            <Group className="price-amount" mb="sm">
              <Text>${product.price.toFixed(2)}</Text>
            </Group>

            <Group justify="space-between" mb="md">
              <div>
                <Text>Category:</Text>
                <Badge className="category-tag">{product.category.name}</Badge>
              </div>
              <div>
                <Text className="stock-badge">Stock:</Text>
                <Text className="stock-count">{product.stockAmount}</Text>
              </div>
            </Group>
          </div>

          <Button
            className="add-to-cart-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(product);
            }}
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
            <Group
              justify="space-between"
              align="flex-start"
              gap="md"
              wrap="wrap"
            >
              <Group gap="sm" style={{ flex: 1 }}>
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

                <div style={{ minWidth: 250, maxWidth: 300 }}>
                  <Text size="xs" mb={4} c="dimmed">
                    Price: ${priceRange[0]} - ${priceRange[1]}
                  </Text>
                  <RangeSlider
                    value={priceRange}
                    onChange={setPriceRange}
                    min={minPrice}
                    max={maxPrice}
                    step={1}
                    minRange={0}
                    size="sm"
                    styles={{
                      thumb: { borderWidth: 1, padding: 2 },
                      track: { height: 4 },
                      bar: { height: 4 },
                    }}
                  />
                </div>
              </Group>

              {(searchTerm ||
                selectedCategory ||
                priceRange[0] !== minPrice ||
                priceRange[1] !== maxPrice) && (
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
