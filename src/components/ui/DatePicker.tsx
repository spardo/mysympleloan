import React, { useState, useEffect, forwardRef } from 'react';
import Label from './Label';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  label?: string;
  optional?: boolean;
  defaultOption?: 'empty' | 'fiftyYearsAgo';
  focusField?: 'year' | 'month' | 'day';
}

const DatePicker = forwardRef<HTMLSelectElement, DatePickerProps>(({
  value,
  onChange,
  error,
  label = 'Date of Birth',
  optional = false,
  defaultOption = 'fiftyYearsAgo',
  focusField
}, ref) => {
  const [isMobile, setIsMobile] = useState(false);
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 18;
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  const yearRef = React.useRef<HTMLSelectElement>(null);
  const monthRef = React.useRef<HTMLSelectElement>(null);
  const dayRef = React.useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (focusField === 'year' && yearRef.current) {
      yearRef.current.focus();
    } else if (focusField === 'month' && monthRef.current) {
      monthRef.current.focus();
    } else if (focusField === 'day' && dayRef.current) {
      dayRef.current.focus();
    }
  }, [focusField]);

  // Get default date based on option
  const getDefaultDate = () => {
    if (defaultOption === 'empty') {
      return { year: -1, month: -1, day: -1 };
    }
    
    const date = new Date();
    date.setFullYear(date.getFullYear() - 50);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    };
  };

  // Parse the date string (YYYY-MM-DD) into components or use default
  const parseDate = () => {
    if (!value) {
      return getDefaultDate();
    }
    const [year, month, day] = value.split('-').map(Number);
    return {
      year: year || getDefaultDate().year,
      month: (month || 1) - 1, // Convert from 1-based to 0-based month
      day: day || 1
    };
  };

  const { year: selectedYear, month: selectedMonth, day: selectedDay } = parseDate();

  const getDaysInMonth = (year: number, month: number) => {
    // month is 0-based
    return new Date(year, month + 1, 0).getDate();
  };

  const days = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth) },
    (_, i) => i + 1
  );

  const handleChange = (type: 'year' | 'month' | 'day', newValue: number) => {
    let year = selectedYear;
    let month = selectedMonth;
    let day = selectedDay;

    switch (type) {
      case 'year':
        year = newValue;
        month = (month == -1) ? 0 : month;
        day = (day == -1) ? 1 : day;
        break;
      case 'month':
        month = newValue;
        break;
      case 'day':
        day = newValue;
        break;
    }
    
    // Adjust day if it exceeds the days in the new month
    const daysInMonth = getDaysInMonth(year, month);
    if (day > daysInMonth) {
      day = daysInMonth;
    }

    // Format as ISO date string (YYYY-MM-DD)
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(formattedDate);
  };

  const MONTHS = [
    { short: 'Jan', long: 'January' },
    { short: 'Feb', long: 'February' },
    { short: 'Mar', long: 'March' },
    { short: 'Apr', long: 'April' },
    { short: 'May', long: 'May' },
    { short: 'Jun', long: 'June' },
    { short: 'Jul', long: 'July' },
    { short: 'Aug', long: 'August' },
    { short: 'Sep', long: 'September' },
    { short: 'Oct', long: 'October' },
    { short: 'Nov', long: 'November' },
    { short: 'Dec', long: 'December' }
  ];

  const monthOptions = [
    { value: -1, label: '-- Month --', shortLabel: 'mm' },
    ...MONTHS.map((month, index) => ({
      value: index,
      label: month.long,
      shortLabel: month.short
    }))
  ];

  const dayOptions = [
    { value: -1, label: '-- Day --', shortLabel: 'dd' },
    ...days.map(day => ({
      value: day,
      label: String(day),
      shortLabel: String(day)
    }))
  ];

  const yearOptions = [
    { value: -1, label: '-- Year --', shortLabel: 'yyyy' },
    ...years.map(year => ({
      value: year,
      label: String(year),
      shortLabel: String(year)
    }))
  ];

  const getDisplayLabel = (option: { label: string; shortLabel?: string }) => {
    if (isMobile) {
      return option.shortLabel || option.label;
    }
    return option.label;
  };

  const selectClassName = `w-full px-4 py-3 rounded-lg border ${
    error ? 'border-red-300' : 'border-gray-300'
  } focus:border-[#b3905e] focus:ring-2 focus:ring-[#b3905e]/20 transition duration-200 text-xl font-medium appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%221.5%22%20stroke%3D%22%23666%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19.5%208.25l-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] md:bg-[length:1.5rem] bg-[length:0.75rem] bg-[position:right_0.75rem_center] md:bg-[position:right_0.5rem_center] bg-no-repeat pr-6 md:pr-10 truncate`;

  return (
    <div>
      <Label 
        optional={optional}
        required={!optional}>
        {label}
      </Label>
      <div className="grid grid-cols-11 gap-2 md:gap-4">
        <div className="col-span-4">
          <select
            ref={yearRef}
            value={selectedYear}
            onChange={(e) => handleChange('year', parseInt(e.target.value))}
            className={selectClassName}
          >
            {yearOptions.map(option => (
              <option key={option.value} value={option.value}>
                {getDisplayLabel(option)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-4">
          <select
            ref={monthRef}
            value={selectedMonth}
            onChange={(e) => handleChange('month', parseInt(e.target.value))}
            className={selectClassName}
          >
            {monthOptions.map(option => (
              <option key={option.value} value={option.value}>
                {getDisplayLabel(option)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-3">
          <select
            ref={dayRef}
            value={selectedDay}
            onChange={(e) => handleChange('day', parseInt(e.target.value))}
            className={selectClassName}
          >
            {dayOptions.map(option => (
              <option key={option.value} value={option.value}>
                {getDisplayLabel(option)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;