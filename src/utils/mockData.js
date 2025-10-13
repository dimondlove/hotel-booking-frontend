export const mockUsers = [
	{
		id: 1,
		email: 'admin@hotel.com',
		password: 'admin123',
		firstName: 'Администратор',
		lastName: 'Системы',
		role: 'ADMIN',
		phone: '+7 (999) 123-45-67'
	},
	{
		id: 2,
		email: 'user@example.com',
		password: 'user123',
		firstName: 'Иван',
		lastName: 'Петров',
		role: 'USER',
		phone: '+7 (999) 987-65-43'
	}
]

export const mockHotels = [
	{
		id: 1,
		name: 'Гранд Отель Европа',
		description: 'Роскошный 5-звездочный отель в центре города с видом на исторический центр.',
		address: 'ул. Тверская, д. 10, Москва',
		phone: '+7 (495) 123-45-67',
		email: 'info@grandhotel.ru',
		amenities: ['Wi-Fi', 'Бассейн', 'СПА', 'Ресторан', 'Парковка', 'Фитнес-центр'],
		images: ['/mock-images/hotel1-1.jpg', '/mock-images/hotel1-2.jpg'],
		rating: 4.8
	},
	{
		id: 2,
		name: 'Бутик Отель Нева',
		description: 'Уютный бутик-отель на берегу реки с современным дизайном и прекрасным сервисом.',
		address: 'наб. реки Мойки, д. 25, Санкт-Петербург',
		phone: '+7 (812) 234-56-78',
		email: 'booking@nevahotel.ru',
		amenities: ['Wi-Fi', 'Ресторан', 'Бар', 'Трансфер'],
		images: ['/mock-images/hotel2-1.jpg', '/mock-images/hotel2-2.jpg'],
		rating: 4.5
	},
	{
		id: 3,
		name: 'Горный Курорт Алтай',
		description: 'Эко-отель в горах Алтая с собственным спа-комплексом и рестораном национальной кухни.',
		address: 'с. Чемал, Республика Алтай',
		phone: '+7 (388) 345-67-89',
		email: 'resort@altay.ru',
		amenities: ['Wi-Fi', 'СПА', 'Ресторан', 'Экскурсии', 'Прокат снаряжения'],
		images: ['/mock-images/hotel3-1.jpg', '/mock-images/hotel3-2.jpg'],
		rating: 4.9
	}
]

export const mockRooms = [
	{
		id: 1,
		hotelId: 1,
		roomNumber: '101',
		type: 'STANDARD',
		price: 4500,
		capacity: 2,
		amenities: ['Кондиционер', 'Телевизор', 'Сейф', 'Wi-Fi'],
		images: ['/mock-images/room1-1.jpg'],
		available: true
	},
	{
		id: 2,
		hotelId: 1,
		roomNumber: '201',
		type: 'DELUXE',
		price: 7500,
		capacity: 3,
		amenities: ['Кондиционер', 'Телевизор', 'Сейф', 'Wi-Fi', 'Мини-бар', 'Ванная'],
		images: ['/mock-images/room2-1.jpg'],
		available: true
	},
	{
		id: 3,
		hotelId: 2,
		roomNumber: '301',
		type: 'SUITE',
		price: 12000,
		capacity: 4,
		amenities: ['Кондиционер', 'Телевизор', 'Сейф', 'Wi-Fi', 'Мини-бар', 'Гостиная', 'Ванная'],
		images: ['/mock-images/room3-1.jpg'],
		available: true
	}
]

export const mockBookings = [
	{
		id: 1,
		userId: 2,
		roomId: 1,
		checkIn: '2024-02-15',
		checkOut: '2024-02-20',
		guests: 2,
		totalPrice: 22500,
		status: 'CONFIRMED',
		createdAt: '2024-01-10T10:00:00Z'
	}
]