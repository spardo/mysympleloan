import React, { useState } from 'react';
import type { FormData } from '../../types/form';
import { formatPhoneNumber, validatePhone } from '../../utils/validation';
import MonthForm from './birth-date/MonthForm';
import DayForm from './birth-date/DayForm';
import YearForm from './birth-date/YearForm';

type ReenterContactFormProps = {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: Partial<FormData>) => void;
};

export default function ReenterContactForm({
  formData,
  onChange,
  onSubmit
}: ReenterContactFormProps) {
  const [step, setStep] = useState<'phone' | 'month' | 'day' | 'year'>('phone');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    onChange({
      ...e,
      target: {
        ...e.target,
        value: formattedPhone
      }
    });
    setPhoneError(validatePhone(formattedPhone));
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validatePhone(formData.phone);
    if (error) {
      setPhoneError(error);
      return;
    }
    setStep('month');
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setStep('day');
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setStep('year');
  };

  const handleYearSelect = (year: string) => {
    const birthDate = `${year}-${selectedMonth}-${selectedDay}`;
    onSubmit({ birthDate });
  };

  return (
    <div className="space-y-6">
      {step === 'phone' && (
        <form onSubmit={handlePhoneSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Phone Number</h2>
            <p className="text-gray-600">Enter your mobile phone number</p>
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="(555) 555-5555"
              maxLength={14}
              className={`w-full px-4 py-3 rounded-lg border ${
                phoneError ? 'border-red-300' : 'border-gray-300'
              } focus:border-[#212d52] focus:ring-2 focus:ring-[#212d52]/20 transition duration-200 text-center text-xl`}
              required
              autoFocus
            />
            {phoneError && (
              <p className="mt-2 text-sm text-red-600">{phoneError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!!phoneError || !formData.phone}
            className="w-full bg-[#212d52] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#1a2441] focus:outline-none focus:ring-4 focus:ring-[#212d52]/20 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </form>
      )}

      {step === 'month' && (
        <MonthForm onSelect={handleMonthSelect} />
      )}

      {step === 'day' && (
        <DayForm 
          selectedMonth={selectedMonth}
          onSelect={handleDaySelect}
        />
      )}

      {step === 'year' && (
        <YearForm onSelect={handleYearSelect} />
      )}
    </div>
  );
}