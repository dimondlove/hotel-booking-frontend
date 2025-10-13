import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
	Container,
	Paper,
	TextField,
	Button,
	Typography,
	Box,
	Alert,
} from '@mui/material';

const Register = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		password: '',
		confirmPassword: '',
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		if (formData.password !== formData.confirmPassword) {
			setError('Пароли не совпадают');
			setLoading(false);
			return;
		}

		// Имитация регистрации
		setTimeout(() => {
			console.log('Регистрация:', formData);
			setLoading(false);
			alert('Регистрация успешна! Теперь вы можете войти в систему.');
			navigate('/login');
		}, 1000);
	};

	return (
		<Container maxWidth="sm">
			<Box
				sx={{
					marginTop: 4,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
					<Typography component="h1" variant="h4" align="center" gutterBottom>
						Регистрация
					</Typography>

					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="firstName"
							label="Имя"
							name="firstName"
							autoComplete="given-name"
							value={formData.firstName}
							onChange={handleChange}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="lastName"
							label="Фамилия"
							name="lastName"
							autoComplete="family-name"
							value={formData.lastName}
							onChange={handleChange}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email"
							name="email"
							autoComplete="email"
							value={formData.email}
							onChange={handleChange}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="phone"
							label="Телефон"
							name="phone"
							autoComplete="tel"
							value={formData.phone}
							onChange={handleChange}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Пароль"
							type="password"
							id="password"
							autoComplete="new-password"
							value={formData.password}
							onChange={handleChange}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="confirmPassword"
							label="Подтвердите пароль"
							type="password"
							id="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}
						>
							{loading ? 'Регистрация...' : 'Зарегистрироваться'}
						</Button>
						<Box sx={{ textAlign: 'center' }}>
							<Link to="/login" style={{ textDecoration: 'none' }}>
								<Typography variant="body2" color="primary">
									Уже есть аккаунт? Войти
								</Typography>
							</Link>
						</Box>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

export default Register;