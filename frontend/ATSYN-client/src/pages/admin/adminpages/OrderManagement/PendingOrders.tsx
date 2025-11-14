import React, { use, useEffect, useState } from 'react';
import "./ProcessingOrders.css";
import { apiService } from "../../../../config/api";
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Card, Divider, Group, Loader, ScrollArea, Table, Title, Text, Stack, Container, Button  } from '@mantine/core';

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

const PendingOrders = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [pendingOrders, setPendingOrders] = useState<Order[]>(
        location.state?.orders || []
    );
   
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (pendingOrders.length === 0) {
            setLoading(true);
            const fetchPendingOrders = async () => {
                try {
                    const response: Order[] = await apiService.get('/Orders');
                    const filtered = response.filter(order => order.statusName === 'Pending');
                    setPendingOrders(filtered);
                } catch (error) {
                    console.error('Error fetching pending orders:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchPendingOrders();
        }
    }, []);

    if (loading) {
        return (
            <Container size="xl" py="xl">
                <Group justify="center" mt="xl">
                    <Loader size="lg" />
                </Group>
            </Container>
        );
    }    

    return (
        <Container size="lg" py="xl">
            <Stack gap="lg">
            <Group justify="flex-start" align="center">
                <Button
                    variant="subtle"
                    onClick={() => navigate("/admin/order-management")}
                >
                ← Back to Order Management
                </Button>
                <Title order={2}>Pending Orders</Title>
            </Group>
        <Card shadow="md" padding="xl" radius="lg" withBorder>
                    <Divider mb="md" />
                    
                    {pendingOrders.length === 0 ? (
                        <Text c="dimmed" ta="center" py="xl">
                            No pending orders found
                        </Text>
                    ) : (
                        <ScrollArea>
                            <Table highlightOnHover verticalSpacing="sm" striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Order #</Table.Th>
                                        <Table.Th>Customer</Table.Th>
                                        <Table.Th>Email</Table.Th>
                                        <Table.Th>Product(s)</Table.Th>
                                        <Table.Th>Total</Table.Th>
                                        <Table.Th>Date</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {pendingOrders.map((order) => (
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
                    )}
                </Card>    
            </Stack>
        </Container>
    )
}

export default PendingOrders;