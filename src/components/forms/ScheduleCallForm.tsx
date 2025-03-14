import React, { useState } from 'react';
import { Calendar, Clock, Globe, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { getAvailableTimeSlots } from '../../utils/businessHours';
import { US_TIMEZONES, getBrowserTimezone, getTimezoneAbbr, getTimezoneLabel } from '../../utils/timezones';

type ScheduleCallFormProps = {
  firstName: string;
  onSchedule: (selectedTime: Date) => void;
};

export default function ScheduleCallForm({ firstName, onSchedule }: ScheduleCallFormProps) {
  const [step, setStep] = useState<'date' | 'time'>('date');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [timezone, setTimezone] = useState(getBrowserTimezone());
  
  const { availableSlots, allSlots } = getAvailableTimeSlots();

  // Group time slots by date
  const groupedAvailableSlots = availableSlots.reduce((acc, slot) => {
    const dateKey = format(slot, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, Date[]>);

  const groupedAllSlots = allSlots.reduce((acc, slot) => {
    const dateKey = format(slot, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, Date[]>);

  const handleDateSelect = (dateKey: string) => {
    setSelectedDate(dateKey);
    setStep('time');
  };

  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time);
  };

  const handleBack = () => {
    setStep('date');
    setSelectedTime(null);
  };

  const handleSubmit = () => {
    if (selectedTime) {
      onSchedule(selectedTime);
    }
  };

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimezone(e.target.value);
    // Clear selections when timezone changes
    setSelectedDate(null);
    setSelectedTime(null);
    setStep('date');
  };

  const formatTimeSlot = (date: Date): string => {
    const zonedDate = utcToZonedTime(date, timezone);
    return format(zonedDate, 'h:mm a');
  };

  const formatDate = (date: Date): string => {
    const zonedDate = utcToZonedTime(date, timezone);
    return format(zonedDate, 'EEEE, MMMM d');
  };

  const isSlotAvailable = (slot: Date): boolean => {
    return availableSlots.some(availableSlot => 
      availableSlot.getTime() === slot.getTime()
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Title as="h2" className="mb-2">Schedule a Call</Title>
        <Description>
          Hi {firstName}, our team is currently offline. Please select a convenient time for us to call you back.
        </Description>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-gray-600" />
          <Select
            options={US_TIMEZONES.map(tz => ({
              value: tz.value,
              label: `${tz.label} (${tz.abbr})`
            }))}
            value={timezone}
            onChange={handleTimezoneChange}
            className="!text-base"
          />
        </div>
      </div>

      {step === 'date' && (
        <div className="space-y-4">
          {Object.entries(groupedAllSlots).map(([dateKey, slots]) => {
            const availableCount = groupedAvailableSlots[dateKey]?.length || 0;
            return (
              <button
                key={dateKey}
                onClick={() => handleDateSelect(dateKey)}
                className="w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-[#212d52] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#212d52]" />
                  <div>
                    <div className="font-medium text-gray-900">{formatDate(slots[0])}</div>
                    <div className="text-sm text-gray-600">
                      {availableCount} of {slots.length} times available
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {step === 'time' && selectedDate && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="text-[#212d52] hover:text-[#1a2441] font-medium"
            >
              ← Back to dates
            </button>
            <div className="font-medium text-gray-900">
              {formatDate(groupedAllSlots[selectedDate][0])}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {groupedAllSlots[selectedDate].map((slot) => {
              const isAvailable = isSlotAvailable(slot);
              const isSelected = selectedTime?.toISOString() === slot.toISOString();
              
              return (
                <button
                  key={slot.toISOString()}
                  onClick={() => isAvailable && handleTimeSelect(slot)}
                  disabled={!isAvailable}
                  className={`
                    flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors
                    ${isSelected
                      ? 'bg-[#212d52] text-white border-[#212d52]'
                      : isAvailable
                        ? 'bg-white text-gray-700 border-gray-200 hover:border-[#212d52]'
                        : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                    }
                  `}
                >
                  {isAvailable ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {formatTimeSlot(slot)}
                  </span>
                </button>
              );
            })}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedTime}
            fullWidth
            size="lg"
          >
            Schedule Call
          </Button>
        </div>
      )}

      <Description size="sm" className="text-center">
        All times shown in {getTimezoneLabel(timezone)} ({getTimezoneAbbr(timezone)})
      </Description>
    </div>
  );
}