import { useEffect, useState } from 'react';
import { apiService } from '../../../config/api';
import { 
  Card, 
  Grid, 
  Group, 
  Text, 
  Title, 
  Stack, 
  Select, 
  LoadingOverlay, 
  Button, 
  Badge, 
  Divider, 
  RingProgress, 
  Paper,
  Container,
  SimpleGrid
} from '@mantine/core';
import { 
  IconCurrencyDollar, 
  IconShoppingCart, 
  IconTrendingUp, 
  IconCalendar,
  IconReceipt,
  IconCreditCard,
  IconExternalLink,
  IconPackage,
  IconClock,
  IconCheck,
  IconX,
  IconChartBar
} from '@tabler/icons-react';


interface FinancialData {
  currentMonth: number;
  yearToDate: number;
  netRevenue: number;
  totalFees: number;
  transactionCount: number;
  monthlyRevenue: { 
    month: string; 
    revenue: number;
    transactions: number;
  }[];
  stripeRevenue: number;
  stripeTransactionCount: number;
}

interface OrderData {
  currentMonth: number;
  yearToDate: number;
  stripeVerifiedPayments: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  monthlyOrders: { 
    month: string; 
    orders: number;
    deliveredOrders: number;
    averageOrderValue: number;
    totalRevenue: number;
  }[];
}

interface DashboardSummary {
  monthRevenue: number;
  monthOrders: number;
  monthPendingOrders: number;
  yearRevenue: number;
  yearOrders: number;
  yearPendingOrders: number;
  averageOrderValue: number;
  totalPending: number;
  totalProcessing: number;
  totalShipped: number;
  totalDelivered: number;
  totalCancelled: number;
}


const Reports = () => {
    const [financialData, setFinancialData] = useState<FinancialData | null>(null);
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState<string>('all');


    useEffect(() => {
      fetchReportsData();
    }, [selectedYear]);

    const fetchReportsData = async () => {
      setLoading(true);
      //await apiService.get('/Orders');
      const year = parseInt(selectedYear);
      try {
        const financial = await apiService.get(`/Report/financial?year=${year}`);
        setFinancialData(financial);

        const orders = await apiService.get(`/Report/orders?year=${selectedYear}`);
        setOrderData(orders);

        if (selectedYear === new Date().getFullYear().toString()) {
          const dashboardSummary = await apiService.get('/Report/dashboard-summary');
          setDashboardSummary(dashboardSummary);
        } else {
          setDashboardSummary(null);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };


    const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCurrentMonth = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  const calculateOrderFulfillmentRate = (): number => {
    if (!orderData) return 0;
      const total = orderData.yearToDate;
    return total > 0 ? parseFloat(((orderData.deliveredOrders / total) * 100).toFixed(1)) : 0;
  };

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const monthOptions = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const getFilteredOrderData = () => {
    if (!orderData || selectedMonth === 'all') return orderData;

    const monthName = new Date(2000, parseInt(selectedMonth) - 1).toLocaleString('default', { month: 'long' });
    const monthData = orderData.monthlyOrders.find(m => m.month === monthName);

    if (!monthData) return orderData;

    return {
      ...orderData,
      currentMonth: monthData.orders,
      deliveredOrders: monthData.deliveredOrders,
      yearToDate: orderData.yearToDate,
      stripeVerifiedPayments: orderData.stripeVerifiedPayments,
      pendingOrders: orderData.pendingOrders,
      processingOrders: orderData.processingOrders,
      cancelledOrders: orderData.cancelledOrders,
      monthlyOrders: [monthData]
    };
  };

  const filteredOrderData = getFilteredOrderData();



    return (
    <Container size="xl" py="xl">
      <LoadingOverlay visible={loading} />
      
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1}>Reports Dashboard</Title>
          <Text size="sm" c="dimmed">Financial & Order Analytics • Powered by Stripe</Text>
        </div>
        <Group>
          <Select
            data={yearOptions}
            value={selectedYear}
            onChange={(value) => setSelectedYear(value || new Date().getFullYear().toString())}
            leftSection={<IconCalendar size={16} />}
            placeholder="Select Year"
            style={{ width: 150 }}
          />
        </Group>
      </Group>

      {dashboardSummary && selectedYear === new Date().getFullYear().toString() && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" fw={500}>This Month</Text>
              <IconCurrencyDollar size={20} style={{ color: 'var(--mantine-color-green-6)' }} />
            </Group>
            <Text size="xl" fw={700}>{formatCurrency(dashboardSummary.monthRevenue)}</Text>
            <Text size="xs" c="dimmed" mt="xs">
              {dashboardSummary.monthOrders} orders
            </Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" fw={500}>Avg Order Value</Text>
              <IconReceipt size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
            </Group>
            <Text size="xl" fw={700}>
              {formatCurrency(dashboardSummary.averageOrderValue)}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">YTD average</Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" fw={500}>Fulfillment Rate</Text>
              <IconCheck size={20} style={{ color: 'var(--mantine-color-teal-6)' }} />
            </Group>
            <Group>
              <RingProgress
                size={60}
                thickness={6}
                sections={[{ value: calculateOrderFulfillmentRate(), color: 'teal' }]}
              />
              <Text size="xl" fw={700}>{calculateOrderFulfillmentRate()}%</Text>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" fw={500}>Pending Orders</Text>
              <IconClock size={20} style={{ color: 'var(--mantine-color-orange-6)' }} />
            </Group>
            <Text size="xl" fw={700}>{dashboardSummary.totalPending}</Text>
            <Text size="xs" c="dimmed" mt="xs">Need attention</Text>
          </Card>
        </SimpleGrid>
      )}

      <Stack gap="lg" mb="xl">
        <Group justify="space-between">
          <Group>
            <IconChartBar size={28} />
            <Title order={2}>Financial Reports</Title>
          </Group>
        </Group>
        
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Group justify="space-between" mb="md">
                <div>
                  <Text size="sm" c="dimmed" fw={500}>
                    {getCurrentMonth()} Revenue
                  </Text>
                  <Badge size="xs" color="green" variant="light" mt={4}>Delivered Orders</Badge>
                </div>
                <IconCurrencyDollar size={24} style={{ color: 'var(--mantine-color-green-6)' }} />
              </Group>
              <Text size="xl" fw={700}>
                {financialData ? formatCurrency(financialData.currentMonth) : '$0.00'}
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                Current month gross
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Group justify="space-between" mb="md">
                <div>
                  <Text size="sm" c="dimmed" fw={500}>
                    Gross Revenue (YTD)
                  </Text>
                  <Badge size="xs" color="blue" variant="light" mt={4}>
                    {financialData?.transactionCount || 0} transactions
                  </Badge>
                </div>
                <IconTrendingUp size={24} style={{ color: 'var(--mantine-color-blue-6)' }} />
              </Group>
              <Text size="xl" fw={700}>
                {financialData ? formatCurrency(financialData.yearToDate) : '$0.00'}
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                Before Stripe fees
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Group justify="space-between" mb="md">
                <div>
                  <Text size="sm" c="dimmed" fw={500}>
                    Net Revenue (YTD)
                  </Text>
                  <Badge size="xs" color="violet" variant="light" mt={4}>After fees</Badge>
                </div>
                <IconTrendingUp size={24} style={{ color: 'var(--mantine-color-violet-6)' }} />
              </Group>
              <Text size="xl" fw={700}>
                {financialData ? formatCurrency(financialData.netRevenue) : '$0.00'}
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                Fees: {financialData ? formatCurrency(financialData.totalFees) : '$0.00'}
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {financialData && financialData.stripeTransactionCount > 0 && (
          <Paper p="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>Stripe Verification</Text>
                <Text size="xs" c="dimmed">Cross-reference with actual Stripe payments</Text>
              </div>
              <Group gap="xl">
                <div style={{ textAlign: 'right' }}>
                  <Text size="xs" c="dimmed">Stripe Revenue</Text>
                  <Text fw={600}>{formatCurrency(financialData.stripeRevenue)}</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Text size="xs" c="dimmed">Stripe Payments</Text>
                  <Text fw={600}>{financialData.stripeTransactionCount}</Text>
                </div>
                <Badge color="green" leftSection={<IconCheck size={12} />}>
                  Verified
                </Badge>
              </Group>
            </Group>
          </Paper>
        )}

        {financialData && financialData.monthlyRevenue.length > 0 && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">Monthly Revenue Breakdown</Title>
            <Stack gap="xs">
              {financialData.monthlyRevenue.map((month) => (
                <div key={month.month}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>{month.month}</Text>
                      <Text size="xs" c="dimmed">
                        {month.transactions} transactions
                      </Text>
                    </div>
                    <Text fw={600} size="lg">{formatCurrency(month.revenue)}</Text>
                  </Group>
                  <Divider my="xs" />
                </div>
              ))}
            </Stack>
          </Card>
        )}
      </Stack>

      <Stack gap="lg">
        <Group justify="space-between">
          <Group>
            <IconPackage size={28} />
            <Title order={2}>Order Analytics</Title>
          </Group>
          <Select
            data={monthOptions}
            value={selectedMonth}
            onChange={(value) => setSelectedMonth(value || 'all')}
            leftSection={<IconCalendar size={16} />}
            placeholder="Filter by Month"
            style={{ width: 180 }}
          />
        </Group>
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text size="sm" c="dimmed" fw={500}>
                  {selectedMonth === 'all' ? getCurrentMonth() : monthOptions.find(m => m.value === selectedMonth)?.label} Orders
                </Text>
                <IconShoppingCart size={24} style={{ color: 'var(--mantine-color-orange-6)' }} />
              </Group>
              <Text size="xl" fw={700}>
                {filteredOrderData ? filteredOrderData.currentMonth : 0}
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                {selectedMonth === 'all' ? 'Orders this month' : 'Orders in selected month'}
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text size="sm" c="dimmed" fw={500}>
                  YTD Total Orders
                </Text>
                <IconPackage size={24} style={{ color: 'var(--mantine-color-grape-6)' }} />
              </Group>
              <Text size="xl" fw={700}>
                {filteredOrderData ? filteredOrderData.yearToDate : 0}
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                Total for {selectedYear}
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text size="sm" c="dimmed" fw={500}>
                  Delivered
                </Text>
                <IconCheck size={24} style={{ color: 'var(--mantine-color-teal-6)' }} />
              </Group>
              <Text size="xl" fw={700}>
                {filteredOrderData ? filteredOrderData.deliveredOrders : 0}
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                {selectedMonth === 'all' ? 'Successfully completed' : 'Delivered in month'}
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text size="sm" c="dimmed" fw={500}>
                  Stripe Verified
                </Text>
                <IconCreditCard size={24} style={{ color: 'var(--mantine-color-blue-6)' }} />
              </Group>
              <Text size="xl" fw={700}>
                {filteredOrderData ? filteredOrderData.stripeVerifiedPayments : 0}
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                Successful payments
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {filteredOrderData && (
          <SimpleGrid cols={{ base: 2, sm: 4 }}>
            <Card padding="md" radius="md" withBorder>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Pending</Text>
                <IconClock size={18} style={{ color: 'var(--mantine-color-orange-6)' }} />
              </Group>
              <Text size="lg" fw={600} mt="xs">{filteredOrderData.pendingOrders}</Text>
            </Card>

            <Card padding="md" radius="md" withBorder>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Processing</Text>
                <IconPackage size={18} style={{ color: 'var(--mantine-color-blue-6)' }} />
              </Group>
              <Text size="lg" fw={600} mt="xs">{filteredOrderData.processingOrders}</Text>
            </Card>

            <Card padding="md" radius="md" withBorder>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Delivered</Text>
                <IconCheck size={18} style={{ color: 'var(--mantine-color-teal-6)' }} />
              </Group>
              <Text size="lg" fw={600} mt="xs">{filteredOrderData.deliveredOrders}</Text>
            </Card>

            <Card padding="md" radius="md" withBorder>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Cancelled</Text>
                <IconX size={18} style={{ color: 'var(--mantine-color-red-6)' }} />
              </Group>
              <Text size="lg" fw={600} mt="xs">{filteredOrderData.cancelledOrders}</Text>
            </Card>
          </SimpleGrid>
        )}

        {filteredOrderData && filteredOrderData.monthlyOrders.length > 0 && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              {selectedMonth === 'all' ? 'Monthly Order Volume' : `${monthOptions.find(m => m.value === selectedMonth)?.label} Order Details`}
            </Title>
            <Stack gap="xs">
              {filteredOrderData.monthlyOrders.map((month) => (
                <div key={month.month}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>{month.month}</Text>
                      <Text size="xs" c="dimmed">
                        {month.deliveredOrders} delivered • Avg: {formatCurrency(month.averageOrderValue)}
                      </Text>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Text fw={600}>{month.orders} orders</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(month.totalRevenue)}</Text>
                    </div>
                  </Group>
                  <Divider my="xs" />
                </div>
              ))}
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
export default Reports;