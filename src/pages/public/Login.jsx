import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import { useLoginMutation } from '../../store/api/authApi';
import { clearError } from '../../store/slices/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading: loginLoading, error: loginError }] = useLoginMutation();
    const { user, isAuthenticated  } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (localError || loginError) {
            setLocalError('');
        }
    }, [formData.email, formData.password]);

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(user.role === 'ADMIN' ? '/admin' : '/');
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setLocalError('Заполните все поля');
            return;
        }

        try {
            const result = await login(formData).unwrap();
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.data?.message) {
                setLocalError(error.data.message);
            } else if (error.status === 401) {
                setLocalError('Неверный email или пароль');
            } else if (error.status === 500) {
                setLocalError('Ошибка сервера. Попробуйте позже.');
            } else {
                setLocalError('Произошла ошибка при входе');
            }
        }
    };

    const displayError = localError || (loginError?.data?.message || '');

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        Вход в систему
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
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                            error={!!displayError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!displayError}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loginLoading}
                        >
                            {loginLoading ? <CircularProgress size={24} /> : 'Войти'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                <Typography variant="body2" color="primary">
                                    Нет аккаунта? Зарегистрироваться
                                </Typography>
                            </Link>
                        </Box>

                        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Тестовые данные:
                            </Typography>
                            <Typography variant="caption" display="block" align="center">
                                userd@example.com / User123
                            </Typography>
                            <Typography variant="caption" display="block" align="center">
                                admin@hotel.com / Admin123
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;