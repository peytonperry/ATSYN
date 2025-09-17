import { Container, Image } from "@mantine/core";

//https://148896138.cdn6.editmysite.com/uploads/1/4/8/8/148896138/23NCB5VZT2CNCWXZ3BH4YKPU.jpeg?width=2560&optimize=medium
//^^ Image example. Not sure how we're storing images yet.

function ProductPage() {
  return (
    <Container>
      <Image
        radius="md"
        h = {200}
        w = "auto"
        src="https://148896138.cdn6.editmysite.com/uploads/1/4/8/8/148896138/23NCB5VZT2CNCWXZ3BH4YKPU.jpeg?width=2560&optimize=medium"
      />
    </Container>
  );
}

export default ProductPage;
