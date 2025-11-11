import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = 'http://localhost:8080/api';

export const hotelApi = createApi({
	reducerPath: 'hotelApi',
	baseQuery: fetchBaseQuery({
		baseUrl: API_BASE_URL,
		prepareHeaders: (headers, { getState }) => {
			const token = getState().auth.token;
			if (token) {
				headers.set('authorization', `Bearer ${token}`);
			}
			headers.set('Content-Type', 'application/json');
			return headers;
		},
	}),
	tagTypes: ['Hotels', 'Rooms', 'Bookings', 'Users'], // Добавили 'Users'
	endpoints: (builder) => ({
		// ОТЕЛИ
		getHotels: builder.query({
			query: () => '/hotels',
			providesTags: ['Hotels'],
		}),
		getHotelById: builder.query({
			query: (id) => `/hotels/${id}`,
			providesTags: (result, error, id) => [{ type: 'Hotels', id }],
		}),
		getHotelsByCity: builder.query({
			query: (city) => `/hotels/city/${city}`,
			providesTags: ['Hotels'],
		}),
		createHotel: builder.mutation({
			query: (hotelData) => ({
				url: '/hotels',
				method: 'POST',
				body: hotelData,
			}),
			invalidatesTags: ['Hotels'],
		}),
		updateHotel: builder.mutation({
			query: ({ id, ...hotelData }) => ({
				url: `/hotels/${id}`,
				method: 'PUT',
				body: hotelData,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Hotels', id }],
		}),
		deleteHotel: builder.mutation({
			query: (id) => ({
				url: `/hotels/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Hotels'],
		}),

		// КОМНАТЫ - ДЛЯ ОБЫЧНЫХ ПОЛЬЗОВАТЕЛЕЙ (только доступные)
		getRooms: builder.query({
			query: () => '/rooms',
			providesTags: ['Rooms'],
		}),
		getRoomById: builder.query({
			query: (id) => `/rooms/${id}`,
			providesTags: (result, error, id) => [{ type: 'Rooms', id }],
		}),
		getRoomsByHotel: builder.query({
			query: (hotelId) => `/rooms/hotel/${hotelId}`,
			providesTags: ['Rooms'],
		}),
		getRoomsByCity: builder.query({
			query: (city) => `/rooms/city/${city}`,
			providesTags: ['Rooms'],
		}),

		// КОМНАТЫ - ДЛЯ АДМИНИСТРАТОРОВ (все номера, включая недоступные)
		getAllRoomsForAdmin: builder.query({
			query: () => '/rooms/admin/all',
			providesTags: ['Rooms'],
		}),
		getRoomsByHotelForAdmin: builder.query({
			query: (hotelId) => `/rooms/admin/hotel/${hotelId}`,
			providesTags: ['Rooms'],
		}),

		// ОБЩИЕ ОПЕРАЦИИ С КОМНАТАМИ
		createRoom: builder.mutation({
			query: (roomData) => ({
				url: '/rooms',
				method: 'POST',
				body: roomData,
			}),
			invalidatesTags: ['Rooms'],
		}),
		updateRoomAvailability: builder.mutation({
			query: ({ id, available }) => ({
				url: `/rooms/${id}/availability`,
				method: 'PATCH',
				params: { available },
			}),
			invalidatesTags: ['Rooms'],
		}),
		updateRoom: builder.mutation({
			query: ({ id, ...roomData }) => ({
				url: `/rooms/${id}`,
				method: 'PUT',
				body: roomData,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Rooms', id }],
		}),
		deleteRoom: builder.mutation({
			query: (id) => ({
				url: `/rooms/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Rooms'],
		}),

		// БРОНИРОВАНИЯ
		getBookings: builder.query({
			query: () => '/bookings/my',
			providesTags: ['Bookings'],
		}),
		getActiveBookings: builder.query({
			query: () => '/bookings/my/active',
			providesTags: ['Bookings'],
		}),
		getBookingById: builder.query({
			query: (id) => `/bookings/${id}`,
			providesTags: (result, error, id) => [{ type: 'Bookings', id }],
		}),
		createBooking: builder.mutation({
			query: (bookingData) => ({
				url: '/bookings',
				method: 'POST',
				body: bookingData,
			}),
			invalidatesTags: ['Bookings'],
		}),
		cancelBooking: builder.mutation({
			query: (id) => ({
				url: `/bookings/${id}/cancel`,
				method: 'POST',
			}),
			invalidatesTags: ['Bookings'],
		}),

		// АДМИНИСТРАТИВНЫЕ ФУНКЦИИ
		getHotelBookings: builder.query({
			query: (hotelId) => `/bookings/hotel/${hotelId}`,
			providesTags: ['Bookings'],
		}),
		getBookingsByStatus: builder.query({
			query: (status) => `/bookings/status/${status}`,
			providesTags: ['Bookings'],
		}),
		updateBookingStatus: builder.mutation({
			query: ({ id, status }) => ({
				url: `/bookings/${id}/status`,
				method: 'PATCH',
				params: { status },
			}),
			invalidatesTags: ['Bookings'],
		}),

		// УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ (НОВОЕ)
		getAllUsers: builder.query({
			query: () => '/admin/users',
			providesTags: ['Users'],
		}),
		updateUserRole: builder.mutation({
			query: ({ userId, role }) => ({
				url: `/admin/users/${userId}/role`,
				method: 'PATCH',
				params: { role },
			}),
			invalidatesTags: ['Users'],
		}),
		toggleUserStatus: builder.mutation({
			query: (userId) => ({
				url: `/admin/users/${userId}/toggle-status`,
				method: 'PATCH',
			}),
			invalidatesTags: ['Users'],
		}),
	})
});

export const {
	// Отели
	useGetHotelsQuery,
	useGetHotelByIdQuery,
	useGetHotelsByCityQuery,
	useCreateHotelMutation,
	useUpdateHotelMutation,
	useDeleteHotelMutation,

	// Комнаты - для обычных пользователей
	useGetRoomsQuery,
	useGetRoomByIdQuery,
	useGetRoomsByHotelQuery,
	useGetRoomsByCityQuery,

	// Комнаты - для администраторов
	useGetAllRoomsForAdminQuery,
	useGetRoomsByHotelForAdminQuery,

	// Общие операции с комнатами
	useCreateRoomMutation,
	useUpdateRoomMutation,
	useUpdateRoomAvailabilityMutation,
	useDeleteRoomMutation,
	
	// Бронирования
	useGetBookingsQuery,
	useGetActiveBookingsQuery,
	useGetBookingByIdQuery,
	useCreateBookingMutation,
	useCancelBookingMutation,
	
	// Административные - бронирования
	useGetHotelBookingsQuery,
	useGetBookingsByStatusQuery,
	useUpdateBookingStatusMutation,

	// Административные - пользователи (НОВОЕ)
	useGetAllUsersQuery,
	useUpdateUserRoleMutation,
	useToggleUserStatusMutation,
} = hotelApi;