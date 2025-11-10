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
	Alert,
	CircularProgress,
	Button,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import HotelCard from '../../components/ui/HotelCard';
import { useGetHotelsQuery, useGetHotelsByCityQuery } from '../../store/api/hotelApi';

const Hotels = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState('name');
	const [citySearch, setCitySearch] = useState('');

	const { 
		data: allHotels, 
		isLoading: allLoading, 
		error: allError,
		refetch: refetchAllHotels 
	} = useGetHotelsQuery();

	const { 
		data: cityHotels, 
		isLoading: cityLoading, 
		error: cityError,
		isFetching: cityFetching 
	} = useGetHotelsByCityQuery(citySearch, {
		skip: !citySearch.trim()
	});

	const hotelsData = citySearch ? cityHotels : allHotels;
	const isLoading = allLoading || (cityLoading && citySearch);
	const error = allError || cityError;

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		
		if (value.length > 2 && /^[а-яА-Яa-zA-Z\s]+$/.test(value)) {
			setCitySearch(value);
		} else {
			setCitySearch('');
		}
	};

	const filteredAndSortedHotels = (hotelsData || [])
		.filter(hotel => 
			searchTerm === '' || 
			hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			hotel.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			hotel.city?.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			switch (sortBy) {
				case 'name':
				return (a.name || '').localeCompare(b.name || '');
				case 'rating':
				return (b.rating || 0) - (a.rating || 0);
				case 'city':
				return (a.city || '').localeCompare(b.city || '');
				default:
				return 0;
			}
	});

	if (error) {
		return (
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Alert severity="error" sx={{ mb: 2 }}>
					Ошибка загрузки отелей: {error.data?.message || 'Попробуйте обновить страницу'}
				</Alert>
				<Button 
					variant="contained" 
					onClick={refetchAllHotels}
				>
					Попробовать снова
				</Button>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Typography variant="h4" component="h4" gutterBottom>
				Все отели
			</Typography>

			{/* Поиск и фильтрация */}
			<Box sx={{ mb: 4 }}>
				<Grid container spacing={2} alignItems="flex-start">
					<Grid item xs={12} md={8}>
						<TextField
							fullWidth
							placeholder="Поиск отелей по названию, адресу или городу..."
							value={searchTerm}
							onChange={handleSearchChange}
							InputProps={{
								startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
							}}
						/>
						<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, height: '20px' }}>
							{citySearch 
								? `Поиск по городу: ${citySearch}` 
								: 'Введите 3+ буквы для поиска по городу'
							}
						</Typography>
					</Grid>
					<Grid item xs={12} md={2}>
						<FormControl fullWidth>
							<InputLabel>Сортировка</InputLabel>
							<Select
								value={sortBy}
								label="Сортировка"
								onChange={(e) => setSortBy(e.target.value)}
							>
								<MenuItem value="name">По названию</MenuItem>
								<MenuItem value="rating">По рейтингу</MenuItem>
								<MenuItem value="city">По городу</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={2}>
						<Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
							<Typography variant="body2" color="text.secondary">
								Найдено отелей: {filteredAndSortedHotels.length}
								{citySearch && ` в городе ${citySearch}`}
							</Typography>
						</Box>
					</Grid>
				</Grid>
			</Box>

			{/* Индикатор загрузки при поиске по городу */}
			{cityFetching && (
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
					<CircularProgress size={20} sx={{ mr: 1 }} />
					<Typography variant="body2">
						Ищем отели в городе {citySearch}...
					</Typography>
				</Box>
			)}
			
			{/* Список отелей */}
			{filteredAndSortedHotels.length === 0 ? (
				<Box sx={{ textAlign: 'center', mt: 4 }}>
				<Typography variant="h6" gutterBottom>
					{searchTerm ? 'Отели не найдены' : 'Нет доступных отелей'}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{searchTerm && 'Попробуйте изменить параметры поиска'}
				</Typography>
				</Box>
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