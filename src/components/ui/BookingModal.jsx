import React, { useState } from "react";
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from "react-redux";
import { formatPrice, calculateTotalNights, validateDates } from '../../utils/helpers';

const BookingModal = ({ open, onClose, room }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [error, setError] = useState('');

    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            checkIn: null,
            checkOut: null,
            guests: 1,
        }
    });

    const watchCheckIn = watch('checkIn');
    const watchCheckOut = watch('checkOut');
    const watchGuests = watch('guests');

    const totalNights = watchCheckIn && watchCheckOut ? calculateTotalNights(watchCheckIn, watchCheckOut) : 0;
    const totalPrice = totalNights * room.price;

    const onSubmit = (date) => {
        if (!isAuthenticated) {
            setError('Для бронирования необходимо войти в систему');
            return;
        }

        if (data.guests > room.capacity) {
            setError(`Максимальное количество гостей для этого номера: ${room.capacity}`);
            return;
        }

        //Здесь будет логика отправки бронирования на бэкенд
        console.log('Бронирование:', { roomId: room.id, ...data });
        alert('Бронирование успешно создано!');
        onClose();
    };

    return(
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Бронирование номера</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        <Typography variant="h6" gutterBottom>
                            {room.hotelId} - Номер {room.roomNumber}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Controller
                                name="checkIn"
                                control={control}
                                rules={{ required: 'Обязательное поле' }}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Дата заезда"
                                        {...field}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                error={!!error.checkIn}
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
                                    inputProps={{ min: 1, max: room.capacity }}
                                />
                            )}
                        />

                        {totalNights > 0 && (
                            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="h6" gutterBottom>Детали бронирования</Typography>
                                <Typography>Ночей: {totalNights}</Typography>
                                <Typography>Цена за ночь: {formatPrice(room.price)}</Typography>
                                <Typography variant="h6" color="primary">
                                    Итого: {formatPrice(totalPrice)}
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Отмена</Button>
                        <Button type="submit" variant="contained" color="primary">
                            Забронировать
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </LocalizationProvider>
    );
};

export default BookingModal;