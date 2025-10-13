import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from '../ui/AppHeader';
import AppFooter from '../ui/AppFooter';
import { Box } from '@mui/material';

const MainLayout = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<AppHeader />
			<Box component="main" sx={{ flexGrow: 1 }}>
				<Outlet />
			</Box>
			<AppFooter />
		</Box>
	);
};

export default MainLayout;