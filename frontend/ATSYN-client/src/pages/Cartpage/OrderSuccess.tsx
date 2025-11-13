import React, { useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Group,
  ThemeIcon,
  Divider,
  Box,
} from "@mantine/core";
import { IconCheck, IconShoppingBag, IconHome } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Add confetti or celebration animation here
    console.log("Order placed successfully!");
  }, []);

  return (
    <Container size="sm" py={80}>
      <Paper p={40} withBorder radius="lg" shadow="md">
        <Stack align="center" gap={24}>
          <ThemeIcon
            size={100}
            radius="xl"
            variant="light"
            color="green"
            style={{
              border: "4px solid var(--mantine-color-green-6)",
            }}
          >
            <IconCheck size={60} stroke={2.5} />
          </ThemeIcon>

          <Stack align="center" gap={8}>
            <Title order={1} size={32} ta="center">
              Thank You for Your Purchase!
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              Your order has been successfully placed
            </Text>
          </Stack>

          <Divider w="100%" />

          <Paper p="md" withBorder bg="dark.6" radius="md" w="100%">
            <Stack gap="sm">
              <Text size="sm" fw={500} c="dimmed">
                What happens next?
              </Text>
              <Group gap="xs">
                <Text size="sm">✓</Text>
                <Text size="sm">
                  You'll receive an email confirmation shortly
                </Text>
              </Group>
              <Group gap="xs">
                <Text size="sm">✓</Text>
                <Text size="sm">
                  Track your order status in "My Orders"
                </Text>
              </Group>
            </Stack>
          </Paper>

          <Divider w="100%" />

          <Stack gap="md" w="100%">
            <Button
              size="lg"
              fullWidth
              leftSection={<IconShoppingBag size={20} />}
              onClick={() => navigate("/orders")}
            >
              View My Orders
            </Button>

            <Button
              size="lg"
              fullWidth
              variant="light"
              leftSection={<IconHome size={20} />}
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>

            <Button
              size="md"
              fullWidth
              variant="subtle"
              color="purple"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
          </Stack>

          <Box mt="md">
            <Text size="sm" c="dimmed" ta="center">
              Need help? Contact us at{" "}
              <Text component="a" href="/contact" c="purple" inherit>
                support@atsyn.com
              </Text>
            </Text>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default OrderSuccessPage;