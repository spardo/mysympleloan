import { isBusinessHours, getAvailableTimeSlots } from '../businessHours.js';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Los_Angeles';

describe('isBusinessHours', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns true during weekday business hours', () => {
    // Wednesday 10:00 AM PST
    jest.setSystemTime(new Date('2024-03-20T17:00:00.000Z'));
    expect(isBusinessHours()).toBe(true);
  });

  test('returns false before weekday business hours', () => {
    // Wednesday 4:00 AM PST
    jest.setSystemTime(new Date('2024-03-20T11:00:00.000Z'));
    expect(isBusinessHours()).toBe(false);
  });

  test('returns false after weekday business hours', () => {
    // Wednesday 8:00 PM PST
    jest.setSystemTime(new Date('2024-03-21T03:00:00.000Z'));
    expect(isBusinessHours()).toBe(false);
  });

  test('returns true during Saturday business hours', () => {
    // Saturday 10:00 AM PST
    jest.setSystemTime(new Date('2024-03-23T17:00:00.000Z'));
    expect(isBusinessHours()).toBe(true);
  });

  test('returns false before Saturday business hours', () => {
    // Saturday 7:00 AM PST
    jest.setSystemTime(new Date('2024-03-23T14:00:00.000Z'));
    expect(isBusinessHours()).toBe(false);
  });

  test('returns false after Saturday business hours', () => {
    // Saturday 4:00 PM PST
    jest.setSystemTime(new Date('2024-03-23T23:00:00.000Z'));
    expect(isBusinessHours()).toBe(false);
  });

  test('returns false on Sunday', () => {
    // Sunday 10:00 AM PST
    jest.setSystemTime(new Date('2024-03-24T17:00:00.000Z'));
    expect(isBusinessHours()).toBe(false);
  });
});

describe('getAvailableTimeSlots', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Set to Wednesday 9:00 AM PST
    jest.setSystemTime(new Date('2024-03-20T16:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns correct number of slots for two business days', () => {
    const slots = getAvailableTimeSlots();
    
    // Calculate expected slots for remaining business hours
    // Wednesday: 10 hours * 4 slots = 40 slots
    // Thursday: 14 hours * 4 slots = 56 slots
    const expectedMaxSlots = 96; // Two full business days
    
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.length).toBeLessThanOrEqual(expectedMaxSlots);
  });

  test('slots do not include Sundays', () => {
    const slots = getAvailableTimeSlots();
    
    slots.forEach(slot => {
      const pstSlot = utcToZonedTime(slot, TIMEZONE);
      const day = pstSlot.getDay();
      expect(day).not.toBe(0); // Sunday is 0
    });
  });

  test('weekday slots are within business hours', () => {
    const slots = getAvailableTimeSlots();
    
    slots.forEach(slot => {
      const pstSlot = utcToZonedTime(slot, TIMEZONE);
      const day = pstSlot.getDay();
      if (day !== 6) { // Not Saturday
        const hour = pstSlot.getHours();
        expect(hour).toBeGreaterThanOrEqual(5); // 5 AM PST
        expect(hour).toBeLessThanOrEqual(19); // 7 PM PST
      }
    });
  });

  test('Saturday slots are within Saturday business hours', () => {
    const slots = getAvailableTimeSlots();
    
    slots.forEach(slot => {
      const pstSlot = utcToZonedTime(slot, TIMEZONE);
      const day = pstSlot.getDay();
      if (day === 6) { // Saturday
        const hour = pstSlot.getHours();
        expect(hour).toBeGreaterThanOrEqual(8); // 8 AM PST
        expect(hour).toBeLessThanOrEqual(15); // 3 PM PST
      }
    });
  });
});