import {
  Container,
  Grid,
  Image,
  Title,
  Text,
  GridCol,
  Select,
} from "@mantine/core";
import { useEffect, useState } from "react";

//https://148896138.cdn6.editmysite.com/uploads/1/4/8/8/148896138/23NCB5VZT2CNCWXZ3BH4YKPU.jpeg?width=2560&optimize=medium
//^^ Image example. Not sure how we're storing images yet.

function ProductPage() {
  const productSample = {
    id: 1,
    title: "Sample Product Name",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.",
    price: 34.99,
    stockAmount: 30,
    inStock: true,
    image:
      "https://148896138.cdn6.editmysite.com/uploads/1/4/8/8/148896138/23NCB5VZT2CNCWXZ3BH4YKPU.jpeg?width=2560&optimize=medium",
  };

  const [quantity, setQuantity] = useState<string | null>('1');
  const quantityOptions = Array.from({ length: Math.min(productSample.stockAmount, 10)}, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1)
  }));





  return (
    <Container>
      <Grid gutter={{base: 5, xs: 'md', md: 'xl', xl: 50}}>
        <Grid.Col span={4}>
          <Image src={productSample.image} radius="md" />
        </Grid.Col>

        <Grid.Col span={4}>
          <Title order={1} mb="md">
            {productSample.title}
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

export default ProductPage;
