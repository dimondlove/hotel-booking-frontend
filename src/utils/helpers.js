export const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
    }).format(price)
}

export const formatDate = (date) => {
    return new Intl.DateTimeFormat('ru-RU').format(new Date(date))
}

export const calculateTotalNights = (checkIn, checkOut) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const timeDiff = end.getTime() - start.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

export const validateDates = (checkIn, checkOut) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const start = new Date(checkIn)
    const end = new Date(checkOut)

    if (start < today) {
        return 'Дата заезда не может быть в прошлом'
    }

    if (end <= start) {
        return 'Дата выезда не может быть перед датой заезда'
    }

    return null
}