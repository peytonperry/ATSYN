import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../config/api";
import {
  Container,
  Table,
  Paper,
  Title,
  Badge,
  Text,
  Group,
  Stack,
} from "@mantine/core";

interface OrderDto {
  id: number;
  orderNumber: string;
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
  status: number;
  statusName: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItemDto[];
}

interface OrderItemDto {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

function Orders() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data: OrderDto[] = await apiService.get("/orders");
      setOrders(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
    }
  };

  const getStatusColor = (status: number) => {
    const colors: { [key: number]: string } = {
      0: "gray",
      1: "yellow",
      2: "blue",
      3: "green",
      4: "red",
    };
    return colors[status] || "gray";
  };

  const getTotalItems = (orderItems: OrderItemDto[]) => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Title order={1}>My Orders</Title>

        <Paper shadow="sm" p="md" withBorder>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Order Number</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Items</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {orders.map((order) => (
                <Table.Tr
                  key={order.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <Table.Td>
                    <Text fw={500}>{order.orderNumber}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {getTotalItems(order.orderItems)} item
                      {getTotalItems(order.orderItems) !== 1 ? "s" : ""}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>${order.totalAmount.toFixed(2)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(order.status)} variant="light">
                      {order.statusName}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {orders.length === 0 && (
            <Text ta="center" c="dimmed" py="xl">
              No orders found
            </Text>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}

export default Orders;