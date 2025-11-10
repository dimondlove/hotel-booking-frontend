import React, { useState } from 'react';
import {
	Container,
	Typography,
	Box,
	Tabs,
	Tab,
	Alert,
	CircularProgress,
	Button,
	Card,
	CardContent,
	Grid,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	DialogContentText,
} from '@mui/material';
import {
	CalendarToday,
	Person,
	Hotel,
	MeetingRoom,
	Cancel,
} from '@mui/icons-material';
import { useGetBookingsQuery, useCancelBookingMutation } from '../../store/api/hotelApi';
import { useSelector } from 'react-redux';

const formatDate = (dateString) => {
	return new Date(dateString).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
};

const formatPrice = (price) => {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		minimumFractionDigits: 0
	}).format(price);
};

const BookingCard = ({ booking, onCancel }) => {
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

	const getStatusColor = (status) => {
		switch (status) {
		case 'CONFIRMED': return 'success';
		case 'PENDING': return 'warning';
		case 'CANCELLED': return 'error';
		case 'COMPLETED': return 'info';
		default: return 'default';
		}
	};

	const getStatusText = (status) => {
		switch (status) {
		case 'CONFIRMED': return 'Подтверждено';
		case 'PENDING': return 'Ожидание';
		case 'CANCELLED': return 'Отменено';
		case 'COMPLETED': return 'Завершено';
		default: return status;
		}
	};

	const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED';
	const isUpcoming = new Date(booking.checkInDate) > new Date();

	const handleCancelClick = () => {
		setCancelDialogOpen(true);
	};

	const handleConfirmCancel = () => {
		onCancel(booking.id);
		setCancelDialogOpen(false);
	};

	return (
		<>
		<Card sx={{ mb: 2, border: 1, borderColor: 'divider' }}>
			<CardContent>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
				<Box>
				<Typography variant="h6" gutterBottom>
					{booking.hotelName}
				</Typography>
				<Typography variant="body1" color="text.secondary" gutterBottom>
					<MeetingRoom sx={{ fontSize: 16, verticalAlign: 'bottom', mr: 1 }} />
					{booking.roomName}
				</Typography>
				</Box>
				<Chip 
				label={getStatusText(booking.status)} 
				color={getStatusColor(booking.status)}
				variant="outlined"
				/>
			</Box>

			<Grid container spacing={3}>
				<Grid item xs={12} md={6}>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
					<CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
					<Typography variant="body2">
					<strong>Заезд:</strong> {formatDate(booking.checkInDate)}
					</Typography>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
					<CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
					<Typography variant="body2">
					<strong>Выезд:</strong> {formatDate(booking.checkOutDate)}
					</Typography>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
					<Typography variant="body2">
					<strong>Гостей:</strong> {booking.guests}
					</Typography>
				</Box>
				</Grid>
				
				<Grid item xs={12} md={6}>
				<Typography variant="h6" color="primary" gutterBottom>
					{formatPrice(booking.totalPrice)}
				</Typography>
				<Typography variant="body2" color="text.secondary" gutterBottom>
					Забронировано: {new Date(booking.createdAt).toLocaleDateString('ru-RU')}
				</Typography>
				
				{booking.specialRequests && (
					<Typography variant="body2" sx={{ mt: 1 }}>
					<strong>Особые пожелания:</strong> {booking.specialRequests}
					</Typography>
				)}
				</Grid>
			</Grid>

			{canCancel && isUpcoming && (
				<Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
				<Button
					variant="outlined"
					color="error"
					startIcon={<Cancel />}
					onClick={handleCancelClick}
					size="small"
				>
					Отменить бронирование
				</Button>
				</Box>
			)}
			</CardContent>
		</Card>

		{/* Диалог подтверждения отмены */}
		<Dialog
			open={cancelDialogOpen}
			onClose={() => setCancelDialogOpen(false)}
		>
			<DialogTitle>Отмена бронирования</DialogTitle>
			<DialogContent>
			<DialogContentText>
				Вы уверены, что хотите отменить бронирование в отеле "{booking.hotelName}"?
				Эта операция не может быть отменена.
			</DialogContentText>
			</DialogContent>
			<DialogActions>
			<Button onClick={() => setCancelDialogOpen(false)}>
				Оставить
			</Button>
			<Button onClick={handleConfirmCancel} color="error" variant="contained">
				Отменить бронирование
			</Button>
			</DialogActions>
		</Dialog>
		</>
	);
};

const Bookings = () => {
	const [activeTab, setActiveTab] = useState(0);
	const { data: bookings, isLoading, error, refetch } = useGetBookingsQuery();
	const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	const handleCancelBooking = async (bookingId) => {
		try {
		await cancelBooking(bookingId).unwrap();
		refetch();
		} catch (error) {
		console.error('Failed to cancel booking:', error);
		}
	};

	const filteredBookings = bookings?.filter(booking => {
		switch (activeTab) {
		case 0: // Все
			return true;
		case 1: // Активные
			return booking.status === 'PENDING' || booking.status === 'CONFIRMED';
		case 2: // Предстоящие
			return (booking.status === 'PENDING' || booking.status === 'CONFIRMED') && 
				new Date(booking.checkInDate) > new Date();
		case 3: // Завершенные
			return booking.status === 'COMPLETED';
		case 4: // Отмененные
			return booking.status === 'CANCELLED';
		default:
			return true;
		}
	}) || [];

	if (isLoading) {
		return (
			<Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
				<CircularProgress />
				<Typography variant="h6" sx={{ mt: 2 }}>
				Загрузка ваших бронирований...
				</Typography>
			</Container>
		);
	}

	if (error) {
		return (
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Alert severity="error" sx={{ mb: 2 }}>
				Ошибка загрузки бронирований: {error.data?.message || 'Попробуйте позже'}
				</Alert>
				<Button variant="contained" onClick={refetch}>
				Попробовать снова
				</Button>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
		<Typography variant="h4" component="h1" gutterBottom>
			Мои бронирования
		</Typography>

		{/* Табы для фильтрации */}
		<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
			<Tabs value={activeTab} onChange={handleTabChange}>
			<Tab label={`Все (${bookings?.length || 0})`} />
			<Tab label="Активные" />
			<Tab label="Предстоящие" />
			<Tab label="Завершенные" />
			<Tab label="Отмененные" />
			</Tabs>
		</Box>

		{/* Список бронирований */}
		{filteredBookings.length === 0 ? (
			<Box sx={{ textAlign: 'center', py: 8 }}>
			<Typography variant="h6" color="text.secondary" gutterBottom>
				{activeTab === 0 ? 'У вас пока нет бронирований' : 'Бронирования не найдены'}
			</Typography>
			<Typography variant="body2" color="text.secondary">
				{activeTab === 0 
				? 'Начните с поиска подходящего отеля!' 
				: 'Попробуйте выбрать другую категорию'
				}
			</Typography>
			</Box>
		) : (
			<Box>
			{filteredBookings.map((booking) => (
				<BookingCard
				key={booking.id}
				booking={booking}
				onCancel={handleCancelBooking}
				/>
			))}
			</Box>
		)}

		{/* Индикатор загрузки при отмене */}
		{isCancelling && (
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
			<CircularProgress size={24} />
			<Typography variant="body2" sx={{ ml: 2 }}>
				Отмена бронирования...
			</Typography>
			</Box>
		)}
		</Container>
	);
};

export default Bookings;