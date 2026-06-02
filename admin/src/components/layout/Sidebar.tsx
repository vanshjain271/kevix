import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Button, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Dashboard, Receipt, ShoppingCart, Inventory, People, LocalOffer,
  Assessment, Storefront, ExpandLess, ExpandMore,
  SupervisedUserCircle, Language, History,
} from '@mui/icons-material';
import { SIDEBAR_WIDTH, SIDEBAR_BG, SIDEBAR_HOVER, SIDEBAR_ACTIVE } from '../../theme/theme';

interface NavItem {
  title: string;
  path?: string;
  icon: React.ReactElement;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', path: '/', icon: <Dashboard /> },
  {
    title: 'Orders',
    icon: <ShoppingCart />,
    children: [
      { title: 'Online Orders', path: '/orders/online', icon: <></> },
      { title: 'Purchase Orders', path: '/orders/purchase', icon: <></> },
      { title: 'Abandoned Carts', path: '/orders/abandoned', icon: <></> },
      { title: 'Bulk Orders', path: '/bulk-orders', icon: <></> },
    ],
  },
  { title: 'Invoices', path: '/invoices', icon: <Receipt /> },
  {
    title: 'Catalog',
    icon: <Inventory />,
    children: [
      { title: 'Products', path: '/catalog/products', icon: <></> },
      { title: 'Categories', path: '/catalog/categories', icon: <></> },
      { title: 'Brands', path: '/catalog/brands', icon: <></> },
      { title: 'Reviews', path: '/catalog/reviews', icon: <></> },
    ],
  },
  { title: 'Customers', path: '/customers', icon: <People /> },
  { title: 'Employees', path: '/employees', icon: <SupervisedUserCircle /> },
  {
    title: 'Promotions',
    icon: <LocalOffer />,
    children: [
      { title: 'Coupons', path: '/promotions/coupons', icon: <></> },
      { title: 'Banners', path: '/promotions/banners', icon: <></> },
    ],
  },
  { title: 'Reports', path: '/reports', icon: <Assessment /> },
  { title: 'Activity Log', path: '/activity-log', icon: <History /> },
  {
    title: 'Online Store',
    icon: <Storefront />,
    children: [
      { title: 'Store Settings', path: '/store/settings', icon: <></> },
      { title: 'Store Blog', path: '/store/blog', icon: <></> },
    ],
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  // Compute which sections should be open based on the current path
  const getInitialOpenItems = () => {
    const result: { [key: string]: boolean } = {};
    navItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(
          (child) => child.path && location.pathname.startsWith(child.path)
        );
        if (isChildActive) {
          result[item.title] = true;
        }
      }
    });
    return result;
  };

  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>(getInitialOpenItems);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleItemClick = (item: NavItem) => {
    if (item.children) {
      setOpenItems((prev) => ({ ...prev, [item.title]: !prev[item.title] }));
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isActive = (path?: string) => path && location.pathname === path;

  const renderNavItem = (item: NavItem, depth = 0) => {
    const active = isActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems[item.title];

    return (
      <React.Fragment key={item.title}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              px: depth === 0 ? 2.5 : 4,
              py: 1,
              color: active ? '#829c65' : '#1F2937',
              backgroundColor: active ? SIDEBAR_ACTIVE : 'transparent',
              borderRadius: depth === 0 ? 2 : 0,
              mx: depth === 0 ? 1 : 0,
              '&:hover': {
                backgroundColor: depth === 0 ? SIDEBAR_HOVER : 'rgba(0, 0, 0, 0.04)',
                color: '#829c65',
              },
            }}
          >
            {depth === 0 && (
              <ListItemIcon sx={{ minWidth: 0, mr: 2, color: active ? '#829c65' : '#4B5563' }}>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontSize: depth === 0 ? 14 : 13,
                fontWeight: active ? 600 : 500,
              }}
            />
            {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderNavItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: SIDEBAR_BG,
          color: '#1F2937',
          borderRight: '1px solid #E5E7EB',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: 2,
          background: 'linear-gradient(135deg, #a3b18a 0%, #829c65 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 1, boxShadow: '0 4px 12px rgba(130,156,101,0.3)'
        }}>
          <Typography sx={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>A</Typography>
        </Box>
        <Typography sx={{ color: '#1F2937', fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>ARBUDA</Typography>
      </Box>

      <List sx={{ px: 0, py: 1 }}>{navItems.map((item) => renderNavItem(item))}</List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        {/* Language Switcher */}
        <Button
          fullWidth
          onClick={toggleLanguage}
          startIcon={<Language />}
          sx={{
            color: '#4B5563',
            backgroundColor: '#F3F4F6',
            '&:hover': { backgroundColor: '#E5E7EB' }
          }}
        >
          {i18n.language === 'en' ? '🇮🇳 हिंदी' : '🇺🇸 English'}
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
