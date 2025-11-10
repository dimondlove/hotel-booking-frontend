import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Box,
	Typography,
	Alert,
	CircularProgress,
	Chip,
	IconButton,
	Grid,
	Card,
	CardMedia,
	CardActions,
	FormControl,
	FormControlLabel,
	InputLabel,
	Select,
	MenuItem,
	Switch
} from '@mui/material';
import { Add, Close, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateRoomMutation } from '../../store/api/hotelApi';
import { useGetHotelsQuery } from '../../store/api/hotelApi';

// Типы комнат
const ROOM_TYPES = [
	{ value: 'STANDARD', label: 'Стандартный' },
	{ value: 'DELUXE', label: 'Делюкс' },
	{ value: 'SUITE', label: 'Люкс' },
	{ value: 'FAMILY', label: 'Семейный' },
	{ value: 'LUXURY', label: 'Премиум' }
];

// Доступные удобства для комнат
const ROOM_AMENITIES = [
	'Wi-Fi',
	'Кондиционер',
	'Телевизор',
	'Мини-бар',
	'Сейф',
	'Фен',
	'Халат и тапочки',
	'Кофеварка',
	'Чайник',
	'Утюг',
	'Рабочий стол',
	'Балкон',
	'Вид на море',
	'Вид на город'
];

const EditRoomModal = ({ open, onClose, onSuccess, room }) => {
	const [updateRoom, { isLoading, error }] = useUpdateRoomMutation();
	const { data: hotels = [], isLoading: hotelsLoading } = useGetHotelsQuery();
	const [selectedAmenities, setSelectedAmenities] = useState([]);
	const [images, setImages] = useState([]);
	const [newImageUrl, setNewImageUrl] = useState('');

	const { control, handleSubmit, formState: { errors }, reset } = useForm({
		defaultValues: {
		name: '',
		description: '',
		roomType: '',
		capacity: 2,
		pricePerNight: '',
		hotelId: '',
		available: false,
		}
	});

	// Инициализация формы данными комнаты
	useEffect(() => {
		if (room) {
		reset({
			name: room.name || '',
			description: room.description || '',
			roomType: room.roomType || '',
			capacity: room.capacity || 2,
			pricePerNight: room.pricePerNight || '',
			hotelId: room.hotelId || '',
		});
		setSelectedAmenities(room.amenities || []);
		setImages(room.images || []);
		}
	}, [room, reset]);

	const handleAmenityToggle = (amenity) => {
		setSelectedAmenities(prev =>
		prev.includes(amenity)
			? prev.filter(a => a !== amenity)
			: [...prev, amenity]
		);
	};

	const handleAddImage = () => {
		if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
		setImages(prev => [...prev, newImageUrl.trim()]);
		setNewImageUrl('');
		}
	};

	const handleRemoveImage = (imageToRemove) => {
		setImages(prev => prev.filter(img => img !== imageToRemove));
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
		e.preventDefault();
		handleAddImage();
		}
	};

	const onSubmit = async (data) => {
		try {
		const roomData = {
			id: room.id,
			...data,
			capacity: parseInt(data.capacity),
			pricePerNight: parseFloat(data.pricePerNight),
			amenities: selectedAmenities,
			images: images,
		};

		await updateRoom(roomData).unwrap();
		onSuccess();
		
		} catch (error) {
		console.error('Failed to update room:', error);
		}
	};

	const handleClose = () => {
		reset();
		setSelectedAmenities([]);
		setImages([]);
		onClose();
	};

	if (!room) return null;

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
		<DialogTitle>
			<Box display="flex" alignItems="center" justifyContent="space-between">
			<Typography variant="h6">Редактировать номер</Typography>
			<IconButton onClick={handleClose} size="small">
				<Close />
			</IconButton>
			</Box>
		</DialogTitle>

		<form onSubmit={handleSubmit(onSubmit)}>
			<DialogContent>
			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
				{error.data?.message || 'Ошибка при обновлении номера'}
				</Alert>
			)}

			<Grid container spacing={2}>
				{/* Основная информация */}
				<Grid item xs={12} md={6}>
				<Controller
					name="name"
					control={control}
					rules={{ required: 'Название номера обязательно' }}
					render={({ field }) => (
					<TextField
						{...field}
						label="Название номера"
						fullWidth
						margin="normal"
						error={!!errors.name}
						helperText={errors.name?.message}
					/>
					)}
				/>
				</Grid>

				<Grid item xs={12} md={6}>
				<Controller
					name="roomType"
					control={control}
					rules={{ required: 'Тип номера обязателен' }}
					render={({ field }) => (
					<FormControl fullWidth margin="normal" error={!!errors.roomType}>
						<InputLabel>Тип номера</InputLabel>
						<Select {...field} label="Тип номера">
						{ROOM_TYPES.map(type => (
							<MenuItem key={type.value} value={type.value}>
							{type.label}
							</MenuItem>
						))}
						</Select>
						{errors.roomType && (
						<Typography variant="caption" color="error">
							{errors.roomType.message}
						</Typography>
						)}
					</FormControl>
					)}
				/>
				</Grid>

				<Grid item xs={12}>
				<Controller
					name="description"
					control={control}
					render={({ field }) => (
					<TextField
						{...field}
						label="Описание номера"
						fullWidth
						multiline
						rows={3}
						margin="normal"
					/>
					)}
				/>
				</Grid>

				<Grid item xs={12} md={6}>
				<Controller
					name="capacity"
					control={control}
					rules={{ 
					required: 'Вместимость обязательна',
					min: { value: 1, message: 'Минимум 1 гость' }
					}}
					render={({ field }) => (
					<TextField
						{...field}
						type="number"
						label="Вместимость (гостей)"
						fullWidth
						margin="normal"
						error={!!errors.capacity}
						helperText={errors.capacity?.message}
						inputProps={{ min: 1, max: 10 }}
					/>
					)}
				/>
				</Grid>

				<Grid item xs={12} md={6}>
				<Controller
					name="pricePerNight"
					control={control}
					rules={{ 
					required: 'Цена за ночь обязательна',
					min: { value: 0, message: 'Цена не может быть отрицательной' }
					}}
					render={({ field }) => (
					<TextField
						{...field}
						type="number"
						label="Цена за ночь (₽)"
						fullWidth
						margin="normal"
						error={!!errors.pricePerNight}
						helperText={errors.pricePerNight?.message}
						inputProps={{ min: 0, step: 100 }}
					/>
					)}
				/>
				</Grid>

				<Grid item xs={12}>
				<Controller
					name="hotelId"
					control={control}
					rules={{ required: 'Выбор отеля обязателен' }}
					render={({ field }) => (
					<FormControl fullWidth margin="normal" error={!!errors.hotelId}>
						<InputLabel>Отель</InputLabel>
						<Select {...field} label="Отель" disabled={hotelsLoading}>
						{hotelsLoading && <MenuItem>Загрузка отелей...</MenuItem>}
						{hotels.map(hotel => (
							<MenuItem key={hotel.id} value={hotel.id}>
							{hotel.name} - {hotel.city}
							</MenuItem>
						))}
						</Select>
						{errors.hotelId && (
						<Typography variant="caption" color="error">
							{errors.hotelId.message}
						</Typography>
						)}
					</FormControl>
					)}
				/>
				</Grid>

				<Grid item xs={12}>
					<Controller
						name="available"
						control={control}
						render={({ field }) => (
						<FormControlLabel
							control={
							<Switch
								{...field}
								checked={field.value || false}
								onChange={(e) => field.onChange(e.target.checked)}
								color="primary"
							/>
							}
							label="Доступен для бронирования"
							sx={{ mt: 2 }}
						/>
						)}
					/>
				</Grid>

				{/* Изображения */}
				<Grid item xs={12}>
				<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
					Изображения номера
				</Typography>
				
				<Box sx={{ mb: 2 }}>
					<Typography variant="body2" color="text.secondary" gutterBottom>
					Добавьте ссылки на изображения номера:
					</Typography>
					<Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
					<TextField
						value={newImageUrl}
						onChange={(e) => setNewImageUrl(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="https://example.com/room-image.jpg"
						fullWidth
						size="small"
					/>
					<Button
						startIcon={<Add />}
						onClick={handleAddImage}
						disabled={!newImageUrl.trim()}
						variant="outlined"
					>
						Добавить
					</Button>
					</Box>

					{/* Предпросмотр изображений */}
					{images.length > 0 && (
					<Box>
						<Typography variant="body2" color="text.secondary" gutterBottom>
						Текущие изображения ({images.length}):
						</Typography>
						<Grid container spacing={1}>
						{images.map((image, index) => (
							<Grid item xs={6} sm={4} md={3} key={index}>
							<Card sx={{ position: 'relative' }}>
								<CardMedia
								component="img"
								height="80"
								image={image}
								alt={`Изображение номера ${index + 1}`}
								sx={{ objectFit: 'cover' }}
								/>
								<CardActions sx={{ p: 0.5, justifyContent: 'center' }}>
								<IconButton
									size="small"
									color="error"
									onClick={() => handleRemoveImage(image)}
								>
									<Delete fontSize="small" />
								</IconButton>
								</CardActions>
							</Card>
							</Grid>
						))}
						</Grid>
					</Box>
					)}
				</Box>
				</Grid>

				{/* Удобства */}
				<Grid item xs={12}>
				<Typography variant="h6" gutterBottom>
					Удобства номера
				</Typography>
				
				<Box sx={{ mb: 2 }}>
					<Typography variant="body2" color="text.secondary" gutterBottom>
					Выберите удобства номера:
					</Typography>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
					{ROOM_AMENITIES.map(amenity => (
						<Chip
						key={amenity}
						label={amenity}
						clickable
						color={selectedAmenities.includes(amenity) ? 'primary' : 'default'}
						variant={selectedAmenities.includes(amenity) ? 'filled' : 'outlined'}
						onClick={() => handleAmenityToggle(amenity)}
						/>
					))}
					</Box>
				</Box>

				{/* Выбранные удобства */}
				{selectedAmenities.length > 0 && (
					<Box sx={{ mt: 2 }}>
					<Typography variant="body2" color="text.secondary" gutterBottom>
						Выбранные удобства:
					</Typography>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
						{selectedAmenities.map(amenity => (
						<Chip
							key={amenity}
							label={amenity}
							onDelete={() => handleAmenityToggle(amenity)}
							color="primary"
							variant="filled"
						/>
						))}
					</Box>
					</Box>
				)}
				</Grid>
			</Grid>
			</DialogContent>

			<DialogActions>
			<Button onClick={handleClose} disabled={isLoading}>
				Отмена
			</Button>
			<Button
				type="submit"
				variant="contained"
				disabled={isLoading}
				startIcon={isLoading ? <CircularProgress size={16} /> : null}
			>
				{isLoading ? 'Обновление...' : 'Обновить номер'}
			</Button>
			</DialogActions>
		</form>
		</Dialog>
	);
};

export default EditRoomModal;