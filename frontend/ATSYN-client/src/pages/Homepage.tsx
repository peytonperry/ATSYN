import { Container, Text, Paper } from '@mantine/core';
import { Carousel } from '@mantine/carousel'; 
import { Image } from '@mantine/core';

//for Carousel 
const images = [
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
];

function HomePage() {
  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image src={url} />
    </Carousel.Slide>
  ));

  return (
    <Container size="lg" mt="xl">
      <Carousel withIndicators height={200}>
        {slides}
      </Carousel>
      <Paper shadow="md" p="xl" radius="lg">
        <Text ta="center" fz="xl" fw={700}>
           Welcome to ATSYN 
        </Text>
        <Text ta="center" mt="md">
          This is where your hero section, features, and client content will go.
        </Text>
      </Paper>   
    </Container>
  );
}

export default HomePage;