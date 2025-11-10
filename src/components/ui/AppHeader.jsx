import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	IconButton,
	Menu,
	MenuItem,
	Avatar,
} from "@mui/material";
import { logout } from '../../store/slices/authSlice';

const AppHeader = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user, isAuthenticated } = useSelector((state) => state.auth);
	const [anchorEl, setAnchorEl] = useState(null);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		dispatch(logout());
		navigate('/');
		handleClose();
	};

	const handleAdmin = () => {
		navigate('/admin');
		handleClose();
	};

	return (
		<AppBar position="static">
			<Toolbar>
				<Typography
					variant="h6"
					component={Link}
					to="/"
					sx={{
						flexGrow: 1,
						textDecoration: 'none',
						color: 'inherit',
						fontWeight: 'bold'
					}}
				>
					Hotel Booking
				</Typography>

				<Box sx={{ display: 'flex', gap: 2 }}>
					<Button color="inherit" component={Link} to="/hotels">
						Отели
					</Button>

					{isAuthenticated ? (
						<>
							<Button color="inherit" component={Link} to="/my-bookings">
								Мои бронирования
							</Button>
							<IconButton onClick={handleMenu} color="inherit">
								<Avatar sx={{ width: 32, height: 20 }}>
									{user?.firstName?.[0]}
								</Avatar>
							</IconButton>
							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleClose}
							>
								<MenuItem onClick={handleClose}>Профиль</MenuItem>
								{user?.role === 'ADMIN' && (
									<MenuItem onClick={handleAdmin}>Админ-панель</MenuItem>
								)}
								<MenuItem  onClick={handleLogout}>Выйти</MenuItem>
							</Menu>
						</>
					) : (
						<>
							<Button color="inherit" component={Link} to="/login">
								Войти
							</Button>
							<Button color="inherit" component={Link} to="/register">
								Регистрация
							</Button>
						</>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default AppHeader;