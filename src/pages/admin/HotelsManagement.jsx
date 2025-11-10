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
	Rating,
	Alert,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import { Delete, Edit, Add, LocationOn } from '@mui/icons-material';
import { 
	useGetHotelsQuery, 
	useDeleteHotelMutation,
} from '../../store/api/hotelApi';
import CreateHotelModal from '../../components/admin/CreateHotelModal';
import EditHotelModal from '../../components/admin/EditHotelModal';

const HotelsManagement = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedHotel, setSelectedHotel] = useState(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [hotelToDelete, setHotelToDelete] = useState(null);

	// RTK Query hooks
	const { 
		data: hotels = [], 
		isLoading, 
		error,
		refetch 
	} = useGetHotelsQuery();

	const [deleteHotel, { isLoading: isDeleting }] = useDeleteHotelMutation();

	const filteredHotels = hotels.filter(hotel =>
		hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		hotel.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		hotel.city?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleEdit = (hotel) => {
		setSelectedHotel(hotel);
		setEditModalOpen(true);
	};

	const handleDeleteClick = (hotel) => {
		setHotelToDelete(hotel);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		try {
		await deleteHotel(hotelToDelete.id).unwrap();
		setDeleteDialogOpen(false);
		setHotelToDelete(null);
		// Данные автоматически обновятся благодаря RTK Query
		} catch (error) {
		console.error('Failed to delete hotel:', error);
		}
	};

	const handleCreateSuccess = () => {
		setCreateModalOpen(false);
		refetch(); // Обновляем данные
	};

	const handleEditSuccess = () => {
		setEditModalOpen(false);
		setSelectedHotel(null);
		refetch(); // Обновляем данные
	};

	if (isLoading) {
		return (
		<Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
			<CircularProgress />
			<Typography variant="h6" sx={{ mt: 2 }}>
			Загрузка отелей...
			</Typography>
		</Container>
		);
	}

	if (error) {
		return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Alert severity="error" sx={{ mb: 2 }}>
			Ошибка загрузки отелей: {error.data?.message || 'Попробуйте позже'}
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
			Управление отелями
			</Typography>
			<Button 
			variant="contained" 
			startIcon={<Add />}
			onClick={() => setCreateModalOpen(true)}
			>
			Добавить отель
			</Button>
		</Box>

		<TextField
			fullWidth
			placeholder="Поиск отелей по названию, адресу или городу..."
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
				<TableCell>Город</TableCell>
				<TableCell>Адрес</TableCell>
				<TableCell>Рейтинг</TableCell>
				<TableCell>Удобства</TableCell>
				<TableCell>Изображения</TableCell>
				<TableCell align="center">Действия</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{filteredHotels.map((hotel) => (
				<TableRow key={hotel.id} hover>
					<TableCell>{hotel.id}</TableCell>
					<TableCell>
					<Typography variant="subtitle2" fontWeight="bold">
						{hotel.name}
					</Typography>
					{hotel.description && (
						<Typography variant="caption" color="text.secondary" display="block">
						{hotel.description.length > 50 
							? `${hotel.description.substring(0, 50)}...` 
							: hotel.description
						}
						</Typography>
					)}
					</TableCell>
					<TableCell>
					<Chip 
						label={hotel.city} 
						size="small" 
						variant="outlined"
					/>
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
						<Rating value={hotel.rating || 0} size="small" readOnly />
						<Typography variant="body2" sx={{ ml: 1 }}>
						{hotel.rating > 0 ? hotel.rating.toFixed(1) : 'Нет оценок'}
						</Typography>
					</Box>
					</TableCell>
					<TableCell>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
						{hotel.amenities?.slice(0, 3).map((amenity, index) => (
						<Chip 
							key={index} 
							label={amenity} 
							size="small" 
							variant="outlined" 
						/>
						))}
						{hotel.amenities?.length > 3 && (
						<Chip 
							label={`+${hotel.amenities.length - 3}`} 
							size="small" 
						/>
						)}
					</Box>
					</TableCell>
					<TableCell>
					<Typography variant="body2" color="text.secondary">
						{hotel.images?.length || 0} изображений
					</Typography>
					</TableCell>
					<TableCell align="center">
					<IconButton 
						color="primary" 
						size="small"
						onClick={() => handleEdit(hotel)}
						title="Редактировать отель"
					>
						<Edit />
					</IconButton>
					<IconButton
						color="error"
						size="small"
						onClick={() => handleDeleteClick(hotel)}
						disabled={isDeleting}
						title="Удалить отель"
					>
						<Delete />
					</IconButton>
					</TableCell>
				</TableRow>
				))}
			</TableBody>
			</Table>
		</TableContainer>

		{/* Модальное окно создания отеля */}
		<CreateHotelModal
			open={createModalOpen}
			onClose={() => setCreateModalOpen(false)}
			onSuccess={handleCreateSuccess}
		/>

		{/* Модальное окно редактирования отеля */}
		{selectedHotel && (
			<EditHotelModal
			open={editModalOpen}
			onClose={() => {
				setEditModalOpen(false);
				setSelectedHotel(null);
			}}
			onSuccess={handleEditSuccess}
			hotel={selectedHotel}
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
				Вы уверены, что хотите удалить отель "{hotelToDelete?.name}"?
				Это действие нельзя отменить.
			</Typography>
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
		{filteredHotels.length === 0 && !isLoading && (
			<Box sx={{ textAlign: 'center', py: 4 }}>
			<Typography variant="h6" color="text.secondary">
				{searchTerm ? 'Отели не найдены' : 'Нет отелей'}
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
				{searchTerm 
				? 'Попробуйте изменить поисковый запрос' 
				: 'Добавьте первый отель, нажав на кнопку выше'
				}
			</Typography>
			</Box>
		)}
		</Container>
	);
};

export default HotelsManagement;