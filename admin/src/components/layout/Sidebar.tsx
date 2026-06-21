import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Button, Typography, Avatar, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Dashboard, Receipt, ShoppingCart, Inventory, People, LocalOffer,
  Assessment, ExpandLess, ExpandMore,
  SupervisedUserCircle, Language, Settings, UnfoldMore
} from '@mui/icons-material';
import { SIDEBAR_WIDTH, SIDEBAR_BG, SIDEBAR_HOVER, SIDEBAR_ACTIVE, SIDEBAR_ACTIVE_TEXT } from '../../theme/theme';

interface NavItem {
  title: string;
  path?: string;
  icon: React.ReactElement;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', path: '/', icon: <Dashboard fontSize="small" /> },
  {
    title: 'Orders',
    icon: <ShoppingCart fontSize="small" />,
    children: [
      { title: 'Online Orders', path: '/orders/online', icon: <></> },
      { title: 'Purchase Orders', path: '/orders/purchase', icon: <></> },
      { title: 'Abandoned Carts', path: '/orders/abandoned', icon: <></> },
      { title: 'Bulk Inquiries', path: '/inquiries', icon: <></> },
      { title: 'Bulk Orders', path: '/bulk-orders', icon: <></> },
    ],
  },
  { title: 'Invoices', path: '/invoices', icon: <Receipt fontSize="small" /> },
  {
    title: 'Catalog',
    icon: <Inventory fontSize="small" />,
    children: [
      { title: 'Products', path: '/catalog/products', icon: <></> },
      { title: 'Product Lots', path: '/catalog/lots', icon: <></> },
      { title: 'Categories', path: '/catalog/categories', icon: <></> },
      { title: 'Brands', path: '/catalog/brands', icon: <></> },
      { title: 'Reviews', path: '/catalog/reviews', icon: <></> },
    ],
  },
  {
    title: 'Customers',
    icon: <People fontSize="small" />,
    children: [
      { title: 'All Customers', path: '/customers', icon: <></> },
      { title: 'Wishlists ♥', path: '/customers/wishlists', icon: <></> },
    ],
  },

  {
    title: 'Promotions',
    icon: <LocalOffer fontSize="small" />,
    children: [
      { title: 'Coupons', path: '/promotions/coupons', icon: <></> },
      { title: 'Banners', path: '/promotions/banners', icon: <></> },
    ],
  },
  { title: 'Reports', path: '/reports', icon: <Assessment fontSize="small" /> },
  {
    title: 'Settings',
    icon: <Settings fontSize="small" />,
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
        <ListItem disablePadding sx={{ px: 1.5, mb: 0.5 }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 36,
              py: 0.5,
              px: depth === 0 ? 1.5 : 4,
              color: active ? SIDEBAR_ACTIVE_TEXT : '#475569',
              backgroundColor: active ? SIDEBAR_ACTIVE : 'transparent',
              borderRadius: 1.5,
              '&:hover': {
                backgroundColor: SIDEBAR_HOVER,
                color: SIDEBAR_ACTIVE_TEXT,
              },
            }}
          >
            {depth === 0 && (
              <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: active ? SIDEBAR_ACTIVE_TEXT : '#64748B' }}>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontSize: depth === 0 ? 14 : 13,
                fontWeight: active ? 600 : 500,
                color: active ? SIDEBAR_ACTIVE_TEXT : 'inherit',
              }}
            />
            {hasChildren && (isOpen ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16, color: '#94A3B8' }} />)}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ mb: 1 }}>
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
          color: '#0F172A',
          borderRight: '1px solid #E2E8F0',
        },
      }}
    >
      {/* Store Switcher */}
      <Box sx={{ p: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 1, 
            borderRadius: 2, 
            cursor: 'pointer',
            '&:hover': { backgroundColor: SIDEBAR_HOVER }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar 
              variant="rounded" 
              sx={{ width: 32, height: 32, bgcolor: '#7C3AED', color: '#fff', fontWeight: 'bold', fontSize: 14 }}
            >
              KX
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#0F172A', lineHeight: 1.2 }}>Kevix</Typography>
              <Typography sx={{ fontSize: 12, color: '#64748B' }}>Production Store</Typography>
            </Box>
          </Box>
          <UnfoldMore sx={{ color: '#94A3B8', fontSize: 18 }} />
        </Box>
      </Box>

      <List sx={{ px: 0, py: 1, flexGrow: 1 }}>{navItems.map((item) => renderNavItem(item))}</List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2, borderColor: '#E2E8F0' }} />
        {/* Language Switcher */}
        <Button
          fullWidth
          variant="outlined"
          onClick={toggleLanguage}
          startIcon={<Language sx={{ fontSize: 18 }} />}
          sx={{
            color: '#475569',
            borderColor: '#E2E8F0',
            backgroundColor: '#FFFFFF',
            justifyContent: 'flex-start',
            textTransform: 'none',
            fontSize: 13,
            fontWeight: 500,
            '&:hover': { backgroundColor: SIDEBAR_HOVER, borderColor: '#CBD5E1' }
          }}
        >
          {i18n.language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
