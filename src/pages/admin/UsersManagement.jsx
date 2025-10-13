import React, { useState, useEffect } from 'react';
import {
	Container,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	IconButton,
	Chip,
	Box,
	TextField,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { mockUsers } from '../../utils/mockData';
import { USER_ROLES } from '../../utils/constants';

const UsersManagement = () => {
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		// Имитация загрузки пользователей
		setUsers(mockUsers);
	}, []);

	const handleDeleteUser = (userId) => {
		if (window.confirm('Вы уверены, что хотите удалить пользователя?')) {
			setUsers(users.filter(user => user.id !== userId));
		}
	};

	const filteredUsers = users.filter(user =>
		user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const getRoleColor = (role) => {
		return role === USER_ROLES.ADMIN ? 'error' : 'primary';
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
				<Typography variant="h4" component="h1">
					Управление пользователями
				</Typography>
				<Button variant="contained" startIcon={<Add />}>
				Добавить пользователя
				</Button>
			</Box>

			{/* Поиск */}
			<TextField
				fullWidth
				placeholder="Поиск пользователей..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				sx={{ mb: 3 }}
			/>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Имя и фамилия</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Телефон</TableCell>
							<TableCell>Роль</TableCell>
							<TableCell align="center">Действия</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredUsers.map((user) => (
							<TableRow key={user.id}>
								<TableCell>{user.id}</TableCell>
								<TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.phone}</TableCell>
								<TableCell>
									<Chip
										label={user.role === USER_ROLES.ADMIN ? 'Администратор' : 'Пользователь'} 
										color={getRoleColor(user.role)}
										size="small"
									/>
								</TableCell>
								<TableCell align="center">
									<IconButton color="primary" size="small">
										<Edit />
									</IconButton>
									<IconButton
										color="error"
										size="small"
										onClick={() => handleDeleteUser(user.id)}
									>
										<Delete />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
};

export default UsersManagement;