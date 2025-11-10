import React, { useState, useEffect } from "react";
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from "react-redux";
import { useCreateBookingMutation } from '../../store/api/hotelApi';

const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
};

const calculateTotalNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const BookingModal = ({ open, onClose, room, hotel }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [createBooking, { isLoading, error: bookingError }] = useCreateBookingMutation();
    const [error, setError] = useState('');

    const { control, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            checkIn: null,
            checkOut: null,
            guests: 1,
            specialRequests: '',
        }
    });

    const watchCheckIn = watch('checkIn');
    const watchCheckOut = watch('checkOut');
    const watchGuests = watch('guests');

    const totalNights = watchCheckIn && watchCheckOut ? calculateTotalNights(watchCheckIn, watchCheckOut) : 0;
    const totalPrice = totalNights * (room?.pricePerNight || 0);

    // Сброс формы при закрытии
    useEffect(() => {
        if (!open) {
            reset();
            setError('');
        }
    }, [open, reset]);

    const validateDates = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 'Выберите даты заезда и выезда';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (checkIn < today) return 'Дата заезда не может быть в прошлом';
        if (checkOut <= checkIn) return 'Дата выезда должна быть после даты заезда';
        
        return null;
    };

    const onSubmit = async (data) => {
        if (!isAuthenticated) {
            setError('Для бронирования необходимо войти в систему');
            return;
        }

        // Валидация дат
        const dateError = validateDates(data.checkIn, data.checkOut);
        if (dateError) {
            setError(dateError);
            return;
        }

        if (data.guests > room.capacity) {
            setError(`Максимальное количество гостей для этого номера: ${room.capacity}`);
            return;
        }

        if (data.guests < 1) {
            setError('Количество гостей должно быть не менее 1');
            return;
        }

        try {
            const bookingData = {
                roomId: room.id,
                checkInDate: data.checkIn.toISOString().split('T')[0], // Форматируем в YYYY-MM-DD
                checkOutDate: data.checkOut.toISOString().split('T')[0],
                guests: data.guests,
                specialRequests: data.specialRequests || '',
            };

            const result = await createBooking(bookingData).unwrap();
            
            // Успешное бронирование
            alert('Бронирование успешно создано!');
            onClose();
            reset();
            
        } catch (error) {
            console.error('Booking error:', error);
            setError(error.data?.message || 'Произошла ошибка при бронировании');
        }
    };

    if (!room || !hotel) {
        return null;
    }

    return(
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Бронирование номера</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        {/* Общие ошибки */}
                        {(error || bookingError) && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error || bookingError?.data?.message}
                            </Alert>
                        )}

                        {/* Информация о бронировании */}
                        <Typography variant="h6" gutterBottom>
                            {hotel.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            {room.name || `Номер ${room.roomType}`}
                        </Typography>

                        {/* Даты бронирования */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Controller
                                name="checkIn"
                                control={control}
                                rules={{ required: 'Обязательное поле' }}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Дата заезда"
                                        {...field}
                                        minDate={new Date()}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                error={!!errors.checkIn}
                                                helperText={errors.checkIn?.message}
                                            />
                                        )}
                                    />
                                )}
                            />

                            <Controller
                                name="checkOut"
                                control={control}
                                rules={{ required: 'Обязательное поле' }}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Дата выезда"
                                        {...field}
                                        minDate={watchCheckIn || new Date()}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                error={!!errors.checkOut}
                                                helperText={errors.checkOut?.message}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Box>

                        {/* Количество гостей */}
                        <Controller
                            name="guests"
                            control={control}
                            rules={{
                                required: 'Обязательное поле',
                                min: { value: 1, message: 'Минимум 1 гость' },
                                max: { value: room.capacity, message: `Максимум ${room.capacity} гостей` }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    label="Количество гостей"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.guests}
                                    helperText={errors.guests?.message}
                                    inputProps={{ 
                                        min: 1, 
                                        max: room.capacity,
                                        step: 1
                                    }}
                                />
                            )}
                        />

                        {/* Особые пожелания */}
                        <Controller
                            name="specialRequests"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Особые пожелания (необязательно)"
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={3}
                                    placeholder="Укажите дополнительные пожелания к бронированию..."
                                />
                            )}
                        />

                        {/* Детали стоимости */}
                        {totalNights > 0 && (
                            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    Детали бронирования
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">
                                        {totalNights} ночей × {formatPrice(room.pricePerNight)}
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatPrice(totalPrice)}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Вместимость: до {room.capacity} гостей
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                    <Typography variant="h6">Итого:</Typography>
                                    <Typography variant="h6" color="primary">
                                        {formatPrice(totalPrice)}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} disabled={isLoading}>
                            Отмена
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={16} /> : null}
                        >
                            {isLoading ? 'Бронируем...' : 'Забронировать'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </LocalizationProvider>
    );
};

export default BookingModal;