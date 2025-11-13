import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Image,
  ActionIcon,
  Divider,
  Badge,
  Box,
  TextInput,
  Collapse,
  SegmentedControl,
  NumberInput,
} from "@mantine/core";
import {
  IconTrash,
  IconMinus,
  IconPlus,
  IconShoppingCart,
  IconMail,
  IconTruck,
  IconBuilding,
} from "@tabler/icons-react";
import { useCart } from "../../components/Cart/CartContext";
import { apiService } from "../../config/api";
import { PaymentForm } from "../../components/Stripe/PaymentForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/Auth/AuthContext";
import { useField } from "@mantine/form";


const CartPage: React.FC = () => {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [guestEmail, setGuestEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isPickup, setIsPickup] = useState(false);

  const subtotal = state.totalPrice;
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const totalInCents = Math.round(total * 100);

  const field = useField({
    initialValue: "",
  });

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const getProductImageUrl = (product: any) => {
    const primaryPhoto =
      product.photos?.find((p: any) => p.isPrimary) || product.photos?.[0];
    return primaryPhoto
      ? apiService.getImageUrl(primaryPhoto.id)
      : product.imageUrl || "";
  };

  const handleProceedToCheckout = () => {
  if (user) {
    setShowAddressForm(true); // Show address form for logged-in users
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!guestEmail) {
      setEmailError("Email is required");
      return;
    }

    if (!emailRegex.test(guestEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setShowAddressForm(true); // Show address form for guests
  }

  };


  const handlePaymentSuccess = async () => {

  const newOrder = {
    id: 0,
    orderNumber: `ORD-${Date.now()}`, // Temporary order number
    orderDate: new Date().toISOString(),
    customerName: customerName.trim() || user?.email?.split('@')[0] || "Guest",
    customerEmail: user?.email || guestEmail,
    shippingAddress: shippingAddress.trim() || "Pick Up In Store",
    isPickup: false,
    billingAddress: billingAddress.trim() || "Address to be provided",
    subTotal: subtotal,
    taxAmount: tax,
    shippingCost: shipping,
    totalAmount: total,
    status: 1, 
    statusName: "Pending",
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    orderItems: state.items.map((item) => ({
      id: 0, //temporary 
      productId: item.product.id,
      productName: item.product.title,
      unitPrice: item.product.price,
      quantity: item.quantity,
      totalPrice: item.product.price * item.quantity,
    })),
  };

  try {
    const response = await apiService.post('/Orders', newOrder);
    
    console.log('Order created successfully:', response);

    navigate("/order-success", {
      state: {
        order: response,
        email: newOrder.customerEmail,
      },
    });

    clearCart();
  } catch (error) {
    console.error('Order creation failed:', error);
    // TODO: Show error notification to user
    handlePaymentError('Failed to create order. Please contact support.');
  }
};

  const handlePaymentError = (error: string) => {
    console.log(error);
    // TODO: Add toast notification
  };

  if (state.items.length === 0) {
    return (
      <Container size="lg" py={60}>
        <Paper p={60} withBorder radius="md">
          <Stack align="center" gap={24}>
            <IconShoppingCart
              size={64}
              stroke={1.5}
              style={{ color: "#adb5bd" }}
            />
            <Title order={2}>Your cart is empty.</Title>
            <Text c="dimmed" size="lg">
              Add some products to get started!
            </Text>
            <Button component="a" href="/products" size="lg" radius="md">
              Continue Shopping
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py={40}>
      <Stack gap={32}>
        <Group justify="space-between" wrap="nowrap">
          <div>
            <Title order={1} size={32}>
              Your Cart
            </Title>
            <Text c="dimmed" size="sm" mt={4}>
              {state.totalItems} items
            </Text>
          </div>
          <Button
            variant="outline"
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={clearCart}
            radius="md"
          >
            Clear Cart
          </Button>
        </Group>

        <Grid gutter={24}>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap={16}>
              {state.items.map((item) => {
                const imageUrl = getProductImageUrl(item.product);

                return (
                  <Paper key={item.product.id} p={20} withBorder radius="md">
                    <Group align="flex-start" wrap="nowrap" gap={20}>
                      <Box style={{ width: 120, flexShrink: 0 }}>
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.product.title}
                            radius="md"
                            h={120}
                            w={120}
                            fit="cover"
                          />
                        ) : (
                          <Box
                            h={120}
                            w={120}
                            bg="gray.1"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "8px",
                            }}
                          >
                            <Text size="sm" c="dimmed">
                              No Image
                            </Text>
                          </Box>
                        )}
                      </Box>

                      <Stack gap={12} style={{ flex: 1 }}>
                        <div>
                          <Title order={4} size={18}>
                            {item.product.title}
                          </Title>
                          <Badge
                            variant="light"
                            color="purple"
                            size="sm"
                            mt={6}
                            radius="sm"
                          >
                            {item.product.category.name}
                          </Badge>
                        </div>

                        <Group
                          justify="space-between"
                          align="flex-end"
                          wrap="wrap"
                        >
                          <div>
                            <Text size="xl" fw={700} c="purple">
                              ${item.product.price.toFixed(2)}
                            </Text>
                            <Text size="sm" c="dimmed">
                              Total: $
                              {(item.product.price * item.quantity).toFixed(2)}
                            </Text>
                          </div>

                          <Group gap={8}>
                            <ActionIcon
                              variant="default"
                              size="lg"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              radius="md"
                            >
                              <IconMinus size={16} />
                            </ActionIcon>
                            <NumberInput
                              hideControls
                              size="sm"
                              fw={600}
                              min={1}
                              max={99}
                              style={{
                                minWidth: 40,
                                maxWidth: 60,
                                textAlign: "center",
                              }}
                              value={item.quantity}
                              onChange={(value) => {
                                const newQuantity =
                                  typeof value === "number"
                                    ? value
                                    : parseInt(value) || 1;
                                handleQuantityChange(
                                  item.product.id,
                                  newQuantity
                                );
                              }}
                            />

                            <ActionIcon
                              variant="default"
                              size="lg"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              radius="md"
                            >
                              <IconPlus size={16} />
                            </ActionIcon>
                          </Group>
                        </Group>

                        <Button
                          variant="outline"
                          color="red"
                          size="xs"
                          leftSection={<IconTrash size={14} />}
                          onClick={() => removeFromCart(item.product.id)}
                          radius="md"
                          style={{ width: "fit-content" }}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper
              p={24}
              withBorder
              radius="md"
              style={{ position: "sticky", top: 20 }}
            >
              <Stack gap={20}>
                <Title order={3} size={22}>
                  Order Summary
                </Title>

                <Divider />

                <Stack gap={8}>
                  {state.items.map((item) => (
                    <Group key={item.product.id} justify="space-between">
                      <Text size="sm" c="dimmed">
                        {item.product.title} x{item.quantity}
                      </Text>
                      <Text size="sm" fw={500}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Text>
                    </Group>
                  ))}
                </Stack>

                <Divider />

                <Stack gap={8}>
                  <Group justify="space-between">
                    <Text>Subtotal ({state.totalItems} items):</Text>
                    <Text fw={500}>${state.totalPrice.toFixed(2)}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Shipping:</Text>
                    <Text fw={500}>$5.99</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Tax:</Text>
                    <Text fw={500}>
                      ${(state.totalPrice * 0.08).toFixed(2)}
                    </Text>
                  </Group>
                </Stack>

                <Divider />

                <Group justify="space-between">
                  <Text size="lg" fw={700}>
                    Total:
                  </Text>
                  <Text size="xl" fw={700} c="purple">
                    ${isPickup? (total-5.99).toFixed(2):total.toFixed(2)}
                  </Text>
                </Group>

                {!user && !showPaymentForm && (
                  <>
                    <Divider />
                    <Stack gap="xs">
                      <Text size="sm" fw={500}>
                        Email for Order Confirmation
                      </Text>
                      <TextInput
                        placeholder="your.email@example.com"
                        value={guestEmail}
                        onChange={(e) => {
                          setGuestEmail(e.target.value);
                          setEmailError("");
                        }}
                        error={emailError}
                        leftSection={<IconMail size={16} />}
                        size="md"
                      />
                      <Text size="xs" c="dimmed">
                        Already have an account?{" "}
                        <Text
                          component="a"
                          href="/login"
                          c="purple"
                          inherit
                          style={{ cursor: "pointer" }}
                        >
                          Sign in
                        </Text>
                      </Text>
                    </Stack>
                  </>
                )}

                {(user || (showPaymentForm && guestEmail)) && (
                  <Paper p="sm" withBorder bg="dark.6" radius="md">
                    <Group gap="xs">
                      <IconMail size={16} />
                      <Text size="sm">
                        Confirmation to:{" "}
                        <Text component="span" fw={500} c="purple">
                          {user?.email || guestEmail}
                        </Text>
                      </Text>
                    </Group>
                  </Paper>
                )}

                {showAddressForm ? (
                  <>
                    <Divider />
                    <Stack gap="xs">
                      <Text size="sm" fw={500}>Delivery Method</Text>
                      <SegmentedControl
                        value={isPickup ? "pickup" : "delivery"}
                        onChange={(value) => setIsPickup(value === "pickup")}
                        fullWidth
                        data={[
                          {
                            label: (
                              <Group gap="xs" justify="center">
                                <IconTruck size={16} />
                                <span>Delivery</span>
                              </Group>
                            ),
                            value: "delivery",
                          },
                          {
                            label: (
                              <Group gap="xs" justify="center">
                                <IconBuilding size={16} />
                                <span>Pickup</span>
                              </Group>
                            ),
                            value: "pickup",
                          },
                        ]}
                      />
                    </Stack>

                    <Divider />
                    
                    <Stack gap="xs">
                      <Text size="sm" fw={500}>
                        {isPickup ? "Pickup Information" : "Shipping Information"}
                      </Text>
                      <TextInput
                        placeholder="Full Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                      {!isPickup && (
                        <TextInput
                          placeholder="Shipping Address"
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                        />
                      )}
                      <TextInput
                        placeholder="Billing Address"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        required
                      />  
                    </Stack>
    
                    <Divider />
    
                    <PaymentForm
                      amount={totalInCents}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </>
                  ) : (
                    <Button
                      size="lg"
                      fullWidth
                      radius="md"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                    </Button>
              )}

                <Button
                  component="a"
                  href="/products"
                  variant="subtle"
                  fullWidth
                  radius="md"
                  color="purple"
                >
                  Continue Shopping
                </Button>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default CartPage;
