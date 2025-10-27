import React, { useState, useEffect } from "react";
import {
	Container,
	Typography,
	Button,
	Box,
	Grid,
	Card,
	CardContent,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { LocationOn, Star, Wifi } from '@mui/icons-material';

const Home = () => {
	const [timeString, setTimeString] = useState('');
  	const [intervalId, setIntervalId] = useState(null);

	// Функция приветствия
	const greetUser = () => {
		const firstName = prompt("Пожалуйста, введите ваше имя:");
		const middleName = prompt("Пожалуйста, введите ваше отчество:");

		const greeting = `Привет, ${firstName || ''} ${middleName || ''}!\nДобро пожаловать на мою страницу.`;
		alert(greeting);
	};

	// Функция форматирования даты и времени
	const formatDateTime = () => {
		const now = new Date();
		
		const daysOfWeek = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
		const months = [
			'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
			'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
		];
		
		const dayOfWeek = daysOfWeek[now.getDay()];
		const day = now.getDate();
		const month = months[now.getMonth()];
		const year = now.getFullYear();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		const seconds = now.getSeconds();
		
		const formattedDateTime = 
		`${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ` +
		`${day} ${month} ${year} года ` +
		`${hours} час. ${minutes} мин. ${seconds} сек`;
		
		setTimeString(formattedDateTime);
	};

	// Обработчик для кнопки времени
	const handleShowTime = () => {
		// Очищаем предыдущий интервал
		if (intervalId) {
		clearInterval(intervalId);
		}

		// Сразу обновляем время
		formatDateTime();

		// Запускаем новый интервал
		const id = setInterval(formatDateTime, 1000);
		setIntervalId(id);
	};

	// Очистка интервала при размонтировании компонента
	useEffect(() => {
		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [intervalId]);

	return(
		<Box>
			<Box
				sx={{
					background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
					color: 'white',
					py: 10,
					textAlign: 'center',
				}}
			>
				<Container maxWidth="md">
					<Typography variant="h2" component="h1" gutterBottom>
						Найдите идеальный отель
					</Typography>
					<Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
						Бронируйте лучшие отели по всему миру по выгодным ценам
					</Typography>
					<Button
						variant="contained"
						size="large"
						component={Link}
						to="/hotels"
						sx={{
							backgroundColor: 'white',
							color: 'primary.main',
							'&:hover': {
								backgroundColor: 'grey.100',
							},
						}}
					>
						Найти отели
					</Button>
				</Container>
			</Box>

			<Container sx={{ py: 8 }}>
				<Typography variant="h4" component="h2" align="center" gutterBottom>
					Почему выбирают нас?
				</Typography>
				<Grid container spacing={4} sx={{ mt: 2 }}>
					<Grid item xs={12} md={4}>
						<Card sx={{ textAlign: 'center', p: 2 }}>
							<LocationOn color="primary" sx={{ fontSize: 48, mb: 2 }} />
							<Typography variant="h6" gutterBottom>
								Лучшие локации
							</Typography>
							<Typography>
								Отели в самых популярных и удобных местах города
							</Typography>
						</Card>
					</Grid>
					<Grid item xs={12} md={4}>
						<Card sx={{ textAlign: 'center', p: 2 }}>
							<Star color="primary" sx={{ fontSize: 48, mb: 2 }} />
							<Typography variant="h6" gutterBottom>
								Высокий рейтинг
							</Typography>
							<Typography>
								Только проверенные отели с отличными отзывами
							</Typography>
						</Card>
					</Grid>
					<Grid item xs={12} md={4}>
						<Card sx={{ textAlign: 'center', p: 2 }}>
							<Wifi color="primary" sx={{ fontSize: 48, mb: 2 }} />
							<Typography variant="h6" gutterBottom>
								Все удобства
							</Typography>
							<Typography>
								Wi-Fi, бассейны, рестораны и многое другое
							</Typography>
						</Card>
					</Grid>
				</Grid>
			</Container>

			{/* Дополнительный раздел со скриптами */}
			<Container sx={{ py: 4 }}>
				<Card sx={{ p: 3 }}>
					<Typography variant="h5" component="h3" gutterBottom align="center">
						Демонстрация JavaScript функций
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
						<Button 
							variant="contained" 
							color="primary" 
							onClick={greetUser}
							sx={{ minWidth: 200 }}
						>
							Приветствие
						</Button>
						
						<Button 
							variant="outlined" 
							color="secondary" 
							onClick={handleShowTime}
							sx={{ minWidth: 200 }}
						>
							Показать текущее время
						</Button>

						{timeString && (
						<Box 
							sx={{ 
							mt: 2, 
							p: 2, 
							backgroundColor: 'grey.50', 
							borderRadius: 1,
							textAlign: 'center'
							}}
						>
							<Typography variant="h6" color="primary">
								Текущее время:
							</Typography>
							<Typography variant="body1" id="datetime">
								{timeString}
							</Typography>
						</Box>
						)}
					</Box>
				</Card>
			</Container>
		</Box>
	);
};

export default Home;