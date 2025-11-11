import React, { useState } from 'react';
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
	Box,
	TextField,
	Chip,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Switch,
	FormControlLabel,
} from '@mui/material';
import { Block, AdminPanelSettings, Person, Refresh } from '@mui/icons-material';
import { 
	useGetAllUsersQuery,
	useUpdateUserRoleMutation,
	useToggleUserStatusMutation 
} from '../../store/api/hotelApi';

const UsersManagement = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');
	const [selectedUser, setSelectedUser] = useState(null);
	const [roleDialogOpen, setRoleDialogOpen] = useState(false);

	const { 
		data: users = [], 
		isLoading, 
		error,
		refetch 
	} = useGetAllUsersQuery();

	const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
	const [toggleUserStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();

	const filteredUsers = users.filter(user => {
		const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
							user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
							user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
		
		const matchesRole = roleFilter === 'all' || user.role === roleFilter;
		
		return matchesSearch && matchesRole;
	});

	const handleRoleChange = (user) => {
		setSelectedUser(user);
		setRoleDialogOpen(true);
	};

	const handleRoleUpdate = async (newRole) => {
		try {
		await updateUserRole({ 
			userId: selectedUser.id, 
			role: newRole 
		}).unwrap();
		setRoleDialogOpen(false);
		setSelectedUser(null);
		} catch (error) {
		console.error('Failed to update user role:', error);
		}
	};

	const handleStatusToggle = async (user) => {
		try {
		await toggleUserStatus(user.id).unwrap();
		} catch (error) {
		console.error('Failed to toggle user status:', error);
		}
	};

	const getRoleColor = (role) => {
		switch (role) {
		case 'ADMIN': return 'primary';
		case 'USER': return 'default';
		default: return 'default';
		}
	};

	const getRoleIcon = (role) => {
		switch (role) {
		case 'ADMIN': return <AdminPanelSettings />;
		case 'USER': return <Person />;
		default: return <Person />;
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
		});
	};

	if (isLoading) {
		return (
		<Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
			<CircularProgress />
			<Typography variant="h6" sx={{ mt: 2 }}>
			Загрузка пользователей...
			</Typography>
		</Container>
		);
	}

	if (error) {
		return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Alert severity="error" sx={{ mb: 2 }}>
			Ошибка загрузки пользователей: {error.data?.message || 'Попробуйте позже'}
			</Alert>
			<Button variant="contained" onClick={refetch} startIcon={<Refresh />}>
			Попробовать снова
			</Button>
		</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
		<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
			<Typography variant="h4" component="h1">
			Управление пользователями
			</Typography>
			<Button 
			variant="outlined" 
			startIcon={<Refresh />}
			onClick={refetch}
			>
			Обновить
			</Button>
		</Box>

		{/* Фильтры */}
		<Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
			<TextField
			placeholder="Поиск по email, имени или фамилии..."
			value={searchTerm}
			onChange={(e) => setSearchTerm(e.target.value)}
			sx={{ minWidth: 300 }}
			/>
			<FormControl sx={{ minWidth: 150 }}>
			<InputLabel>Роль</InputLabel>
			<Select
				value={roleFilter}
				label="Роль"
				onChange={(e) => setRoleFilter(e.target.value)}
			>
				<MenuItem value="all">Все роли</MenuItem>
				<MenuItem value="USER">Пользователь</MenuItem>
				<MenuItem value="ADMIN">Администратор</MenuItem>
			</Select>
			</FormControl>
		</Box>

		{/* Статистика */}
		<Box sx={{ mb: 2 }}>
			<Typography variant="body2" color="text.secondary">
			Всего пользователей: {users.length} | 
			Администраторов: {users.filter(u => u.role === 'ADMIN').length} | 
			Пользователей: {users.filter(u => u.role === 'USER').length} |
			Отфильтровано: {filteredUsers.length}
			</Typography>
		</Box>

		<TableContainer component={Paper}>
			<Table>
			<TableHead>
				<TableRow>
				<TableCell>ID</TableCell>
				<TableCell>Email</TableCell>
				<TableCell>Имя</TableCell>
				<TableCell>Фамилия</TableCell>
				<TableCell>Телефон</TableCell>
				<TableCell>Роль</TableCell>
				<TableCell>Дата регистрации</TableCell>
				<TableCell align="center">Действия</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{filteredUsers.map((user) => (
				<TableRow key={user.id} hover>
					<TableCell>{user.id}</TableCell>
					<TableCell>
					<Typography variant="body2" fontWeight="medium">
						{user.email}
					</Typography>
					</TableCell>
					<TableCell>{user.firstName || '-'}</TableCell>
					<TableCell>{user.lastName || '-'}</TableCell>
					<TableCell>{user.phone || '-'}</TableCell>
					<TableCell>
					<Chip
						icon={getRoleIcon(user.role)}
						label={user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
						color={getRoleColor(user.role)}
						size="small"
					/>
					</TableCell>
					<TableCell>
					<Typography variant="body2">
						{formatDate(user.createdAt)}
					</Typography>
					</TableCell>
					<TableCell align="center">
					<IconButton 
						color="primary" 
						size="small"
						onClick={() => handleRoleChange(user)}
						title="Изменить роль"
						disabled={isUpdatingRole}
					>
						<AdminPanelSettings />
					</IconButton>
					</TableCell>
				</TableRow>
				))}
			</TableBody>
			</Table>
		</TableContainer>

		{/* Диалог изменения роли */}
		<Dialog
			open={roleDialogOpen}
			onClose={() => setRoleDialogOpen(false)}
		>
			<DialogTitle>Изменение роли пользователя</DialogTitle>
			<DialogContent>
			<Typography>
				Выберите новую роль для пользователя <strong>{selectedUser?.email}</strong>:
			</Typography>
			<FormControl fullWidth sx={{ mt: 2 }}>
				<InputLabel>Роль</InputLabel>
				<Select
				defaultValue={selectedUser?.role || 'USER'}
				label="Роль"
				>
				<MenuItem value="USER">Пользователь</MenuItem>
				<MenuItem value="ADMIN">Администратор</MenuItem>
				</Select>
			</FormControl>
			</DialogContent>
			<DialogActions>
			<Button onClick={() => setRoleDialogOpen(false)}>
				Отмена
			</Button>
			<Button 
				onClick={() => handleRoleUpdate(selectedUser?.role === 'ADMIN' ? 'USER' : 'ADMIN')}
				variant="contained"
				disabled={isUpdatingRole}
			>
				{isUpdatingRole ? 'Обновление...' : 'Изменить роль'}
			</Button>
			</DialogActions>
		</Dialog>

		{/* Состояние пустого списка */}
		{filteredUsers.length === 0 && !isLoading && (
			<Box sx={{ textAlign: 'center', py: 4 }}>
			<Typography variant="h6" color="text.secondary">
				{searchTerm || roleFilter !== 'all' ? 'Пользователи не найдены' : 'Нет пользователей'}
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
				{searchTerm || roleFilter !== 'all' 
				? 'Попробуйте изменить параметры поиска' 
				: 'В системе пока нет зарегистрированных пользователей'
				}
			</Typography>
			</Box>
		)}
		</Container>
	);
};

export default UsersManagement;