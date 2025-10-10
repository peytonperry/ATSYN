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
    ProductId: number;
    ProductName: string;
    UnitPrice: number;
    Quantity: number;
    TotalPrice: number;
    Product: Product;
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
          <Title order={3}>Recent Orders</Title>
          <Text c="dimmed" size="sm">
            {orders.length} total
          </Text>
        </Group>
        <Divider mb="md" />

        <ScrollArea>
          <Table highlightOnHover verticalSpacing="sm">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <Text c="dimmed">
                      No orders found
                    </Text>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Text fw={500}>{order.id}</Text>
                    </td>
                    <td>
                      <Text fw={500}> 
                      {order.customerName}
                      </Text>
                      </td>
                    <td>
                      <Text fw={500}>
                      {order.customerEmail}
                      </Text>
                      </td>
                    <td>
                      <Text fw={500}>
                      ${order.totalAmount}
                      </Text>
                      </td>
                    <td>
                      <Badge color={getStatusColor(order.statusName)}>
                        {order.statusName}
                      </Badge>
                    </td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
    );
}

export default OrderManagement;


