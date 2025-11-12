import React, { use, useEffect, useState } from 'react';
import "./OrderManagement.css";
import { apiService } from "../../../../config/api";
import { useNavigate } from 'react-router-dom';
import { Badge, Card, Divider, Group, Loader, ScrollArea, Table, Title, Text, Stack  } from '@mantine/core';
import CancelledOrders from './CancelledOrders';

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

function OrderManagement() {
    // const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    // const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
    // const [searchTerm, setSearchTerm] = useState('');

    //'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Refunded';

    const [orders,  setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = React.useRef(false);
    const [pendingOrders, setPendingOrders] = useState<Order[]>([])
    const [confirmedOrders, setConfirmedOrders] = useState<Order[]>([])
    const [processingOrders, setProcessingOrders] = useState<Order[]>([])
    const [shippedOrders, setShippedOrders] = useState<Order[]>([])
    const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([])
    const [cancelledOrders, setCancelledOrders] = useState<Order[]>([])
    const [returnedOrders, setReturnedOrders] = useState<Order[]>([])
    const [refundedOrders, setRefundedOrders] = useState<Order[]>([])


    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const response: Order[] = await apiService.get('/Orders');
            setOrders(response);

            setPendingOrders(response.filter(order => order.statusName === 'Pending'));
            setConfirmedOrders(response.filter(order => order.statusName === "Confirmed"));
            setProcessingOrders(response.filter(order => order.statusName === 'Processing'));
            setShippedOrders(response.filter(order => order.statusName === 'Shipped'));
            setDeliveredOrders(response.filter(order => order.statusName === 'Delivered'));
            setCancelledOrders(response.filter(order => order.statusName === 'Cancelled'));
            setReturnedOrders(response.filter(order => order.statusName === 'Returned'));
            setRefundedOrders(response.filter(order => order.statusName === 'Refunded'))

        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders. Please try again later.');
        } finally {
            setLoading(false);
        }
      }

       useEffect(() => {
          if (!hasFetched.current) {
            fetchOrders();
            hasFetched.current = true;
          }
        }, []);

        
        useEffect(() => {
          console.log('Orders updated:', orders);
        }, [orders]);


        const getStatusColor = (status: OrderStatus) => {
          switch (status) {
            case "Pending":
          return "yellow";
          case "Confirmed":
            return "purple"
          case "Processing":
          return "blue";
          case "Shipped":
          return "indigo";
          case "Delivered":
          return "green";
          case "Cancelled":
          return "red";
          case "Refunded":
            return "cyan"
          case "Returned":
            return "orange"
          default:
          return "gray";
        }
      };

      if (loading)
    return (
      <div className="admin-orders-container">
        <Loader size="lg" />
      </div>
    );

  if (error)
    return (
      <div className="admin-orders-container">
        <Text c = "red" >{error}</Text>
      </div>
    );


    const renderOrderTable = (orderList: Order[]) => {
        if (orderList.length === 0) {
            return (
                <Text c="dimmed" ta="center" py="md">
                    No orders in this status
                </Text>
            );
        }
      
        return (
            <ScrollArea>
                <Table highlightOnHover verticalSpacing="sm" striped>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th color='#2a2a2a'>Order #</Table.Th>
                            <Table.Th>Customer</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Product(s)</Table.Th>
                            <Table.Th>Total</Table.Th>
                            <Table.Th>Date</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {orderList.map((order) => (
                            <Table.Tr 
                                key={order.orderNumber} 
                                onClick={() => navigate(`/admin/order-detail/${order.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Table.Td>
                                    <Text fw={500}>{order.orderNumber}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text fw={500}>{order.customerName}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">{order.customerEmail}</Text>
                                </Table.Td>
                                <Table.Td>
                                    {order.orderItems.map((item, index) => (
                                        <Text size="sm" key={item.id}>
                                            {item.productName}
                                            {index < order.orderItems.length - 1 && ', '}
                                        </Text>
                                    ))}
                                </Table.Td>
                                <Table.Td>
                                    <Text fw={500}>${order.totalAmount.toFixed(2)}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        );
    };

    if (loading) {
        return (
            <div className="admin-orders-container">
                <Group justify="center" mt="xl">
                    <Loader size="lg" />
                </Group>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-orders-container">
                <Text c="red" ta="center" mt="xl">{error}</Text>
            </div>
        );
    }

    return (
        <div className="admin-orders-container">
            <Group justify="space-between" mb="xl">
                <Title order={2} className='title'>Order Management</Title>
                <Badge size="lg" variant="filled" color="grape">
                    {orders.length} Total Orders
                </Badge>
            </Group>

            <Stack gap="lg">
                <Card 
                    shadow="sm" 
                    padding="lg" 
                    radius="md" 
                    withBorder 
                    onClick={() => navigate("/admin/pending-orders", { 
                        state: { orders: pendingOrders } 
                    })}
                    style={{ cursor: 'pointer' }}
                >
                    <Group justify="space-between" mb="md">
                        <Group gap="sm">
                            <Title order={4}>Pending Orders</Title>
                            <Badge color={getStatusColor('Pending')} size="lg">
                                {pendingOrders.length}
                            </Badge>
                        </Group>
                    </Group>
                    <Divider mb="md" />
                    {renderOrderTable(pendingOrders)}
                </Card>

                <Card 
                    shadow="sm" 
                    padding="lg" 
                    radius="md" 
                    withBorder 
                    onClick={() => navigate("/admin/confirmed-orders", { 
                        state: { orders: confirmedOrders } 
                    })}
                    style={{ cursor: 'pointer' }}
                >
                    <Group justify="space-between" mb="md">
                        <Group gap="sm">
                            <Title order={4}>Confirmed Orders</Title>
                            <Badge color={getStatusColor('Confirmed')} size="lg">
                                {confirmedOrders.length}
                            </Badge>
                        </Group>
                    </Group>
                    <Divider mb="md" />
                    {renderOrderTable(confirmedOrders)}
                </Card>

                <Card 
                    shadow="sm" 
                    padding="lg" 
                    radius="md" 
                    withBorder 
                    onClick={() => navigate("/admin/processing-orders", { 
                        state: { orders: processingOrders } 
                    })}
                    style={{ cursor: 'pointer' }}
                >
                    <Group justify="space-between" mb="md">
                        <Group gap="sm">
                            <Title order={4}>Processing Orders</Title>
                            <Badge color={getStatusColor('Processing')} size="lg">
                                {processingOrders.length}
                            </Badge>
                        </Group>
                    </Group>
                    <Divider mb="md" />
                    {renderOrderTable(processingOrders)}
                </Card>

                <Card 
                    shadow="sm" 
                    padding="lg" 
                    radius="md" 
                    withBorder 
                    onClick={() => navigate("/admin/shipped-orders", { 
                        state: { orders: shippedOrders } 
                    })}
                    style={{ cursor: 'pointer' }}
                >
                    <Group justify="space-between" mb="md">
                        <Group gap="sm">
                            <Title order={4}>Shipped Orders</Title>
                            <Badge color={getStatusColor('Shipped')} size="lg">
                                {shippedOrders.length}
                            </Badge>
                        </Group>
                    </Group>
                    <Divider mb="md" />
                    {renderOrderTable(shippedOrders)}
                </Card>

                <Card 
                    shadow="sm" 
                    padding="lg" 
                    radius="md" 
                    withBorder 
                    onClick={() => navigate("/admin/delivered-orders", { 
                        state: { orders: deliveredOrders } 
                    })}
                    style={{ cursor: 'pointer' }}
                >
                    <Group justify="space-between" mb="md">
                        <Group gap="sm">
                            <Title order={4}>Delivered Orders</Title>
                            <Badge color={getStatusColor('Delivered')} size="lg">
                                {deliveredOrders.length}
                            </Badge>
                        </Group>
                    </Group>
                    <Divider mb="md" />
                    {renderOrderTable(deliveredOrders)}
                </Card>

                <Card 
                    shadow="sm" 
                    padding="lg" 
                    radius="md" 
                    withBorder 
                    onClick={() => navigate("/admin/returned-orders", { 
                        state: { orders: returnedOrders } 
                    })}
                    style={{ cursor: 'pointer' }}
                >
                    <Group justify="space-between" mb="md">
                        <Group gap="sm">
                            <Title order={4}>Returned Orders</Title>
                            <Badge color={getStatusColor('Returned')} size="lg">
                                {returnedOrders.length}
                            </Badge>
                        </Group>
                    </Group>
                    <Divider mb="md" />
                    {renderOrderTable(returnedOrders)}
                </Card>

                <Card 
                    shadow="sm" 
                    padding="lg" 
                    radius="md" 
                    withBorder 
                    onClick={() => navigate("/admin/refunded-orders", { 
                        state: { orders: refundedOrders } 
                    })}
                    style={{ cursor: 'pointer' }}
                >
                    <Group justify="space-between" mb="md">
                        <Group gap="sm">
                            <Title order={4}>Refunded Orders</Title>
                            <Badge color={getStatusColor('Refunded')} size="lg">
                                {refundedOrders.length}
                            </Badge>
                        </Group>
                    </Group>
                    <Divider mb="md" />
                    {renderOrderTable(refundedOrders)}
                </Card>

                <Card 
                    shadow="sm" 
                    padding="lg" 
                    radius="md" 
                    withBorder 
                    onClick={() => navigate("/admin/cancelled-orders", { 
                        state: { orders: cancelledOrders } 
                    })}
                    style={{ cursor: 'pointer' }}
                >
                    <Group justify="space-between" mb="md">
                        <Group gap="sm">
                            <Title order={4}>Cancelled Orders</Title>
                            <Badge color={getStatusColor('Cancelled')} size="lg">
                                {cancelledOrders.length}
                            </Badge>
                        </Group>
                    </Group>
                    <Divider mb="md" />
                    {renderOrderTable(cancelledOrders)}
                </Card>
            </Stack>
        </div>
    );
}

export default OrderManagement;


