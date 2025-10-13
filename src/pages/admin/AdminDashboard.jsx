import React from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
} from '@mui/material';
import {
    People,
    Hotel,
    MeetingRoom,
    Receipt,
} from '@mui/icons-material';

const AdminDashboard = () => {
    const stats = [
        { title: 'Всего пользователей', value: '1,234', icon: People, color: '#1976d2' },
        { title: 'Всего отелей', value: '89', icon: Hotel, color: '#2e7d32' },
        { title: 'Всего номеров', value: '1,567', icon: MeetingRoom, color: '#ed6c02' },
        { title: 'Бронирований сегодня', value: '42', icon: Receipt, color: '#d32f2f' },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Панель управления
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Обзор системы бронирования отелей
            </Typography>

            {/* Статистика */}
             <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <stat.icon sx={{ color: stat.color, fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h4" component="div" fontWeight="bold">
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {stat.title}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
             </Grid>

             {/* Быстрые действия */}
             <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Быстрые действия
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Используйте меню слева для управления пользователями, отелями и номерами.
                        {/*Здесь будет отображаться статистика и последние активности по мере разработки бэкенда.*/}
                    </Typography>
                </CardContent>
             </Card>
        </Container>
    );
};

export default AdminDashboard;