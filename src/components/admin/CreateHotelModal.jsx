import React, { useState } from 'react';
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
} from '@mui/material';
import { Add, Close, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useCreateHotelMutation } from '../../store/api/hotelApi';

// Список доступных удобств
const AVAILABLE_AMENITIES = [
	'WiFi',
	'Бассейн',
	'СПА',
	'Ресторан',
	'Фитнес-центр',
	'Парковка',
	'Кондиционер',
	'Завтрак',
	'Трансфер',
	'Бизнес-центр'
];

const CreateHotelModal = ({ open, onClose, onSuccess }) => {
	const [createHotel, { isLoading, error }] = useCreateHotelMutation();
	const [selectedAmenities, setSelectedAmenities] = useState([]);
	const [images, setImages] = useState([]);
	const [newImageUrl, setNewImageUrl] = useState('');
	const [newAmenity, setNewAmenity] = useState('');

	const { control, handleSubmit, formState: { errors }, reset } = useForm({
		defaultValues: {
		name: '',
		description: '',
		address: '',
		city: '',
		phone: '',
		email: '',
		}
	});

	const handleAmenityToggle = (amenity) => {
		setSelectedAmenities(prev =>
		prev.includes(amenity)
			? prev.filter(a => a !== amenity)
			: [...prev, amenity]
		);
	};

	const handleAddCustomAmenity = () => {
		if (newAmenity.trim() && !selectedAmenities.includes(newAmenity.trim())) {
		setSelectedAmenities(prev => [...prev, newAmenity.trim()]);
		setNewAmenity('');
		}
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

	const handleKeyPress = (e, type) => {
		if (e.key === 'Enter') {
		e.preventDefault();
		if (type === 'amenity') {
			handleAddCustomAmenity();
		} else if (type === 'image') {
			handleAddImage();
		}
		}
	};

	const onSubmit = async (data) => {
		try {
		const hotelData = {
			...data,
			amenities: selectedAmenities,
			images: images, // Используем загруженные изображения
		};

		await createHotel(hotelData).unwrap();
		
		// Сброс формы и закрытие модалки
		reset();
		setSelectedAmenities([]);
		setImages([]);
		onSuccess();
		
		} catch (error) {
		console.error('Failed to create hotel:', error);
		}
	};

	const handleClose = () => {
		reset();
		setSelectedAmenities([]);
		setImages([]);
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
		<DialogTitle>
			<Box display="flex" alignItems="center" justifyContent="space-between">
			<Typography variant="h6">Добавить новый отель</Typography>
			<IconButton onClick={handleClose} size="small">
				<Close />
			</IconButton>
			</Box>
		</DialogTitle>

		<form onSubmit={handleSubmit(onSubmit)}>
			<DialogContent>
			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
				{error.data?.message || 'Ошибка при создании отеля'}
				</Alert>
			)}

			<Grid container spacing={2}>
				<Grid item xs={12}>
				<Controller
					name="name"
					control={control}
					rules={{ required: 'Название отеля обязательно' }}
					render={({ field }) => (
					<TextField
						{...field}
						label="Название отеля"
						fullWidth
						margin="normal"
						error={!!errors.name}
						helperText={errors.name?.message}
					/>
					)}
				/>
				</Grid>

				<Grid item xs={12}>
				<Controller
					name="description"
					control={control}
					rules={{ required: 'Описание обязательно' }}
					render={({ field }) => (
					<TextField
						{...field}
						label="Описание"
						fullWidth
						multiline
						rows={3}
						margin="normal"
						error={!!errors.description}
						helperText={errors.description?.message}
					/>
					)}
				/>
				</Grid>

				<Grid item xs={12} md={6}>
				<Controller
					name="city"
					control={control}
					rules={{ required: 'Город обязателен' }}
					render={({ field }) => (
					<TextField
						{...field}
						label="Город"
						fullWidth
						margin="normal"
						error={!!errors.city}
						helperText={errors.city?.message}
					/>
					)}
				/>
				</Grid>

				<Grid item xs={12} md={6}>
				<Controller
					name="address"
					control={control}
					rules={{ required: 'Адрес обязателен' }}
					render={({ field }) => (
					<TextField
						{...field}
						label="Адрес"
						fullWidth
						margin="normal"
						error={!!errors.address}
						helperText={errors.address?.message}
					/>
					)}
				/>
				</Grid>

				<Grid item xs={12} md={6}>
				<Controller
					name="phone"
					control={control}
					render={({ field }) => (
					<TextField
						{...field}
						label="Телефон"
						fullWidth
						margin="normal"
						placeholder="+79991234567"
					/>
					)}
				/>
				</Grid>

				<Grid item xs={12} md={6}>
				<Controller
					name="email"
					control={control}
					rules={{
					pattern: {
						value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
						message: 'Введите корректный email'
					}
					}}
					render={({ field }) => (
					<TextField
						{...field}
						label="Email"
						fullWidth
						margin="normal"
						error={!!errors.email}
						helperText={errors.email?.message}
						placeholder="hotel@example.com"
					/>
					)}
				/>
				</Grid>

				{/* Изображения */}
				<Grid item xs={12}>
				<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
					Изображения отеля
				</Typography>
				
				<Box sx={{ mb: 2 }}>
					<Typography variant="body2" color="text.secondary" gutterBottom>
					Добавьте ссылки на изображения отеля:
					</Typography>
					<Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
					<TextField
						value={newImageUrl}
						onChange={(e) => setNewImageUrl(e.target.value)}
						onKeyPress={(e) => handleKeyPress(e, 'image')}
						placeholder="https://example.com/hotel-image.jpg"
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
						Добавленные изображения ({images.length}):
						</Typography>
						<Grid container spacing={1}>
						{images.map((image, index) => (
							<Grid item xs={6} sm={4} md={3} key={index}>
							<Card sx={{ position: 'relative' }}>
								<CardMedia
								component="img"
								height="80"
								image={image}
								alt={`Изображение отеля ${index + 1}`}
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
					Удобства отеля
				</Typography>
				
				{/* Стандартные удобства */}
				<Box sx={{ mb: 2 }}>
					<Typography variant="body2" color="text.secondary" gutterBottom>
					Выберите из списка:
					</Typography>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
					{AVAILABLE_AMENITIES.map(amenity => (
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

				{/* Кастомные удобства */}
				<Box>
					<Typography variant="body2" color="text.secondary" gutterBottom>
					Добавить свое удобство:
					</Typography>
					<Box sx={{ display: 'flex', gap: 1 }}>
					<TextField
						value={newAmenity}
						onChange={(e) => setNewAmenity(e.target.value)}
						onKeyPress={(e) => handleKeyPress(e, 'amenity')}
						placeholder="Введите удобство..."
						size="small"
						sx={{ flexGrow: 1 }}
					/>
					<Button
						startIcon={<Add />}
						onClick={handleAddCustomAmenity}
						disabled={!newAmenity.trim()}
						variant="outlined"
					>
						Добавить
					</Button>
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
				disabled={isLoading || images.length === 0}
				startIcon={isLoading ? <CircularProgress size={16} /> : null}
			>
				{isLoading ? 'Создание...' : 'Создать отель'}
			</Button>
			</DialogActions>
		</form>
		</Dialog>
	);
};

export default CreateHotelModal;