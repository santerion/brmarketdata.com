"use client"

import * as React from "react"
import { format } from "date-fns"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (!value) return undefined
    const [year, month] = value.split('-')
    return new Date(parseInt(year), parseInt(month) - 1, 1, 12, 0, 0)
  })

  // Generate years from 2010 to current year + 1
  const years = Array.from(
    { length: new Date().getFullYear() - 2010 + 2 },
    (_, i) => 2010 + i
  ).reverse()

  // Months in Portuguese
  const months = [
    { value: "01", label: "Jan" },
    { value: "02", label: "Fev" },
    { value: "03", label: "Mar" },
    { value: "04", label: "Abr" },
    { value: "05", label: "Mai" },
    { value: "06", label: "Jun" },
    { value: "07", label: "Jul" },
    { value: "08", label: "Ago" },
    { value: "09", label: "Set" },
    { value: "10", label: "Out" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dez" },
  ]

  const currentMonth = date ? format(date, "MM") : format(new Date(), "MM")
  const currentYear = date ? format(date, "yyyy") : format(new Date(), "yyyy")

  const handleChange = (month: string, year: string) => {
    const newDate = new Date(parseInt(year), parseInt(month) - 1)
    setDate(newDate)
    onChange(format(newDate, "yyyy-MM"))
  }

  return (
    <div className="flex gap-2">
      <Select
        value={currentMonth}
        onValueChange={(value) => handleChange(value, currentYear)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentYear}
        onValueChange={(value) => handleChange(currentMonth, value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 