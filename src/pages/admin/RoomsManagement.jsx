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
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { mockRooms, mockHotels } from '../../utils/mockData';
import { ROOM_TYPE_LABELS, ROOM_TYPES } from '../../utils/constants';
import { formatPrice } from '../../utils/helpers';

const RoomsManagement = () => {
	const [rooms, setRooms] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [hotelFilter, setHotelFilter] = useState('');

	useEffect(() => {
		setRooms(mockRooms);
	}, []);

	const handleDeleteRoom = (roomId) => {
		if (window.confirm('Вы уверены, что хотите удалить номер?')) {
			setRooms(rooms.filter(room => room.id !== roomId));
		}
	};

	const filteredRooms = rooms.filter(room => {
		const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesHotel = !hotelFilter || room.hotelId === parseInt(hotelFilter);
		return matchesSearch && matchesHotel;
	});

	const getHotelName = (hotelId) => {
		const hotel = mockHotels.find(h => h.id === hotelId);
		return hotel ? hotel.name : 'Неизвестно';
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
				<Typography variant="h4" component="h1">
					Управление номерами
				</Typography>
				<Button variant="contained" startIcon={<Add />}>
					Добавить номер
				</Button>
			</Box>

			{/* Фильтры */}
			<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
				<TextField
					placeholder="Поиск по номеру комнаты..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					sx={{ minWidth: 200 }}
				/>
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel>Отель</InputLabel>
					<Select
						value={hotelFilter}
						label="Отель"
						onChange={(e) => setHotelFilter(e.target.value)}
					>
						<MenuItem value="">Все отели</MenuItem>
						{mockHotels.map(hotel => (
							<MenuItem key={hotel.id} value={hotel.id}>
								{hotel.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Номер комнаты</TableCell>
							<TableCell>Отель</TableCell>
							<TableCell>Тип</TableCell>
							<TableCell>Цена за ночь</TableCell>
							<TableCell>Вместимость</TableCell>
							<TableCell>Статус</TableCell>
							<TableCell align="center">Действия</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredRooms.map((room) => (
							<TableRow key={room.id}>
								<TableCell>{room.id}</TableCell>
								<TableCell>
									<Typography variant="subtitle2" fontWeight="bold">
										{room.roomNumber}
									</Typography>
								</TableCell>
								<TableCell>{getHotelName(room.hotelId)}</TableCell>
								<TableCell>
									<Chip
										label={ROOM_TYPE_LABELS[room.type]}
										size="small"
										variant="outlined"
									/>
								</TableCell>
								<TableCell>{formatPrice(room.price)}</TableCell>
								<TableCell>{room.capacity} чел.</TableCell>
								<TableCell>
									<Chip
										label={room.available ? 'Доступен' : 'Занят'}
										color={room.available ? 'success' : 'error'}
										size="small"
									/>
								</TableCell>
								<TableCell align="center">
									<IconButton color="primary" size="small">
										<Edit />
									</IconButton>
									<IconButton
										color="error"
										size="small"
										onClick={() => handleDeleteRoom(room.id)}
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

export default RoomsManagement;