import React from 'react';
import {
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Typography,
	Button,
	Box,
	Chip,
	Rating,
} from '@mui/material';
import { LocationOn, Star, Wifi, AcUnit, LocalParking, Pool } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const amenityIcons = {
	'Wi-Fi': <Wifi fontSize="small" />,
	'Кондиционер': <AcUnit fontSize="small" />,
	'Бассейн': <Pool fontSize="small" />,
	'Парковка': <LocalParking fontSize="small" />,
};

const HotelCard = ({ hotel }) => {
	const navigate = useNavigate();

	const handleViewDetails = () => {
		navigate(`/hotels/${hotel.id}`);
	};

	const mainImage = hotel.images?.[0] || '/mock-images/hotel-placeholder.jpg';
	const amenities = hotel.amenities || [];
	const rating = hotel.rating || 0;
	const address = hotel.address || 'Адрес не указан';
	const city = hotel.city || 'Город не указан';
	const description = hotel.description || 'Описание отсутствует';

	const truncatedDescription = description.length > 100 
		? `${description.substring(0, 100)}...` 
		: description;

	return (
		<Card sx={{ 
			maxWidth: 345, 
			height: '100%', 
			display: 'flex', 
			flexDirection: 'column',
			transition: 'transform 0.2s, box-shadow 0.2s',
			'&:hover': {
				transform: 'translateY(-4px)',
				boxShadow: 4,
			}
		 }}>
			<CardMedia
				component="img"
				height="200"
				image={mainImage}
				alt={hotel.name}
				sx={{ 
					objectFit: 'cover',
					backgroundColor: '#f5f5f5'
				}}
			/>
			<CardContent sx={{ flexGrow: 1, p: 2 }}>
				<Typography
					gutterBottom 
					variant="h6" 
					component="h2"
					sx={{ 
						height: '64px',
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden'
					}}
				>
					{hotel.name}
				</Typography>

				<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
					<Rating 
						value={rating} 
						readOnly 
						precision={0.1} 
						size="small" 
						emptyIcon={<Star fontSize="inherit" />}
					/>
					<Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
						{rating > 0 ? rating.toFixed(1) : 'Нет оценок'}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
						• {city}
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
					<LocationOn sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25, mr: 1 }} />
					<Typography variant="body2" color="text.secondary">
						{address}
					</Typography>
				</Box>

				<Typography 
					variant="body2" 
					color="text.secondary" 
					sx={{ 
						mb: 2,
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden'
					}}
				>
					{truncatedDescription}
				</Typography>

				{amenities.length > 0 && (
					<Box sx={{ mb: 1 }}>
						<Typography variant="caption" color="text.secondary" display="block" gutterBottom>
							Удобства:
						</Typography>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
							{amenities.slice(0, 3).map((amenity, index) => (
								<Chip 
									key={index} 
									label={amenity} 
									size="small" 
									variant="outlined"
									icon={amenityIcons[amenity] || undefined}
									sx={{ 
										fontSize: '0.7rem',
										height: '24px'
									}}
								/>
							))}
							{amenities.length > 3 && (
								<Chip 
									label={`+${amenities.length - 3}`} 
									size="small" 
									variant="outlined"
									sx={{ fontSize: '0.7rem', height: '24px' }}
								/>
							)}
						</Box>
					</Box>
				)}
			</CardContent>
			<CardActions sx={{ p: 2, pt: 0 }}>
				<Button 
					size="small" 
					color="primary" 
					variant="contained"
					onClick={handleViewDetails}
					fullWidth
				>
					Подробнее
				</Button>
			</CardActions>
		</Card>
	);
};

export default HotelCard;