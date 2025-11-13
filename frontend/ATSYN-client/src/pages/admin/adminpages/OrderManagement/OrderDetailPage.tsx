import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../../../../config/api";

import {
  Container,
  Paper,
  Title,
  Text,
  Badge,
  Stack,
  Group,
  Table,
  Divider,
  Button,
  Grid,
  Modal,
  Select,
  Textarea,
} from "@mantine/core";

type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Refunded';

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

interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    product: Product;
}

interface Order {
    id: number;
    orderNumber: number;
    orderDate: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    isPickup: boolean;
    billingAddress: string;
    subTotal: number;
    taxAmount: number;
    shippingCost: number;
    totalAmount: number;
    status: string;
    statusName: OrderStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItem[];
}

const OrderDetail = () =>  {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [statusNotes, setStatusNotes] = useState<string>("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data: Order = await apiService.get(`/Orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        setError("Failed to load order details.");
        console.error("API call failed:", error);
        setTimeout(() => navigate('/admin/order-management'), 3000);
      }
    };
    
    fetchOrderDetails();
  }, [id, navigate]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "yellow";
      case "Confirmed":
        return "purple";
      case "Processing":
        return "blue";
      case "Shipped":
        return "indigo";
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      case "Refunded":
        return "cyan";
      case "Returned":
        return "orange";
      default:
        return "gray";
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      'Pending': 'Confirmed',
      'Confirmed': 'Processing',
      'Processing': 'Shipped',
      'Shipped': 'Delivered',
      'Delivered': 'Returned', 
      'Cancelled': "Refunded", 
      'Returned': 'Refunded',
      'Refunded': null, // Terminal status
    };
    return statusFlow[currentStatus];
  };

  const getAllStatuses = (): OrderStatus[] => {
    return ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refunded'];
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    setSelectedStatus(newStatus);
    setStatusNotes("");
    setConfirmModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!order || !selectedStatus) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      const updatedOrder = {
        ...order,
        statusName: selectedStatus,
        status: selectedStatus, 
        notes: statusNotes.trim() || undefined,
        changedBy: "Admin User"
      };
      
      await apiService.put(`/Orders/${order.id}/status`, updatedOrder);
      

      setOrder(updatedOrder);
      setMessage(`Order status updated to ${selectedStatus} successfully!`);
      setConfirmModalOpen(false);
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error updating order status:", error);
      setMessage("Failed to update order status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleMoveToNextStage = () => {
    if (!order) return;
    const nextStatus = getNextStatus(order.statusName);
    if (nextStatus) {
      handleStatusChange(nextStatus);
    }
  };

  const handleCloseModal = () => {
    setConfirmModalOpen(false);
    setStatusNotes(""); 
  };

  const orderStatus = order?.statusName;

  const getStatusPagePath = (status?: OrderStatus) => {
    return status 
      ? `/admin/${status.toLowerCase()}-orders` 
      : "/admin/order-management";
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Paper p="xl" withBorder>
          <Text c="red" size="lg" ta="center">
            {error}
          </Text>
          <Text size="sm" ta="center" mt="md" c="dimmed">
            Redirecting to order management page...
          </Text>
        </Paper>
      </Container>
    );
  }

  if (!order) {
    return <Container>Order not found</Container>;
  }

  const nextStatus = getNextStatus(order.statusName);
  const isTerminalStatus = nextStatus === null;

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Group>
            <Button
              variant="subtle"
              onClick={() => navigate(getStatusPagePath(orderStatus))}
            >
              ← Back to {orderStatus ? `${orderStatus} Orders` : 'Order Management'}
            </Button>
            <Title order={2}>Order Details</Title>
          </Group>
          <Badge size="lg" color={getStatusColor(order.statusName)} variant="light">
            {order.statusName}
          </Badge>
        </Group>

        {message && (
          <Paper p="md" withBorder bg={message.includes("Failed") ? "#ffe0e0" : "#e0ffe0"}>
            <Text c={message.includes("Failed") ? "red" : "green"} ta="center" fw={500}>
              {message}
            </Text>
          </Paper>
        )}

        <Paper shadow="sm" p="lg" withBorder>
          <Stack gap="md">
            <Title order={3}>Order Status Management</Title>
            <Divider />
            
            <Group justify="space-between" align="center">
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Current Status
                </Text>
                <Badge size="xl" color={getStatusColor(order.statusName)}>
                  {order.statusName}
                </Badge>
              </div>

              <Group>
                {!isTerminalStatus && (
                  <Button
                    color={getStatusColor(nextStatus!)}
                    size="md"
                    onClick={handleMoveToNextStage}
                    disabled={saving}
                  >
                    Move to {nextStatus} →
                  </Button>
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>

                <Text>Change status manually</Text>
                <Select
                  placeholder="Change status manually"
                  data={getAllStatuses().map(status => ({
                    value: status,
                    label: status,
                  }))}
                  value={order.statusName}
                  onChange={(value) => value && handleStatusChange(value as OrderStatus)}
                  disabled={saving}
                  w={220}
                />
                </div>
              </Group>
            </Group>

            {isTerminalStatus && (
              <Text size="sm" c="dimmed" ta="center">
                This order has reached a terminal status. Use manual status selection to change if needed.
              </Text>
            )}
          </Stack>
        </Paper>

        <Modal
          opened={confirmModalOpen}
          onClose={handleCloseModal}
          title="Confirm Status Change"
          centered
        >
          <Stack gap="md">
            <Text component="div">
              Are you sure you want to change the order status from{" "}
              <Badge color={getStatusColor(order.statusName)}>{order.statusName}</Badge>
              {" "}to{" "}
              <Badge color={getStatusColor(selectedStatus!)}>{selectedStatus}</Badge>?
            </Text>

            <Text size="sm" c="dimmed">
              This action will update the order status and may trigger notifications to the customer.
            </Text>

            <Divider />

            <Textarea
              label="Notes (Optional)"
              placeholder="Add notes about this status change (e.g., reason for cancellation, tracking number, etc.)"
              description="These notes will be saved in the order status history"
              value={statusNotes}
              onChange={(event) => setStatusNotes(event.currentTarget.value)}
              minRows={3}
              maxRows={6}
              autosize
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="subtle"
                onClick={() => setConfirmModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                color={getStatusColor(selectedStatus!)}
                onClick={handleConfirmStatusChange}
                loading={saving}
              >
                Confirm Change
              </Button>
            </Group>
          </Stack>
        </Modal>

        <Paper shadow="sm" p="lg" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Order Number
                </Text>
                <Text fw={600} size="lg">
                  {order.orderNumber}
                </Text>
              </div>
              <div style={{ textAlign: "right" }}>
                <Text size="sm" c="dimmed">
                  Order Date
                </Text>
                <Text fw={500}>
                  {new Date(order.orderDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </div>
            </Group>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="lg" withBorder>
          <Stack gap="md">
            <Title order={3}>Customer Information</Title>
            <Divider />
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Name
                </Text>
                <Text fw={500}>{order.customerName}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Email
                </Text>
                <Text fw={500}>{order.customerEmail}</Text>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="lg" withBorder>
          <Stack gap="md">
            <Group>
              <Title order={3}>Shipping Information</Title>
              {order.isPickup && (
                <Badge color="orange">
                  Pickup Order
                </Badge>
              )}
              {!order.isPickup && (
                <Badge color="blue">
                  Delivery
                </Badge>
              )}
            </Group>
            <Divider />
            <div>
              <Text size="sm" c="dimmed">
                Shipping Address
              </Text>
              <Text fw={500}>{order.shippingAddress}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Billing Address
              </Text>
              <Text fw={500}>{order.billingAddress}</Text>
            </div>
            {order.notes && (
              <div>
                <Text size="sm" c="dimmed">
                  Order Notes
                </Text>
                <Text fw={500}>{order.notes}</Text>
              </div>
            )}
          </Stack>
        </Paper>

        <Paper shadow="sm" p="lg" withBorder>
          <Stack gap="md">
            <Title order={3}>Order Items</Title>
            <Divider />
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th bg="#8a00c4">Product</Table.Th>
                  <Table.Th bg="#8a00c4">Category</Table.Th>
                  <Table.Th bg="#8a00c4">Price</Table.Th>
                  <Table.Th bg="#8a00c4">Quantity</Table.Th>
                  <Table.Th bg="#8a00c4">Total</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {order.orderItems.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500}>{item.productName}</Text>
                        <Text size="sm" c="dimmed">
                          {item.product.description}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light">
                        {item.product.category.name}
                      </Badge>
                    </Table.Td>
                    <Table.Td>${item.unitPrice.toFixed(2)}</Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                    <Table.Td>
                      <Text fw={500}>${item.totalPrice.toFixed(2)}</Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="lg" withBorder>
          <Stack gap="md">
            <Title order={3}>Order Summary</Title>
            <Divider />
            <Group justify="space-between">
              <Text>Subtotal</Text>
              <Text fw={500}>${order.subTotal.toFixed(2)}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Tax</Text>
              <Text fw={500}>${order.taxAmount.toFixed(2)}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Shipping</Text>
              <Text fw={500}>
                {order.shippingCost === 0
                  ? "FREE"
                  : `$${order.shippingCost.toFixed(2)}`}
              </Text>
            </Group>
            <Divider />
            <Group justify="space-between">
              <Text size="lg" fw={600}>
                Total
              </Text>
              <Text size="lg" fw={700} style={{ color: "#8a00c4" }}>
                ${order.totalAmount.toFixed(2)}
              </Text>
            </Group>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">
                Created
              </Text>
              <Text size="sm">
                {new Date(order.createdAt).toLocaleString()}
              </Text>
            </div>
            <div style={{ textAlign: "right" }}>
              <Text size="xs" c="dimmed">
                Last Updated
              </Text>
              <Text size="sm">
                {new Date(order.updatedAt).toLocaleString()}
              </Text>
            </div>
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
}

export default OrderDetail;