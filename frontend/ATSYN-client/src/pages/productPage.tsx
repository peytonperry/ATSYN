import { Container, Grid, Image, Title, Text } from "@mantine/core";
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

  return (
    <Container>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image src={productSample.image} radius="md" />
        </Grid.Col>

        <Grid.Col span={{base: 12, md: 6}}>
          <Title order={1} mb="md">{productSample.title}</Title>
          <Text size="xl" mb="md">{productSample.price}</Text>
          <Text size="lg" mb="md">{productSample.description}</Text>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default ProductPage;
