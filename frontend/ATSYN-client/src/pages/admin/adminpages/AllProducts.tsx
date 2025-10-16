import { useEffect, useRef, useState } from "react";
import "./AllProducts.css";
import { apiService } from "../../../config/api";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
  Stack,
  Table,
} from "@mantine/core";

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
const AllProducts = () => {
  const [Products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"table" | "card">("card");
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const data: Product[] = await apiService.get("/Product");
      setProducts(data);
      console.log(data);
      const sorted = data.sort((a, b) =>
        a.title.localeCompare(b.title, "en", { sensitivity: "base" })
      );

      setProducts(sorted);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      console.log(Products);
      hasFetched.current = true;
    }
  }, []);
  const getProductImageUrl = (product: Product) => {
    const primaryPhoto =
      product.photos?.find((p) => p.isPrimary) || product.photos?.[0];
    return primaryPhoto
      ? apiService.getImageUrl(primaryPhoto.id)
      : product.imageUrl || "";
  };

  return (
    <Container size="xl" className="products-page" py="md">
      <Group justify="space-between" mb="md">
        <Text fw={600} size="xl">
          Product Management
        </Text>

        <Group>
          <Button
            variant={view === "card" ? "filled" : "outline"}
            color={view === "card" ? "#8a00c4" : "white"}
            onClick={() => setView("card")}
          >
            Card View
          </Button>
          <Button
            variant={view === "table" ? "filled" : "outline"}
            color={view === "table" ? "#8a00c4" : "white"}
            onClick={() => setView("table")}
          >
            Table View
          </Button>
        </Group>
      </Group>

      {view === "card" ? (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing="lg"
          className="products-grid"
        >
          {Products.map((p) => (
            <Card
              key={p.id}
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              onClick={() => navigate(`/admin/products/${p.id}`)}
              className="product-card"
              style={{ cursor: "pointer" }}
            >
              <Card.Section>
                <img
                  src={getProductImageUrl(p) || "https://via.placeholder.com/300x300"}
                  alt={p.title}
                  height={180}
                  style={{ objectFit: "cover", width: "100%" }}
                />
              </Card.Section>

              <Stack gap={4} mt="sm">
                <Text fw={600}>{p.title}</Text>
                <Text c="#8a00c4" fw={500}>
                  ${p.price.toFixed(2)}
                </Text>
                <Text
                  size="sm"
                  c={p.stockAmount > 0 ? "green" : "red"}
                  fw={500}
                >
                  {p.stockAmount > 0
                    ? `${p.stockAmount} in stock`
                    : "Out of stock"}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Table
          highlightOnHover
          withColumnBorders
          withTableBorder
          captionSide="top"
          verticalSpacing="sm"
          className="product-table"
        >
          <Table.Thead>
            <Table.Tr color="#8a00c4">
              <Table.Th bg = "#8a00c4">Name</Table.Th>
              <Table.Th ta="right" bg = "#8a00c4">Price</Table.Th>
              <Table.Th ta="right" bg = "#8a00c4">Stock</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {Products.map((p) => (
              <Table.Tr
                key={p.id}
                onClick={() => navigate(`/admin/products/${p.id}`)}
                style={{ cursor: "pointer" }}
              >
                <Table.Td fw={500}>{p.title}</Table.Td>
                <Table.Td ta="right">${p.price.toFixed(2)}</Table.Td>
                <Table.Td ta="right">
                  <Text c={p.stockAmount > 0 ? "green" : "red"}>
                    {p.stockAmount > 0
                      ? `${p.stockAmount} in stock`
                      : "Out of stock"}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Container>
  );
};

export default AllProducts;
