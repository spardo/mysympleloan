// US Timezones
export const US_TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time', abbr: 'ET' },
  { value: 'America/Chicago', label: 'Central Time', abbr: 'CT' },
  { value: 'America/Denver', label: 'Mountain Time', abbr: 'MT' },
  { value: 'America/Los_Angeles', label: 'Pacific Time', abbr: 'PT' },
  { value: 'America/Anchorage', label: 'Alaska Time', abbr: 'AKT' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time', abbr: 'HT' }
];

// Get browser's timezone
export function getBrowserTimezone(): string {
  const defaultTimezone = 'America/Los_Angeles';
  
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Only return timezone if it's in our supported list
    return US_TIMEZONES.some(tz => tz.value === timezone) ? timezone : defaultTimezone;
  } catch (e) {
    return defaultTimezone;
  }
}

// Get timezone abbreviation
export function getTimezoneAbbr(timezone: string): string {
  const tz = US_TIMEZONES.find(t => t.value === timezone);
  return tz?.abbr || 'PT';
}

// Get timezone label
export function getTimezoneLabel(timezone: string): string {
  const tz = US_TIMEZONES.find(t => t.value === timezone);
  return tz?.label || 'Pacific Time';
}