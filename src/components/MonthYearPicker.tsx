'use client'

import { useMemo } from 'react'
import { CalendarDays } from 'lucide-react'

const MONTHS_TH = [
    { value: '01', label: 'ม.ค.' },
    { value: '02', label: 'ก.พ.' },
    { value: '03', label: 'มี.ค.' },
    { value: '04', label: 'เม.ย.' },
    { value: '05', label: 'พ.ค.' },
    { value: '06', label: 'มิ.ย.' },
    { value: '07', label: 'ก.ค.' },
    { value: '08', label: 'ส.ค.' },
    { value: '09', label: 'ก.ย.' },
    { value: '10', label: 'ต.ค.' },
    { value: '11', label: 'พ.ย.' },
    { value: '12', label: 'ธ.ค.' },
]

const MONTHS_EN = [
    { value: '01', label: 'Jan' },
    { value: '02', label: 'Feb' },
    { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' },
    { value: '05', label: 'May' },
    { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' },
    { value: '08', label: 'Aug' },
    { value: '09', label: 'Sep' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' },
]

interface MonthYearPickerProps {
    value: string           // "YYYY-MM" format
    onChange: (value: string) => void
    label?: string
    lang?: 'th' | 'en'
    className?: string
}

export default function MonthYearPicker({ value, onChange, label, lang = 'th', className = '' }: MonthYearPickerProps) {
    // Parse current value
    const [currentYear, currentMonth] = useMemo(() => {
        if (!value) return ['', '']
        const parts = value.split('-')
        return [parts[0] || '', parts[1] || '']
    }, [value])

    // Generate year options: 50 years back, 5 years forward
    const years = useMemo(() => {
        const now = new Date().getFullYear()
        const result: number[] = []
        for (let y = now + 5; y >= now - 50; y--) {
            result.push(y)
        }
        return result
    }, [])

    const months = lang === 'th' ? MONTHS_TH : MONTHS_EN

    const handleMonthChange = (month: string) => {
        if (currentYear && month) {
            onChange(`${currentYear}-${month}`)
        } else if (month) {
            // If no year selected yet, auto-select current year
            onChange(`${new Date().getFullYear()}-${month}`)
        }
    }

    const handleYearChange = (year: string) => {
        if (year && currentMonth) {
            onChange(`${year}-${currentMonth}`)
        } else if (year) {
            // If no month selected yet, auto-select January
            onChange(`${year}-01`)
        }
    }

    return (
        <div className={`${className}`}>
            {label && (
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">{label}</label>
            )}
            <div className="flex gap-2 items-center">
                {/* Month Dropdown */}
                <div className="relative flex-1">
                    <select
                        value={currentMonth}
                        onChange={e => handleMonthChange(e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 text-sm font-medium
                                   hover:border-[#437393]/50 focus:bg-white focus:border-[#437393] focus:ring-2 focus:ring-[#437393]/20 
                                   outline-none transition-all duration-200 cursor-pointer"
                    >
                        <option value="">{lang === 'th' ? '-- เดือน --' : '-- Month --'}</option>
                        {months.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* Year Dropdown */}
                <div className="relative w-[110px] shrink-0">
                    <select
                        value={currentYear}
                        onChange={e => handleYearChange(e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 text-sm font-medium
                                   hover:border-[#437393]/50 focus:bg-white focus:border-[#437393] focus:ring-2 focus:ring-[#437393]/20 
                                   outline-none transition-all duration-200 cursor-pointer"
                    >
                        <option value="">{lang === 'th' ? '-- ปี --' : '-- Year --'}</option>
                        {years.map(y => (
                            <option key={y} value={y.toString()}>{lang === 'th' ? y + 543 : y}</option>
                        ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* Calendar icon indicator */}
                <div className="text-slate-300 shrink-0">
                    <CalendarDays size={16} />
                </div>
            </div>
        </div>
    )
}
