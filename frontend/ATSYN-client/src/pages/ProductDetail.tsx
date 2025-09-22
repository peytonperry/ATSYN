import { Container, Grid, Image, Title, Text, Select } from "@mantine/core";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../config/api";

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
};

function ProductDetailPage() {

  const [product, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data: Product[] = await apiService.get("/api/Product/{id");
      console.log(data);
      setProduct(data);

      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
    }
  }
  /*const [quantity, setQuantity] = useState<string | null>("1");
  const quantityOptions = Array.from(
    { length: Math.min(singleProduct.stockAmount, 10) },
    (_, i) => ({
      value: String(i + 1),
      label: String(i + 1),
    })
  );*/

  return (
    <Container>
      <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
        <Grid.Col span={4}>
          <Image src={product.imageUrl} radius="md" />
        </Grid.Col>

        <Grid.Col span={4}>
          <Title order={1} mb="md">
            {product.title}
          </Title>
          <Text size="xl" mb="md">
            {productSample.price}
          </Text>
          <Text size="lg" mb="md">
            {productSample.description}
          </Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Select data={quantityOptions} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default ProductDetailPage;
