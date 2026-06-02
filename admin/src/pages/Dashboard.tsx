import React, { useEffect, useState } from 'react';
import { TrendingUp, ShoppingCart, People, WhatsApp, ShoppingCartOutlined, CalendarToday } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Grid, Card, CardContent, Typography, Box, Button, CircularProgress, Chip, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import apiClient from '../services/api.service';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
  totalSales: number;
  totalOrders: number;
  abandonedCarts: number;
  totalCustomers: number;
  recentOrders: any[];
  ordersByStatus: { [key: string]: number };
  salesByDay: { date: string; amount: number }[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('today');

  useEffect(() => {
    loadDashboardData();
  }, [timeframe]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const result = await apiClient.get<any>(`/admin/reports/dashboard?timeframe=${timeframe}`);
      if (result.success) {
        setData({
          totalSales: result.totalRevenue || result.data?.summary?.totalRevenue || 0,
          totalOrders: result.totalOrders || result.data?.summary?.totalOrders || 0,
          abandonedCarts: result.abandonedCarts || 0,
          totalCustomers: result.totalCustomers || result.data?.summary?.totalCustomers || 0,
          recentOrders: result.recentOrders || result.data?.recentOrders || [],
          ordersByStatus: result.ordersByStatus || {},
          salesByDay: result.salesByDay || [],
        });
      } else {
        setData({
          totalSales: 0, totalOrders: 0, abandonedCarts: 0, totalCustomers: 0,
          recentOrders: [], ordersByStatus: {}, salesByDay: [],
        });
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
      setData({
        totalSales: 0, totalOrders: 0, abandonedCarts: 0, totalCustomers: 0,
        recentOrders: [], ordersByStatus: {}, salesByDay: [],
      });
    }
    setLoading(false);
  };



  const COLORS = ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'];

  const insights = data ? [
    { label: 'Store Sales', value: `₹${data.totalSales.toLocaleString()}`, icon: <TrendingUp />, color: '#10B981', bgColor: '#DCFCE7' },
    { label: 'Total Orders', value: data.totalOrders.toString(), icon: <ShoppingCart />, color: '#6D28D9', bgColor: '#F3E8FF', link: '/orders/online' },
    { label: 'Abandoned Carts', value: data.abandonedCarts.toString(), icon: <ShoppingCartOutlined />, color: '#EF4444', bgColor: '#FEE2E2', link: '/orders/abandoned' },
    { label: 'Total Customers', value: data.totalCustomers.toString(), icon: <People />, color: '#8B5CF6', bgColor: '#F3E8FF', link: '/customers' },
  ] : [];



  const statusLabels: { [key: string]: string } = {
    'PENDING': 'Pending',
    'PROCESSING_PAYMENT': 'Processing',
    'PAID': 'Paid',
    'CONFIRMED': 'Confirmed',
    'PACKED': 'Packed',
    'SHIPPED': 'Shipped',
    'DELIVERED': 'Delivered',
    'CANCELLED': 'Cancelled',
    'PAYMENT_FAILED': 'Failed'
  };

  const pieData = data ? Object.entries(data.ordersByStatus).map(([name, value]) => ({ 
    name: statusLabels[name] || name, 
    value 
  })) : [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>Dashboard</Typography>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="timeframe-label">Timeframe</InputLabel>
          <Select
            labelId="timeframe-label"
            value={timeframe}
            label="Timeframe"
            onChange={(e) => setTimeframe(e.target.value)}
            sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
            startAdornment={<CalendarToday sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="6months">Last 6 Months</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
        {/* Main Content Area */}
        <Grid item xs={12} md={8}>
          {/* Insights Grid */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp color="primary" /> Store Insights
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {insights.map((stat) => (
              <Grid item xs={12} sm={6} key={stat.label}>
                <Card
                  sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', cursor: stat.link ? 'pointer' : 'default', '&:hover': stat.link ? { boxShadow: 4 } : {} }}
                  onClick={() => stat.link && navigate(stat.link)}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '16px', backgroundColor: stat.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                      {stat.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{stat.label}</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                    </Box>
                    {stat.link && <Chip label="View →" size="small" sx={{ fontWeight: 600 }} />}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Abandoned Carts Recovery Card */}
          {data && data.abandonedCarts > 0 && (
            <Card sx={{ borderRadius: 3, mb: 4, border: '1px solid #FEE2E2', background: 'linear-gradient(135deg, #FFF5F5 0%, #FEF2F2 100%)' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ShoppingCartOutlined sx={{ fontSize: 32, color: '#EF4444' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#991B1B' }}>
                      {data.abandonedCarts} Abandoned Cart{data.abandonedCarts > 1 ? 's' : ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Customers left items in their cart — recover lost sales!
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<WhatsApp />}
                    onClick={() => navigate('/orders/abandoned')}
                    sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1ebe57' }, fontWeight: 600 }}
                  >
                    Recover Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Sales Chart */}
          <Card sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>📈 Sales Trend {timeframe === 'all' ? '(Overview)' : `- Last ${timeframe === '6months' ? '6 Months' : timeframe === 'month' ? '30 Days' : timeframe}`}</Typography>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data?.salesByDay}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6D28D9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#6D28D9" strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 6, fill: '#6D28D9', strokeWidth: 3, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar Area */}
        <Grid item xs={12} md={4}>
          {/* Quick Actions */}
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>⚡ Quick Actions</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}><Button fullWidth variant="outlined" size="small" onClick={() => navigate('/catalog/products/new')}>Add Product</Button></Grid>
                <Grid item xs={6}><Button fullWidth variant="outlined" size="small" onClick={() => navigate('/promotions/coupons')}>New Coupon</Button></Grid>
                <Grid item xs={6}><Button fullWidth variant="outlined" size="small" onClick={() => navigate('/invoices')}>Invoices</Button></Grid>
                <Grid item xs={6}><Button fullWidth variant="outlined" size="small" onClick={() => navigate('/store/settings')}>Settings</Button></Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Order Status Breakdown</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {pieData.map((entry, index) => (
                  <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }} />
                    <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>{entry.name}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )}
  </Box>
  );
};

export default Dashboard;
