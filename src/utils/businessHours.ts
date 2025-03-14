import { addDays, setHours, setMinutes, isWithinInterval, isSaturday, isSunday, startOfDay, getMonth, getDate } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Los_Angeles';

// Use a consistent seed for the session
const SESSION_SEED = Math.random();

export type BusinessHours = {
  start: Date;
  end: Date;
};

// Create hours in PST/PDT
const createPSTHours = (startHour: number, endHour: number): BusinessHours => {
  const now = new Date();
  const pstDate = utcToZonedTime(now, TIMEZONE);
  
  return {
    start: setMinutes(setHours(pstDate, startHour), 0),
    end: setMinutes(setHours(pstDate, endHour), 1)
  };
};

export const WEEKDAY_HOURS = createPSTHours(1, 1); // 5 AM to 7 PM PST
export const SATURDAY_HOURS = createPSTHours(1, 1); // 8 AM to 3 PM PST

// Seeded random number generator
function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed + index) * 10000;
  return x - Math.floor(x);
}

// US Federal Holidays
const isNewYearsDay = (date: Date): boolean => {
  return getMonth(date) === 0 && getDate(date) === 1;
};

const isNewYearsEve = (date: Date): boolean => {
  return getMonth(date) === 11 && getDate(date) === 31;
};

const isMartinLutherKingDay = (date: Date): boolean => {
  return getMonth(date) === 0 && // January
         date.getDay() === 1 && // Monday
         getDate(date) >= 15 && getDate(date) <= 21; // Third Monday
};

const isPresidentsDay = (date: Date): boolean => {
  return getMonth(date) === 1 && // February
         date.getDay() === 1 && // Monday
         getDate(date) >= 15 && getDate(date) <= 21; // Third Monday
};

const isMemorialDay = (date: Date): boolean => {
  return getMonth(date) === 4 && // May
         date.getDay() === 1 && // Monday
         getDate(date) >= 25; // Last Monday
};

const isIndependenceDay = (date: Date): boolean => {
  return getMonth(date) === 6 && getDate(date) === 4; // July 4
};

const isLaborDay = (date: Date): boolean => {
  return getMonth(date) === 8 && // September
         date.getDay() === 1 && // Monday
         getDate(date) <= 7; // First Monday
};

const isColumbusDay = (date: Date): boolean => {
  return getMonth(date) === 9 && // October
         date.getDay() === 1 && // Monday
         getDate(date) >= 8 && getDate(date) <= 14; // Second Monday
};

const isVeteransDay = (date: Date): boolean => {
  return getMonth(date) === 10 && getDate(date) === 11; // November 11
};

const isThanksgiving = (date: Date): boolean => {
  return getMonth(date) === 10 && // November
         date.getDay() === 4 && // Thursday
         getDate(date) >= 22 && getDate(date) <= 28; // Fourth Thursday
};

const isDayAfterThanksgiving = (date: Date): boolean => {
  const prevDay = new Date(date);
  prevDay.setDate(prevDay.getDate() - 1);
  return isThanksgiving(prevDay);
};

const isChristmasEve = (date: Date): boolean => {
  return getMonth(date) === 11 && getDate(date) === 24;
};

const isChristmasDay = (date: Date): boolean => {
  return getMonth(date) === 11 && getDate(date) === 25;
};

const isHoliday = (date: Date): boolean => {
  return (
    isNewYearsDay(date) ||
    isMartinLutherKingDay(date) ||
    isPresidentsDay(date) ||
    isMemorialDay(date) ||
    isIndependenceDay(date) ||
    isLaborDay(date) ||
    isColumbusDay(date) ||
    isVeteransDay(date) ||
    isThanksgiving(date) ||
    isChristmasDay(date)
  );
};

const isSpecialBusinessDay = (date: Date): boolean => {
  return isDayAfterThanksgiving(date) || isChristmasEve(date) || isNewYearsEve(date);
};

export function isBusinessHours(): boolean {
  const now = new Date();
  const pstNow = utcToZonedTime(now, TIMEZONE);
  
  // Check if it's a weekend or holiday
  if (isSunday(pstNow) || isHoliday(pstNow)) return false;
  
  const todayStart = startOfDay(pstNow);
  let intervalStart: Date;
  let intervalEnd: Date;

  if (isSpecialBusinessDay(pstNow)) {
    // Special business days: 8 AM to 3 PM PST
    intervalStart = setMinutes(setHours(todayStart, 8), 0);
    intervalEnd = setMinutes(setHours(todayStart, 15), 0);
  } else if (isSaturday(pstNow)) {
    // Saturday hours: 8 AM to 3 PM PST
    intervalStart = setMinutes(setHours(todayStart, SATURDAY_HOURS.start.getHours()), 0);
    intervalEnd = setMinutes(setHours(todayStart, SATURDAY_HOURS.end.getHours()), 0);
  } else {
    // Regular business hours
    intervalStart = setMinutes(setHours(todayStart, WEEKDAY_HOURS.start.getHours()), 0);
    intervalEnd = setMinutes(setHours(todayStart, WEEKDAY_HOURS.end.getHours()), 0);
  }
  
  return isWithinInterval(pstNow, { start: intervalStart, end: intervalEnd });
}

export function getAvailableTimeSlots(): { availableSlots: Date[]; allSlots: Date[] } {
  const availableSlots: Date[] = [];
  const allSlots: Date[] = [];
  const now = new Date();
  const pstNow = utcToZonedTime(now, TIMEZONE);
  let currentDate = startOfDay(pstNow);
  let businessDaysFound = 0;
  let slotIndex = 0;
  
  // Look ahead up to 5 days to find 2 business days
  for (let i = 0; i < 5 && businessDaysFound < 2; i++) {
    if (!isSunday(currentDate) && !isHoliday(currentDate)) {
      const isToday = currentDate.getDate() === pstNow.getDate();
      
      // Determine business hours for the day
      let dayStart: Date;
      let dayEnd: Date;

      if (isSpecialBusinessDay(currentDate)) {
        // Special business days: 8 AM to 3 PM PST
        dayStart = setMinutes(setHours(currentDate, 8), 0);
        dayEnd = setMinutes(setHours(currentDate, 15), 0);
      } else if (isSaturday(currentDate)) {
        // Saturday hours: 8 AM to 3 PM PST
        dayStart = setMinutes(setHours(currentDate, SATURDAY_HOURS.start.getHours()), 0);
        dayEnd = setMinutes(setHours(currentDate, SATURDAY_HOURS.end.getHours()), 0);
      } else {
        // Regular business hours
        dayStart = setMinutes(setHours(currentDate, WEEKDAY_HOURS.start.getHours()), 0);
        dayEnd = setMinutes(setHours(currentDate, WEEKDAY_HOURS.end.getHours()), 0);
      }

      if (isToday) {
        dayStart = pstNow;
      }
      
      // Ensure dayStart is not before business hours
      const minHour = isSpecialBusinessDay(currentDate) || isSaturday(currentDate) ? 8 : WEEKDAY_HOURS.start.getHours();
      if (dayStart.getHours() < minHour) {
        dayStart = setMinutes(setHours(currentDate, minHour), 0);
      }
      
      // Round up to next 30-minute interval
      const startMinutes = dayStart.getMinutes();
      const roundedMinutes = Math.ceil(startMinutes / 30) * 30;
      let currentSlot = setMinutes(dayStart, roundedMinutes);
      
      while (currentSlot < dayEnd) {
        // Convert PST slot to UTC for storage
        const utcSlot = zonedTimeToUtc(currentSlot, TIMEZONE);
        allSlots.push(utcSlot);
        
        // Use seeded random to determine if slot should be enabled
        const random = seededRandom(SESSION_SEED, slotIndex);
        if (random >= 0.35) {
          availableSlots.push(utcSlot);
        }
        
        // Add 30 minutes
        currentSlot = new Date(currentSlot.getTime() + 30 * 60 * 1000);
        slotIndex++;
      }
      
      businessDaysFound++;
    }
    
    currentDate = addDays(currentDate, 1);
  }
  
  return { availableSlots, allSlots };
}