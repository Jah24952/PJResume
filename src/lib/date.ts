export function formatDate(dateStr: string, lang: 'th' | 'en' = 'en'): string {
    if (!dateStr) return ''

    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr

    const thMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]

    const enMonths = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    if (lang === 'th') {
        return `${day} ${thMonths[month]} ${year + 543}`
    }

    return `${enMonths[month]} ${year}`
}

export function formatMonthYear(dateStr: string, lang: 'th' | 'en' = 'en'): string {
    if (!dateStr) return ''

    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr

    const thMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ]

    const enMonths = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    const month = date.getMonth()
    const year = date.getFullYear()

    if (lang === 'th') {
        return `${thMonths[month]} ${year + 543}`
    }

    return `${enMonths[month]} ${year}`
}
