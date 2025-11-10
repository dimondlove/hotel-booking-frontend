import React, { useState } from 'react';
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
	Alert,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Switch,
	FormControlLabel,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { 
	useGetAllRoomsForAdminQuery, 
	useDeleteRoomMutation,
	useGetHotelsQuery,
	useUpdateRoomMutation 
} from '../../store/api/hotelApi';
import CreateRoomModal from '../../components/admin/CreateRoomModal';
import EditRoomModal from '../../components/admin/EditRoomModal';

// Маппинг типов комнат на русские названия
const ROOM_TYPE_LABELS = {
	'STANDARD': 'Стандартный',
	'DELUXE': 'Делюкс', 
	'SUITE': 'Люкс',
	'FAMILY': 'Семейный',
	'LUXURY': 'Премиум'
};

// Функция форматирования цены
const formatPrice = (price) => {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		minimumFractionDigits: 0
	}).format(price);
};

const RoomsManagement = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [hotelFilter, setHotelFilter] = useState('');
	const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all', 'available', 'unavailable'
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [roomToDelete, setRoomToDelete] = useState(null);

	// RTK Query hooks
	const { 
		data: rooms = [], 
		isLoading, 
		error,
		refetch 
	} = useGetAllRoomsForAdminQuery();

	const { 
		data: hotels = [], 
		isLoading: hotelsLoading 
	} = useGetHotelsQuery();

	const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();
	const [updateRoom] = useUpdateRoomMutation();

	// Фильтрация комнат
	const filteredRooms = rooms.filter(room => {
		const matchesSearch = room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
							room.description?.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesHotel = !hotelFilter || room.hotelId === parseInt(hotelFilter);
		
		// Фильтрация по доступности
		let matchesAvailability = true;
		if (availabilityFilter === 'available') {
			matchesAvailability = room.available === true;
		} else if (availabilityFilter === 'unavailable') {
			matchesAvailability = room.available === false;
		}
		
		return matchesSearch && matchesHotel && matchesAvailability;
	});

	// Обработчик переключения доступности
	const handleAvailabilityToggle = async (room) => {
		try {
			await updateRoom({
				id: room.id,
				available: !room.available
			}).unwrap();
			// refetch() автоматически вызовется из-за инвалидации тегов
		} catch (error) {
			console.error('Ошибка при изменении доступности:', error);
		}
	};

	const handleEdit = (room) => {
		setSelectedRoom(room);
		setEditModalOpen(true);
	};

	const handleDeleteClick = (room) => {
		setRoomToDelete(room);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		try {
			await deleteRoom(roomToDelete.id).unwrap();
			setDeleteDialogOpen(false);
			setRoomToDelete(null);
		} catch (error) {
			console.error('Failed to delete room:', error);
		}
	};

	const handleCreateSuccess = () => {
		setCreateModalOpen(false);
		refetch();
	};

	const handleEditSuccess = () => {
		setEditModalOpen(false);
		setSelectedRoom(null);
		refetch();
	};

	if (isLoading) {
		return (
			<Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
				<CircularProgress />
				<Typography variant="h6" sx={{ mt: 2 }}>
					Загрузка номеров...
				</Typography>
			</Container>
		);
	}

	if (error) {
		return (
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Alert severity="error" sx={{ mb: 2 }}>
					Ошибка загрузки номеров: {error.data?.message || 'Попробуйте позже'}
				</Alert>
				<Button variant="contained" onClick={refetch}>
					Попробовать снова
				</Button>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
				<Typography variant="h4" component="h1">
					Управление номерами
				</Typography>
				<Button 
					variant="contained" 
					startIcon={<Add />}
					onClick={() => setCreateModalOpen(true)}
				>
					Добавить номер
				</Button>
			</Box>

			{/* Фильтры */}
			<Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
				<TextField
					placeholder="Поиск по названию или описанию..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					sx={{ minWidth: 250 }}
				/>
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel>Отель</InputLabel>
					<Select
						value={hotelFilter}
						label="Отель"
						onChange={(e) => setHotelFilter(e.target.value)}
						disabled={hotelsLoading}
					>
						<MenuItem value="">Все отели</MenuItem>
						{hotels.map(hotel => (
							<MenuItem key={hotel.id} value={hotel.id}>
								{hotel.name} - {hotel.city}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel>Статус</InputLabel>
					<Select
						value={availabilityFilter}
						label="Статус"
						onChange={(e) => setAvailabilityFilter(e.target.value)}
					>
						<MenuItem value="all">Все номера</MenuItem>
						<MenuItem value="available">Только доступные</MenuItem>
						<MenuItem value="unavailable">Только недоступные</MenuItem>
					</Select>
				</FormControl>
			</Box>

			{/* Статистика */}
			<Box sx={{ mb: 2 }}>
				<Typography variant="body2" color="text.secondary">
					Всего номеров: {rooms.length} | 
					Доступных: {rooms.filter(r => r.available).length} | 
					Недоступных: {rooms.filter(r => !r.available).length} |
					Отфильтровано: {filteredRooms.length}
				</Typography>
			</Box>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Название номера</TableCell>
							<TableCell>Отель</TableCell>
							<TableCell>Тип</TableCell>
							<TableCell>Цена за ночь</TableCell>
							<TableCell>Вместимость</TableCell>
							<TableCell>Удобства</TableCell>
							<TableCell>Статус</TableCell>
							<TableCell align="center">Действия</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredRooms.map((room) => (
							<TableRow 
								key={room.id} 
								hover
								sx={{
									backgroundColor: room.available ? 'inherit' : 'rgba(0, 0, 0, 0.04)',
									'&:hover': {
										backgroundColor: room.available ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.08)',
									}
								}}
							>
								<TableCell>{room.id}</TableCell>
								<TableCell>
									<Typography variant="subtitle2" fontWeight="bold">
										{room.name}
									</Typography>
									{room.description && (
										<Typography variant="caption" color="text.secondary" display="block">
											{room.description.length > 50 
												? `${room.description.substring(0, 50)}...` 
												: room.description
											}
										</Typography>
									)}
								</TableCell>
								<TableCell>
									<Typography variant="body2">
										{room.hotelName}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										ID: {room.hotelId}
									</Typography>
								</TableCell>
								<TableCell>
									<Chip
										label={ROOM_TYPE_LABELS[room.roomType] || room.roomType}
										size="small"
										variant="outlined"
										color="primary"
									/>
								</TableCell>
								<TableCell>
									<Typography variant="body2" fontWeight="medium">
										{formatPrice(room.pricePerNight)}
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="body2">
										{room.capacity} чел.
									</Typography>
								</TableCell>
								<TableCell>
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 150 }}>
										{room.amenities?.slice(0, 2).map((amenity, index) => (
											<Chip
												key={index}
												label={amenity}
												size="small"
												variant="outlined"
											/>
										))}
										{room.amenities?.length > 2 && (
											<Chip
												label={`+${room.amenities.length - 2}`}
												size="small"
											/>
										)}
									</Box>
								</TableCell>
								<TableCell>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Chip
											label={room.available ? 'Доступен' : 'Недоступен'}
											color={room.available ? 'success' : 'error'}
											size="small"
											variant={room.available ? 'filled' : 'outlined'}
										/>
										<Switch
											checked={room.available}
											onChange={() => handleAvailabilityToggle(room)}
											size="small"
											color={room.available ? 'success' : 'error'}
										/>
									</Box>
								</TableCell>
								<TableCell align="center">
									<IconButton 
										color="primary" 
										size="small"
										onClick={() => handleEdit(room)}
										title="Редактировать номер"
									>
										<Edit />
									</IconButton>
									<IconButton
										color="error"
										size="small"
										onClick={() => handleDeleteClick(room)}
										disabled={isDeleting}
										title="Удалить номер"
									>
										<Delete />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Модальное окно создания номера */}
			<CreateRoomModal
				open={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				onSuccess={handleCreateSuccess}
			/>

			{/* Модальное окно редактирования номера */}
			{selectedRoom && (
				<EditRoomModal
					open={editModalOpen}
					onClose={() => {
						setEditModalOpen(false);
						setSelectedRoom(null);
					}}
					onSuccess={handleEditSuccess}
					room={selectedRoom}
				/>
			)}

			{/* Диалог подтверждения удаления */}
			<Dialog
				open={deleteDialogOpen}
				onClose={() => setDeleteDialogOpen(false)}
			>
				<DialogTitle>Подтверждение удаления</DialogTitle>
				<DialogContent>
					<Typography>
						Вы уверены, что хотите удалить номер "{roomToDelete?.name}"?
						Это действие нельзя отменить.
					</Typography>
					<Alert severity="warning" sx={{ mt: 2 }}>
						Все бронирования этого номера также будут отменены.
					</Alert>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteDialogOpen(false)}>
						Отмена
					</Button>
					<Button 
						onClick={handleDeleteConfirm} 
						color="error" 
						variant="contained"
						disabled={isDeleting}
						startIcon={isDeleting ? <CircularProgress size={16} /> : null}
					>
						{isDeleting ? 'Удаление...' : 'Удалить'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Состояние пустого списка */}
			{filteredRooms.length === 0 && !isLoading && (
				<Box sx={{ textAlign: 'center', py: 4 }}>
					<Typography variant="h6" color="text.secondary">
						{searchTerm || hotelFilter || availabilityFilter !== 'all' ? 'Номера не найдены' : 'Нет номеров'}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						{searchTerm || hotelFilter || availabilityFilter !== 'all' 
							? 'Попробуйте изменить параметры поиска' 
							: 'Добавьте первый номер, нажав на кнопку выше'
						}
					</Typography>
				</Box>
			)}
		</Container>
	);
};

export default RoomsManagement;