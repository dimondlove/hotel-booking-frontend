import React, { useState, useEffect } from "react";
import {
	Container,
	Grid,
	TextField,
	Box,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import HotelCard from '../../components/ui/HotelCard';
import Loader from '../../components/ui/Loader';
import { mockHotels } from '../../utils/mockData';

const Hotels = () => {
	const [hotels, setHotels] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState('name');

	useEffect(() => {
		//Имитация загрузки данных
		setTimeout(() => {
			setHotels(mockHotels);
			setLoading(false);
		}, 1000);
	}, []);

	const filteredAndSortedHotels = hotels.filter(hotel =>
		hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
	)
	.sort((a, b) => {
		switch (sortBy) {
			case 'name':
				return a.name.localeCompare(b.name);
			case 'rating':
				return b.rating - a.rating;
			case 'price':
				// Здесь нужно будет добавить логику сортировки по цене когда будут данные о ценах
				return 0;
			default:
				return 0;
		}
	});

	if (loading) {
		return <Loader message="Загрузка отелей..." />
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Typography variant="h4" component="h4" gutterBottom>
				Все отели
			</Typography>

			{/* Поиск и фильтрация */}
			<Box sx={{ mb: 4 }}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							placeholder="Поиск отелей по названию или адресу..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							inputProps={{
								startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
							}}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<FormControl fullWidth>
							<InputLabel>Сортировка</InputLabel>
							<Select
								value={sortBy}
								label="Сортировка"
								onChange={(e) => setSortBy(e.target.value)}
							>
								<MenuItem value="name">По названию</MenuItem>
								<MenuItem value="rating">По рейтингу</MenuItem>
								<MenuItem value="price">По цене</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>
			</Box>
			
			{/* Список отелей */}
			{filteredAndSortedHotels.length === 0 ? (
				<Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
					Отели не найдены
				</Typography>
			) : (
				<Grid container spacing={3}>
					{filteredAndSortedHotels.map((hotel) => (
						<Grid item key={hotel.id} xs={12} sm={6} md={4}>
							<HotelCard hotel={hotel} />
						</Grid>
					))}
				</Grid>
			)}
		</Container>
	);
};

export default Hotels;