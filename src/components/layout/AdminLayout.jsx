import React from "react";
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import {
	Box,
	Drawer,
	AppBar,
	Toolbar,
	List,
	Typography,
	Divider,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import { 
	Dashboard as DashboardIcon,
	People as PeopleIcon,
	Hotel as HotelIcon,
	MeetingRoom as RoomIcon,
 } from '@mui/icons-material';

 const drawerWidth = 240;

 const AdminLayout = () => {
	const { user, isAuthenticated } = useSelector((state) => state.auth);

	if (!isAuthenticated || user?.role !== 'ADMIN') {
		return <Navigate to="/" replace />
	}

	const menuItems = [
		{ text: 'Дашборд', icon: <DashboardIcon />, path: '/admin' },
		{ text: 'Пользователи', icon: <PeopleIcon />, path: '/admin/users' },
		{ text: 'Отели', icon: <HotelIcon />, path: '/admin/hotels' },
		{ text: 'Номера', icon: <RoomIcon />, path: '/admin/rooms' },
	];

	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar
				position="fixed"
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<Toolbar>
					<Typography variant="h6" noWrap component="div">
						Панель администратора
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: 'auto' }}>
					<List>
						{menuItems.map((item) => (
							<ListItem key={item.text} disablePadding>
								<ListItemButton component={Link} to={item.path}>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.text} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				<Outlet />
			</Box>
		</Box>
	);
 };

 export default AdminLayout;