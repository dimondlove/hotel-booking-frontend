import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
	Container,
	Paper,
	TextField,
	Button,
	Typography,
	Box,
	Alert,
	CircularProgress,
} from '@mui/material';
import { useRegisterMutation } from '../../store/api/authApi';

const Register = () => {
	const navigate = useNavigate();
	const [register, { isLoading: registerLoading, error: registerError }] = useRegisterMutation();

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		password: '',
		confirmPassword: '',
	});

	const [errors, setErrors] = useState({});
	const [localError, setLocalError] = useState('');

	useEffect(() => {
        if (localError || registerError) {
            setLocalError('');
            setErrors({});
        }
    }, [formData.firstName, formData.lastName, formData.email, formData.password, formData.confirmPassword]);

	const validateForm = () => {
        const newErrors = {};

        // Валидация имени
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Имя обязательно';
        } else if (!/^[A-ZА-Я][a-zа-я]*$/.test(formData.firstName)) {
            newErrors.firstName = 'Имя должно начинаться с заглавной буквы и содержать только буквы';
        }

        // Валидация фамилии
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Фамилия обязательна';
        } else if (!/^[A-ZА-Я][a-zа-я]*$/.test(formData.lastName)) {
            newErrors.lastName = 'Фамилия должна начинаться с заглавной буквы и содержать только буквы';
        }

        // Валидация email
        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        // Валидация пароля
        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = 'Пароль должен содержать хотя бы одну заглавную букву';
        }

        // Валидация подтверждения пароля
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Подтвердите пароль';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        // Валидация телефона (необязательное поле, но если заполнено - проверяем формат)
        if (formData.phone && !/^\+?[0-9\s\-\(\)]{10,20}$/.test(formData.phone)) {
            newErrors.phone = 'Введите корректный номер телефона';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

	const handleChange = (e) => {
        const { name, value } = e.target;
        
        let processedValue = value;
        if ((name === 'firstName' || name === 'lastName') && value.length === 1) {
            processedValue = value.toUpperCase();
        }
        
        setFormData({
            ...formData,
            [name]: processedValue,
        });

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

	const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!validateForm()) {
            return;
        }

        try {
            const { confirmPassword, ...registerData } = formData;
            
            const result = await register(registerData).unwrap();
            
            navigate('/');
            
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.data?.message) {
                setLocalError(error.data.message);
            } else if (error.status === 400) {
                setLocalError('Пользователь с таким email уже существует');
            } else if (error.status === 500) {
                setLocalError('Ошибка сервера. Попробуйте позже.');
            } else {
                setLocalError('Произошла ошибка при регистрации');
            }
        }
    };

	const displayError = localError || (registerError?.data?.message || '');

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

					{displayError && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{displayError}
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
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            placeholder="Иван"
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
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            placeholder="Петров"
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
                            error={!!errors.email}
                            helperText={errors.email}
                            placeholder="example@mail.com"
						/>
						<TextField
							margin="normal"
                            fullWidth
                            id="phone"
                            label="Телефон"
                            name="phone"
                            autoComplete="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone || 'Необязательное поле'}
                            placeholder="+79991234567"
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
                            error={!!errors.password}
                            helperText={errors.password || 'Минимум 6 символов, хотя бы одна заглавная буква'}
                            placeholder="Пароль123"
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
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={registerLoading}
						>
							{registerLoading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
						</Button>
						<Box sx={{ textAlign: 'center' }}>
							<Link to="/login" style={{ textDecoration: 'none' }}>
								<Typography variant="body2" color="primary">
									Уже есть аккаунт? Войти
								</Typography>
							</Link>
						</Box>

						{/* Информация о валидации */}
                        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Требования к регистрации:
                            </Typography>
                            <Typography variant="caption" display="block">
                                • Имя и фамилия должны начинаться с заглавной буквы
                            </Typography>
                            <Typography variant="caption" display="block">
                                • Пароль: минимум 6 символов, 1 заглавная буква
                            </Typography>
                            <Typography variant="caption" display="block">
                                • Email должен быть валидным
                            </Typography>
                        </Box>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

export default Register;