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
import { Person, Wifi, AcUnit, LocalBar } from '@mui/icons-material';
import { formatPrice } from '../../utils/helpers';
import { ROOM_TYPE_LABELS } from '../../utils/constants';
import BookingModal from './BookingModal';

const RoomCard = ({ room }) => {
    const [BookingModalOpen, setBookingModalOpen] = useState(false);

    const getAmenityIcon = (amenity) => {
        const icons = {
            'Wi-Fi': <Wifi />,
            'Кондиционер': <AcUnit />,
            'Мини-бар': <LocalBar />,
        };
        return icons[amenity] || null;
    };

    const handleBook = () => {
        setBookingModalOpen(true);
    };

    return (
        <>
            <Card sx={{ display: 'flex', mb: 2 }}>
                <CardMedia
                    component="img"
                    sx={{ width: 200 }}
                    image={room.images[0] || '/mock-images/room-placeholder.jpg'}
                    alt={`Номер ${room.roomNumber}`}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="h3" variant="h6">
                            {ROOM_TYPE_LABELS[room.type]} №{room.roomNumber}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Person sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                                До {room.capacity} гостей
                            </Typography>
                        </Box>

                        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                            {formatPrice(room.price)} / ночь
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                            {room.amenities.map((amenity, index) => (
                                <Chip
                                    key={index}
                                    icon={getAmenityIcon(amenity)}
                                    label={amenity}
                                    size="small"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBook}
                            disabled={!room.available}
                        >
                            {room.available ? 'Забронировать' : 'Недоступно'}
                        </Button>
                    </CardActions>
                </Box>
            </Card>

            <BookingModal
                open={BookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                room={room}
            />
        </>
    );
};

export default RoomCard;