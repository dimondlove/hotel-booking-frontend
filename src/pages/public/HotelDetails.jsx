import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Container,
	Typography,
	Box,
	Grid,
	Chip,
	Rating,
	Divider,
	Button,
	Alert,
	CircularProgress,
} from '@mui/material';
import { LocationOn, Phone, Email, Wifi, ArrowBack, AcUnit, LocalParking, Pool } from '@mui/icons-material';
import RoomCard from '../../components/ui/RoomCard';
import { useGetHotelByIdQuery, useGetRoomsByHotelQuery } from '../../store/api/hotelApi';
            
const amenityIcons = {
	'WiFi': <Wifi />,
	'Wi-Fi': <Wifi />,
	'Кондиционер': <AcUnit />,
	'Парковка': <LocalParking />,
	'Бассейн': <Pool />,
	'СПА': <Pool />,
	'Ресторан': <LocalParking />,
	'Фитнес-центр': <LocalParking />, 
	'Завтрак': <LocalParking />, 
};

const HotelDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	// RTK Query hooks
	const { 
		data: hotel, 
		isLoading: hotelLoading, 
		error: hotelError,
		refetch: refetchHotel 
	} = useGetHotelByIdQuery(id);

	const { 
		data: rooms, 
		isLoading: roomsLoading, 
		error: roomsError,
		refetch: refetchRooms 
	} = useGetRoomsByHotelQuery(id);

	const isLoading = hotelLoading || roomsLoading;
	const error = hotelError || roomsError;

	if (isLoading) {
		return (
		<Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
			<CircularProgress size={60} />
			<Typography variant="h6" sx={{ mt: 2 }}>
			Загрузка информации об отеле...
			</Typography>
		</Container>
		);
	}

	if (error || !hotel) {
		return (
		<Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
			<Alert severity="error" sx={{ mb: 2 }}>
			{hotelError?.data?.message || 'Отель не найден'}
			</Alert>
			<Button 
			variant="contained" 
			startIcon={<ArrowBack />}
			onClick={() => navigate('/hotels')}
			sx={{ mt: 2 }}
			>
			Вернуться к списку отелей
			</Button>
			<Button 
			variant="outlined" 
			onClick={refetchHotel}
			sx={{ mt: 2, ml: 2 }}
			>
			Попробовать снова
			</Button>
		</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
		{/* Кнопка назад */}
		<Button 
			startIcon={<ArrowBack />}
			onClick={() => navigate('/hotels')}
			sx={{ mb: 3 }}
		>
			Назад к отелям
		</Button>

		{/* Заголовок и основная информация */}
		<Box sx={{ mb: 4 }}>
			<Typography variant="h3" component="h1" gutterBottom>
			{hotel.name}
			</Typography>
		
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
			<Rating value={hotel.rating || 0} readOnly precision={0.1} />
			<Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
				{hotel.rating > 0 ? hotel.rating.toFixed(1) : 'Нет оценок'}
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
				• {hotel.city}
			</Typography>
			</Box>

			<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
			<LocationOn sx={{ color: 'text.secondary', mr: 1 }} />
			<Typography variant="body1" color="text.secondary">
				{hotel.address}
			</Typography>
			</Box>

			{hotel.phone && (
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
				<Phone sx={{ color: 'text.secondary', mr: 1 }} />
				<Typography variant="body1" color="text.secondary">
				{hotel.phone}
				</Typography>
			</Box>
			)}

			{hotel.email && (
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
				<Email sx={{ color: 'text.secondary', mr: 1 }} />
				<Typography variant="body1" color="text.secondary">
				{hotel.email}
				</Typography>
			</Box>
			)}

			<Typography variant="body1" paragraph>
			{hotel.description}
			</Typography>

			{/* Удобства отеля */}
			{hotel.amenities && hotel.amenities.length > 0 && (
			<Box sx={{ mb: 4 }}>
				<Typography variant="h6" gutterBottom>
				Удобства отеля:
				</Typography>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
				{hotel.amenities.map((amenity, index) => (
					<Chip
					key={index}
					icon={amenityIcons[amenity] || undefined}
					label={amenity}
					variant="outlined"
					/>
				))}
				</Box>
			</Box>
			)}
		</Box>

		<Divider sx={{ mb: 4 }} />

		{/* Номера отеля */}
		<Box>
			<Typography variant="h4" component="h2" gutterBottom>
			Номера
			</Typography>
			
			{roomsLoading ? (
			<Box sx={{ textAlign: 'center', py: 4 }}>
				<CircularProgress />
				<Typography variant="body1" sx={{ mt: 2 }}>
				Загрузка номеров...
				</Typography>
			</Box>
			) : roomsError ? (
			<Alert severity="error" sx={{ mb: 2 }}>
				Ошибка загрузки номеров
			</Alert>
			) : !rooms || rooms.length === 0 ? (
			<Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
				Нет доступных номеров
			</Typography>
			) : (
			<Box>
				{rooms.map((room) => (
				<RoomCard 
					key={room.id} 
					room={room}
					hotel={hotel}
				/>
				))}
			</Box>
			)}
		</Box>
		</Container>
	);
};

export default HotelDetails;