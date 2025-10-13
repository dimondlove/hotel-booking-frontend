import React, { useState, useEffect } from 'react';
import {
	Container,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	IconButton,
	Box,
	TextField,
	Chip,
	Rating,
} from '@mui/material';
import { Delete, Edit, Add, LocationOn } from '@mui/icons-material';
import { mockHotels } from '../../utils/mockData';

const HotelsManagement = () => {
	const [hotels, setHotels] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		setHotels(mockHotels);
	}, []);

	const handleDeleteUser = (hotelId) => {
		if (window.confirm('Вы уверены, что хотите удалить отель?')) {
			setHotels(hotels.filter(hotel => hotel.id !== hotelId));
		}
	};

	const filteredHotels = hotels.filter(hotel =>
		hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
				<Typography variant="h4" component="h1">
					Управление отелями
				</Typography>
				<Button variant="contained" startIcon={<Add />}>
					Добавить отель
				</Button>
			</Box>

			<TextField
				fullWidth
				placeholder="Поиск отелей..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				sx={{ mb: 3 }}
			/>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Название</TableCell>
							<TableCell>Адрес</TableCell>
							<TableCell>Рейтинг</TableCell>
							<TableCell>Удобства</TableCell>
							<TableCell align="center">Действия</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredHotels.map((hotel) => (
							<TableRow key={hotel.id}>
								<TableCell>{hotel.id}</TableCell>
								<TableCell>
									<Typography variant="subtitle2" fontWeight="bold">
										{hotel.name}
									</Typography>
								</TableCell>
								<TableCell>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
										<Typography variant="body2">
											{hotel.address}
										</Typography>
									</Box>
								</TableCell>
								<TableCell>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Rating value={hotel.rating} size="small" readOnly />
										<Typography variant="body2" sx={{ ml: 1 }}>
											{hotel.rating}
										</Typography>
									</Box>
								</TableCell>
								<TableCell>
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
										{hotel.amenities.slice(0, 3).map((amenity, index) => (
											<Chip key={index} label={amenity} size="small" variant="outlined" />
										))}
										{hotel.amenities.length > 3 && (
											<Chip label={`+${hotel.amenities.length - 3}`} size="small" />
										)}
									</Box>
								</TableCell>
								<TableCell align="center">
									<IconButton color="primary" size="small">
										<Edit />
									</IconButton>
									<IconButton
										color="error"
										size="small"
										onClick={() => handleDeleteHotel(hotel.id)}
									>
										<Delete />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
};

export default HotelsManagement;