import React from "react";
import {
	Container,
	Typography,
	Button,
	Box,
	Grid,
	Card,
	CardContent,
} from '@mui/material';
import { Link } from "react-router-dom";
import { LocationOn, Star, Wifi } from '@mui/icons-material';

const Home = () => {
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
						<Card sx={{textAlign: 'center', p: 2}}>
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
		</Box>
	);
};

export default Home;