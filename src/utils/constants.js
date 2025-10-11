export const USER_ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN'
}

export const ROOM_TYPES = {
    STANDARD: 'STANDARD',
    DELUXE: 'DELUZE',
    SUITE: 'SUITE',
    PRESIDENTAL: 'PRESIDENTAL'
}

export const ROOM_TYPE_LABELS = {
    [ROOM_TYPES.STANDARD]: 'Стандартный',
    [ROOM_TYPES.DELUXE]: 'Делюкс',
    [ROOM_TYPES.SUITE]: 'Люкс',
    [ROOM_TYPES.PRESIDENTAL]: 'Президентский'
}

export const BOOKING_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELED: 'CANCELED',
    COMPLETED: 'COMPLETED'
}