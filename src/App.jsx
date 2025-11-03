import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from './components/layout/MainLayout'
import AdminLayout from './components/layout/AdminLayout'
import Home from './pages/public/Home'
import Hotels from './pages/public/Hotels'
import HotelDetails from './pages/public/HotelDetails'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import UsersManagement from './pages/admin/UsersManagement'
import HotelsManagement from './pages/admin/HotelsManagement'
import RoomsManagement from './pages/admin/RoomsManagement'
import TestConnection from "./components/TestConnection";

function App() {
	return (
		<Routes>
			{/* Public routes */}
			<Route path="/" element={<MainLayout />}>
				<Route index element={<Home />} />
				<Route path="hotels" element={<Hotels />} />
				<Route path="hotels/:id" element={<HotelDetails />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route path="test-connection" element={<TestConnection />} />
			</Route>

			{/* Admin routes */}
			<Route path="/admin" element={<AdminLayout />}>
				<Route index element={<AdminDashboard />} />
				<Route path="users" element={<UsersManagement />} />
				<Route path="hotels" element={<HotelsManagement />} />
				<Route path="rooms" element={<RoomsManagement />} />
			</Route>
		</Routes>
	);
}

export default App
