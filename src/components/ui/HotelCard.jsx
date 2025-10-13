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
import { LocationOn, Phone, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';

const HotelCard = ({ hotel }) => {
	const navigate = useNavigate();

	const hadnleViewDetails = () => {
		navigate(`/hotels/${hotel.id}`);
	};

	return (
		<Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
			<CardMedia
				component="img"
				height="200"
				image={hotel.images[0] || '/mock-images/hotel-placeholder.jpg'}
				alt={hotel.name}
			/>
			<CardContent sx={{ flexGrow: 1 }}>
				<Typography gutterBottom variant="h5" component="h2">
					{hotel.name}
				</Typography>

				<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
					<Rating value={hotel.rating} readOnly precision={0.1} size="small" />
					<Typography variant="body2" color="text.secondary" sx={{ ml:1 }}>
						{hotel.rating}
					</Typography>
				</Box>

				<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					<LocationOn sx={{ fontSize: 16, verticalAlign: "bottom" }} />
					{hotel.address}
				</Typography>

				<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					<LocationOn sx={{ fontSize: 16, verticalAlign: "bottom" }} />
					{hotel.phone}
				</Typography>

				<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					<LocationOn sx={{ fontSize: 16, verticalAlign: "bottom" }} />
					{hotel.email}
				</Typography>

				<Typography variant="body2" sx={{ mb: 2 }}>
					{hotel.description}
				</Typography>

				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
					{hotel.amenities.slice(0, 3).map((amenity, index) => (
						<Chip key={index} label={amenity} size="small" />
					))}
					{hotel.amenities.length > 3 && (
						<Chip label={`+${hotel.amenities.length - 3}`} size="small" />
					)}
				</Box>
			</CardContent>
			<CardActions>
				<Button size="small" color="primary" onClick={hadnleViewDetails}>
					Подробнее
				</Button>
			</CardActions>
		</Card>
	);
};

export default HotelCard;