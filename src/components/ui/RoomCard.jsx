import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Chip,
} from '@mui/material';
import { Person, Wifi, AcUnit, LocalBar, Tv, Coffee } from '@mui/icons-material';
import BookingModal from './BookingModal';

const ROOM_TYPE_LABELS = {
    'STANDARD': 'Стандартный',
    'DELUXE': 'Делюкс',
    'SUITE': 'Люкс',
    'FAMILY': 'Семейный',
    'LUXURY': 'Премиум'
};

const amenityIcons = {
    'Wi-Fi': <Wifi />,
    'WiFi': <Wifi />,
    'Кондиционер': <AcUnit />,
    'Мини-бар': <LocalBar />,
    'Телевизор': <Tv />,
    'Чайник': <Coffee />,
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
};

const RoomCard = ({ room, hotel }) => {
    const [bookingModalOpen, setBookingModalOpen] = useState(false);

    const handleBook = () => {
        setBookingModalOpen(true);
    };

    const mainImage = room.images?.[0] || '/mock-images/room-placeholder.jpg';
    const amenities = room.amenities || [];
    const roomTypeLabel = ROOM_TYPE_LABELS[room.roomType] || room.roomType;
    const isAvailable = room.available !== false; // По умолчанию доступен

    return (
        <>
        <Card sx={{ display: 'flex', mb: 3, overflow: 'hidden' }}>
            <CardMedia
            component="img"
            sx={{ width: 250, objectFit: 'cover' }}
            image={mainImage}
            alt={`Номер ${room.name || roomTypeLabel}`}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2 }}>
            <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
                <Typography component="h3" variant="h6" gutterBottom>
                {room.name || `${roomTypeLabel} номер`}
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                {room.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                    До {room.capacity || 2} гостей
                </Typography>
                </Box>

                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                {formatPrice(room.pricePerNight)} / ночь
                </Typography>

                {amenities.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {amenities.slice(0, 4).map((amenity, index) => (
                    <Chip
                        key={index}
                        icon={amenityIcons[amenity] || undefined}
                        label={amenity}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                    />
                    ))}
                    {amenities.length > 4 && (
                    <Chip
                        label={`+${amenities.length - 4}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                    />
                    )}
                </Box>
                )}
            </CardContent>
            <CardActions sx={{ p: 0 }}>
                <Button
                variant="contained"
                color="primary"
                onClick={handleBook}
                disabled={!isAvailable}
                size="large"
                >
                {isAvailable ? 'Забронировать' : 'Недоступно'}
                </Button>
            </CardActions>
            </Box>
        </Card>

        <BookingModal
            open={bookingModalOpen}
            onClose={() => setBookingModalOpen(false)}
            room={room}
            hotel={hotel}
        />
        </>
    );
};    

export default RoomCard;