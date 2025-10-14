import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Box,
  Grid,
  Card,
  Image,
  Group,
  Button,
  Loader,
  Center,
} from "@mantine/core";
import backgroundimage from "./ATSYN_Logo.png";
import { apiService } from "../../config/api";

interface Photo {
  id: number;
  isPrimary: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  imageUrl?: string;
  photos?: Photo[];
  category: Category;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleViewCategory = (categoryName: string) => {
    navigate(`/products?category=${categoryName}`);
  };

  const getProductsByCategory = (categoryName: string) => {
    return products.filter((p) => p.category.name === categoryName).slice(0, 4);
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const primaryPhoto =
      product.photos?.find((p) => p.isPrimary) || product.photos?.[0];
    const imageUrl = primaryPhoto
      ? apiService.getImageUrl(primaryPhoto.id)
      : product.imageUrl || "";

    const handleProductClick = () => {
      navigate(`/product/${product.id}`);
    };

    return (
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ cursor: "pointer" }}
        onClick={handleProductClick}
      >
        <Card.Section>
          <Image
            src={imageUrl || "https://via.placeholder.com/200"}
            height={160}
            alt={product.name}
          />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500} size="sm" lineClamp={2}>
            {product.name}
          </Text>
        </Group>

        <Text size="xl" fw={700} c="#b758ff">
          ${product.price.toFixed(2)}
        </Text>
      </Card>
    );
  };

  const CategorySection = ({
    title,
    categoryName,
  }: {
    title: string;
    categoryName: string;
  }) => {
    const categoryProducts = getProductsByCategory(categoryName);

    return (
      <Box mb={60}>
        <Group justify="space-between" mb="xl">
          <Title order={2} size="h2" c="white">
            {title}
          </Title>
          <Button
            variant="outline"
            size="md"
            color="violet"
            onClick={() => handleViewCategory(categoryName)}
          >
            View All {title}
          </Button>
        </Group>

        {loading ? (
          <Center h={200}>
            <Loader size="lg" color="violet" />
          </Center>
        ) : categoryProducts.length === 0 ? (
          <Text c="dimmed" ta="center" py={40}>
            No products available in this category
          </Text>
        ) : (
          <Grid gutter="md">
            {categoryProducts.map((product) => (
              <Grid.Col
                key={product.id}
                span={{ base: 12, xs: 6, sm: 6, md: 3 }}
              >
                <ProductCard product={product} />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Box>
    );
  };

  return (
    <Box style={{ position: "relative", minHeight: "100vh" }}>
      <Box
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          zIndex: -2,
        }}
      />

      <Box
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: -1,
        }}
      />

      <Box
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "4rem",
        }}
      >
        <Box style={{ maxWidth: "600px" }}>
          <Title
            order={1}
            className="hero-title"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "1rem",
              textAlign: "left",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            ALL THE SHIT YOU NEED
          </Title>
          <Text
            size="xl"
            c="white"
            style={{
              fontSize: "clamp(1rem, 3vw, 1.5rem)",
              textAlign: "left",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Because shit matters.
          </Text>
        </Box>
      </Box>

      <Box
        style={{
          backgroundColor: "#1a1a1a",
          paddingTop: "4rem",
          paddingBottom: "4rem",
        }}
      >
        <Container size="xl">
          <CategorySection title="Inks" categoryName="Inks" />

          <CategorySection title="Cartridges" categoryName="Cartridges" />
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
