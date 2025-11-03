import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, clearError } from '../store/slices/authSlice';
import { setCurrentBooking, clearCurrentBooking } from '../store/slices/bookingSlice';
import { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery } from '../store/api/authApi';
import { useGetHotelsQuery, useGetRoomsByHotelQuery } from '../store/api/hotelApi';
import { useGetUserBookingsQuery, useCreateBookingMutation, useCancelBookingMutation } from '../store/api/bookingApi';

const TestConnection = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, error: authError } = useSelector(state => state.auth);
  const { currentBooking, loading: bookingLoading, error: bookingError } = useSelector(state => state.booking);
  
  // Auth API
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const { data: currentUser, refetch: refetchCurrentUser } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });
  
  // Hotel API
  const { data: hotels, isLoading: hotelsLoading, error: hotelsError } = useGetHotelsQuery();
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const { data: rooms, isLoading: roomsLoading } = useGetRoomsByHotelQuery(selectedHotelId, {
    skip: !selectedHotelId,
  });
  
  // Booking API
  const { data: userBookings, isLoading: bookingsLoading, refetch: refetchBookings } = useGetUserBookingsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createBooking, { isLoading: creatingBooking }] = useCreateBookingMutation();
  const [cancelBooking, { isLoading: cancellingBooking }] = useCancelBookingMutation();
  
  // Form states
  const [loginData, setLoginData] = useState({
    email: 'user@example.com',
    password: 'User123'
  });
  
  const [registerData, setRegisterData] = useState({
    firstName: 'Тест',
    lastName: 'Пользователь',
    email: 'test@example.com',
    password: 'Test123',
    phone: '+79991234567'
  });

  const [bookingData, setBookingData] = useState({
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 2,
    specialRequests: ''
  });

  const handleLogin = async () => {
    try {
      await login(loginData).unwrap();
      dispatch(clearError());
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await register(registerData).unwrap();
      dispatch(clearError());
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCurrentBooking());
    setSelectedHotelId('');
    setBookingData({
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      guests: 2,
      specialRequests: ''
    });
  };

  const handleCreateBooking = async () => {
    try {
      const result = await createBooking(bookingData).unwrap();
      dispatch(setCurrentBooking(result));
      refetchBookings(); // Обновляем список бронирований
      
      // Сбрасываем форму
      setBookingData({
        roomId: '',
        checkInDate: '',
        checkOutDate: '',
        guests: 2,
        specialRequests: ''
      });
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId).unwrap();
      dispatch(clearCurrentBooking());
      refetchBookings(); // Обновляем список бронирований
    } catch (error) {
      console.error('Cancel booking failed:', error);
    }
  };

  const handleHotelChange = (hotelId) => {
    setSelectedHotelId(hotelId);
    setBookingData(prev => ({ ...prev, roomId: '' }));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🔧 Тест подключения к бэкенду (RTK Query)</h2>
      
      {/* Секция аутентификации */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>🔐 Аутентификация</h3>
        
        {isAuthenticated ? (
          <div>
            <div style={{ color: 'green', marginBottom: '10px' }}>
              ✅ Вы вошли как: {user?.firstName} {user?.lastName} ({user?.email})
              <br />
              Роль: {user?.role}
            </div>
            <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}>
              Выйти
            </button>
            <button onClick={refetchCurrentUser} style={{ marginLeft: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
              Обновить данные
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h4>Вход:</h4>
              <div style={{ marginBottom: '10px' }}>
                <input 
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  placeholder="Email"
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <input 
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Пароль"
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <button 
                onClick={handleLogin} 
                disabled={loginLoading}
                style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                {loginLoading ? 'Вход...' : 'Войти'}
              </button>
            </div>

            <div style={{ flex: 1, minWidth: '300px' }}>
              <h4>Регистрация:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <input 
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                  placeholder="Имя"
                  style={{ padding: '8px' }}
                />
                <input 
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                  placeholder="Фамилия"
                  style={{ padding: '8px' }}
                />
                <input 
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  placeholder="Email"
                  style={{ padding: '8px', gridColumn: 'span 2' }}
                />
                <input 
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  placeholder="Пароль"
                  style={{ padding: '8px' }}
                />
                <input 
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                  placeholder="Телефон"
                  style={{ padding: '8px' }}
                />
              </div>
              <button 
                onClick={handleRegister} 
                disabled={registerLoading}
                style={{ width: '100%', padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                {registerLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </div>
          </div>
        )}

        {authError && (
          <div style={{ color: 'red', marginTop: '10px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
            ❌ Ошибка аутентификации: {authError}
          </div>
        )}
      </div>

      {/* Секция отелей */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>🏨 Отели и комнаты</h3>
        
        {hotelsLoading && <div>⏳ Загрузка отелей...</div>}
        
        {hotelsError && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            ❌ Ошибка загрузки отелей: {hotelsError?.data?.message || hotelsError?.status}
          </div>
        )}

        {hotels && (
          <div>
            <div style={{ color: 'green', marginBottom: '15px' }}>
              ✅ Успешно загружено отелей: {hotels.length}
            </div>
            
            <select 
              value={selectedHotelId} 
              onChange={(e) => handleHotelChange(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
            >
              <option value="">Выберите отель</option>
              {hotels.map(hotel => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name} - {hotel.city} ({hotel.rating}⭐)
                </option>
              ))}
            </select>

            {selectedHotelId && rooms && (
              <div>
                <h4>Комнаты в выбранном отеле:</h4>
                {roomsLoading ? (
                  <div>⏳ Загрузка комнат...</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                    {rooms.map(room => (
                      <div key={room.id} style={{ 
                        border: '1px solid #ddd', 
                        padding: '15px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '5px'
                      }}>
                        <strong>{room.name}</strong> - {room.roomType}
                        <br />
                        💰 {room.pricePerNight} руб./ночь
                        <br />
                        👥 Вместимость: {room.capacity} чел.
                        <br />
                        {room.available ? '✅ Доступно' : '❌ Занято'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Секция бронирований */}
      {isAuthenticated && (
        <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>📅 Бронирования</h3>
          
          {/* Форма создания бронирования */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
            <h4>Создать бронирование:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
              <select 
                value={bookingData.roomId}
                onChange={(e) => setBookingData({...bookingData, roomId: e.target.value})}
                style={{ padding: '8px' }}
              >
                <option value="">Выберите комнату</option>
                {rooms?.map(room => (
                  <option key={room.id} value={room.id} disabled={!room.available}>
                    {room.name} - {room.pricePerNight} руб.
                  </option>
                ))}
              </select>
              <input 
                type="date"
                value={bookingData.checkInDate}
                onChange={(e) => setBookingData({...bookingData, checkInDate: e.target.value})}
                placeholder="Дата заезда"
                style={{ padding: '8px' }}
              />
              <input 
                type="date"
                value={bookingData.checkOutDate}
                onChange={(e) => setBookingData({...bookingData, checkOutDate: e.target.value})}
                placeholder="Дата выезда"
                style={{ padding: '8px' }}
              />
              <input 
                type="number"
                value={bookingData.guests}
                onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                placeholder="Количество гостей"
                min="1"
                style={{ padding: '8px' }}
              />
            </div>
            <textarea 
              value={bookingData.specialRequests}
              onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
              placeholder="Особые пожелания"
              style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '60px' }}
            />
            <button 
              onClick={handleCreateBooking} 
              disabled={creatingBooking || !bookingData.roomId || !bookingData.checkInDate || !bookingData.checkOutDate}
              style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              {creatingBooking ? 'Создание...' : 'Забронировать'}
            </button>
          </div>

          {/* Текущее бронирование */}
          {currentBooking && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e6ffe6', borderRadius: '5px' }}>
              <h4>✅ Текущее бронирование:</h4>
              <div>Отель: {currentBooking.hotelName}</div>
              <div>Комната: {currentBooking.roomName}</div>
              <div>Даты: {currentBooking.checkInDate} - {currentBooking.checkOutDate}</div>
              <div>Стоимость: {currentBooking.totalPrice} руб.</div>
              <div>Статус: {currentBooking.status}</div>
            </div>
          )}

          {/* Список бронирований пользователя */}
          {bookingsLoading ? (
            <div>⏳ Загрузка бронирований...</div>
          ) : userBookings && (
            <div>
              <h4>📋 Ваши бронирования ({userBookings.length}):</h4>
              <button onClick={refetchBookings} style={{ marginBottom: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                Обновить список
              </button>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {userBookings.map(booking => (
                  <div key={booking.id} style={{ 
                    border: '1px solid #ddd', 
                    margin: '5px 0', 
                    padding: '10px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '5px'
                  }}>
                    <strong>{booking.hotelName}</strong> - {booking.roomName}
                    <br />
                    📅 {booking.checkInDate} → {booking.checkOutDate}
                    <br />
                    💰 {booking.totalPrice} руб. | 👥 {booking.guests} гостей
                    <br />
                    Статус: 
                    <span style={{ 
                      color: booking.status === 'CONFIRMED' ? 'green' : 
                             booking.status === 'CANCELLED' ? 'red' : 'orange',
                      fontWeight: 'bold',
                      marginLeft: '5px'
                    }}>
                      {booking.status}
                    </span>
                    <br />
                    {booking.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingBooking}
                        style={{ marginTop: '5px', padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}
                      >
                        {cancellingBooking ? 'Отмена...' : 'Отменить'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {bookingError && (
            <div style={{ color: 'red', marginTop: '10px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
              ❌ Ошибка бронирования: {bookingError}
            </div>
          )}
        </div>
      )}

      {/* Информация о состоянии */}
      <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>📊 Состояние системы</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <div>Аутентифицирован: {isAuthenticated ? '✅ Да' : '❌ Нет'}</div>
          <div>Токен в localStorage: {localStorage.getItem('token') ? '✅ Есть' : '❌ Нет'}</div>
          <div>Пользователь в localStorage: {localStorage.getItem('user') ? '✅ Есть' : '❌ Нет'}</div>
          <div>Текущее бронирование: {currentBooking ? '✅ Есть' : '❌ Нет'}</div>
        </div>
      </div>
    </div>
  );
};

export default TestConnection;