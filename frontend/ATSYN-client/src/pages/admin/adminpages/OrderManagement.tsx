import React, { use, useEffect, useState } from 'react';
import "./OrderManagement.css";
import { apiService } from "../../../config/api";
import { useNavigate } from 'react-router-dom';
import { Badge, Card, Divider, Group, Loader, ScrollArea, Table, Title, Text  } from '@mantine/core';

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
    const [orders,  setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const hasFetched = React.useRef(false);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const response: Order[] = await apiService.get('/Orders');
            setOrders(response);
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
          case "Processing":
          return "blue";
          case "Shipped":
          return "indigo";
          case "Delivered":
          return "green";
          case "Cancelled":
          return "red";
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



      
    return(
        <div className="admin-orders-container">
  <Card shadow="md" padding="xl" radius="lg" withBorder className="orders-card">
    <Group align="apart" mb="md">
      <Title order={3} className='title'>Recent Orders</Title>
      <Text c="white" size="sm">
        {orders.length} total
      </Text>
    </Group>
    <Divider mb="md" />

    <ScrollArea>
      <Table highlightOnHover verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th bg = "#8a00c4">Order ID</Table.Th>
            <Table.Th bg = "#8a00c4">Customer</Table.Th>
            <Table.Th bg = "#8a00c4">Email</Table.Th>
            <Table.Th bg = "#8a00c4">Product</Table.Th>
            <Table.Th bg = "#8a00c4">Total</Table.Th>
            <Table.Th bg = "#8a00c4">Status</Table.Th>
            <Table.Th bg = "#8a00c4">Date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text c="dimmed">
                  No orders found
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            orders.map((order) => (
              <Table.Tr key={order.id}>
                <Table.Td>
                  <Text fw={500}>{order.id}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fw={500}> 
                    {order.customerName}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>
                    {order.customerEmail}
                  </Text>
                </Table.Td>
                <Table.Td>
                  {order.orderItems.map((item) => (
                    <Text fw={500} key={item.id}>
                      {item.productName}
                    </Text>
                  ))}
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>
                    ${order.totalAmount}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(order.statusName)}>
                    {order.statusName}
                  </Badge>
                </Table.Td>
                <Table.Td>{new Date(order.orderDate).toLocaleDateString()}</Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  </Card>
</div>
    );
}

export default OrderManagement;


