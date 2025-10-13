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
} from '@mui/material';
import { LocationOn, Phone, Email, Wifi, ArrowBack } from '@mui/icons-material';
import RoomCard from '../../components/ui/RoomCard';
import Loader from '../../components/ui/Loader';
import { mockHotels, mockRooms } from '../../utils/mockData';

const HotelDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [hotel, setHotel] = useState(null);
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
	// Имитация загрузки данных
		const loadData = async () => {
		try {
			setLoading(true);
			setError(null);
		
			// Имитируем задержку сети
			await new Promise(resolve => setTimeout(resolve, 1000));
		
			const foundHotel = mockHotels.find(h => h.id === parseInt(id));
			if (!foundHotel) {
				setError('Отель не найден');
		  		return;
			}
		
			const hotelRooms = mockRooms.filter(r => r.hotelId === parseInt(id));
		
			setHotel(foundHotel);
			setRooms(hotelRooms);
			} catch (err) {
				setError('Произошла ошибка при загрузке данных');
			} finally {
				setLoading(false);
	  		}
		};

		loadData();
	}, [id]);

	if (loading) {
		return <Loader message="Загрузка информации об отеле..." />;
	}

	if (error || !hotel) {
		return (
			<Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
				<Typography variant="h4" component="h1" gutterBottom>
					{error || 'Отель не найден'}
				</Typography>
				<Button 
					variant="contained" 
					startIcon={<ArrowBack />}
					onClick={() => navigate('/hotels')}
					sx={{ mt: 2 }}
				>
					Вернуться к списку отелей
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
					<Rating value={hotel.rating} readOnly precision={0.1} />
					<Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
						{hotel.rating}
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
					<LocationOn sx={{ color: 'text.secondary', mr: 1 }} />
					<Typography variant="body1" color="text.secondary">
						{hotel.address}
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
					<Phone sx={{ color: 'text.secondary', mr: 1 }} />
					<Typography variant="body1" color="text.secondary">
						{hotel.phone}
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
					<Email sx={{ color: 'text.secondary', mr: 1 }} />
					<Typography variant="body1" color="text.secondary">
						{hotel.email}
					</Typography>
				</Box>

				<Typography variant="body1" paragraph>
					{hotel.description}
				</Typography>

				{/* Удобства отеля */}
				<Box sx={{ mb: 4 }}>
					<Typography variant="h6" gutterBottom>
						Удобства отеля:
					</Typography>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
						{hotel.amenities.map((amenity, index) => (
							<Chip
								key={index}
								icon={amenity === 'Wi-Fi' ? <Wifi /> : undefined}
								label={amenity}
								variant="outlined"
							/>
						))}
					</Box>
				</Box>
			</Box>

			<Divider sx={{ mb: 4 }} />

			{/* Номера отеля */}
			<Box>
				<Typography variant="h4" component="h2" gutterBottom>
					Номера
				</Typography>
				
				{rooms.length === 0 ? (
					<Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
						Нет доступных номеров
					</Typography>
				) : (
				<Box>
					{rooms.map((room) => (
						<RoomCard 
							key={room.id} 
							room={room} 
							onBook={(room) => {
							// Временная заглушка для бронирования
							alert(`Бронирование номера ${room.roomNumber}`);
							}}
						/>
					))}
				</Box>
				)}
			</Box>
		</Container>
	);
};

export default HotelDetails;