import { z } from 'zod';

export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits and any leading/trailing 1s
  const digits = value.replace(/\D/g, '').replace(/^1/g, '');
  
  // Format the number as user types
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};

export const formatE164 = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Remove leading 1 if present, we'll add it back in E.164 format
  const normalizedDigits = digits.replace(/^1/, '');
  
  // Ensure we have exactly 10 digits
  if (normalizedDigits.length !== 10) {
    throw new Error('Phone number must be 10 digits');
  }
  
  // Return in E.164 format (+1XXXXXXXXXX)
  return `+1${normalizedDigits}`;
};

export const validatePhone = (phone: string): string | null => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 0) return null;
  if (digits.length !== 10) {
    return 'Please enter a valid 10-digit phone number';
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  // Empty check
  if (!email || email.trim() === '') {
    return 'Email address is required';
  }

  // Basic format check using regex
  // This regex checks for:
  // - At least one character before the @ symbol
  // - Allows plus (+) addressing in the local part
  // - At least one character after the @ symbol and before the dot
  // - At least two characters after the last dot (TLD)
  // - No spaces or special characters except for ._-+
  const basicEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!basicEmailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  // Additional checks for common issues
  
  // Check for multiple @ symbols
  if ((email.match(/@/g) || []).length !== 1) {
    return 'Email address should contain exactly one @ symbol';
  }

  // Check for invalid TLD (top-level domain)
  const parts = email.split('.');
  const tld = parts[parts.length - 1].toLowerCase();
  
  // Check TLD length (should be at least 2 characters)
  if (tld.length < 2) {
    return 'Email address has an invalid domain extension';
  }
  
  // Check for common disposable email domains
  const disposableDomains = [
    'mailinator.com', 'yopmail.com', 'tempmail.com', 'guerrillamail.com',
    'throwawaymail.com', '10minutemail.com', 'mailnesia.com', 'trashmail.com'
  ];
  
  const domain = email.split('@')[1].toLowerCase();
  if (disposableDomains.includes(domain)) {
    return 'Please use a non-disposable email address';
  }
  
  // Check for consecutive special characters (but allow a plus followed by other characters)
  if (/([._-])\1+/.test(email)) {
    return 'Email address contains consecutive special characters';
  }
  
  // Check for special characters at the beginning or end of local part
  // Note: We exclude the plus sign check since it's valid in the middle
  const localPart = email.split('@')[0];
  if (/^[._-]|[._-]$/.test(localPart)) {
    return 'Email address contains special characters at invalid positions';
  }
  
  // Check for IP address format domains (not allowed by most providers)
  if (/^[\d.]+$/.test(domain)) {
    return 'Email address cannot use an IP address as domain';
  }

  // If all checks pass, return null (no error)
  return null;
};

export const validateBirthDate = (date: string): string | null => {
  if (!date) return null;
  
  const birthDate = new Date(date);
  const today = new Date();
  const minAge = 18;
  const maxAge = 100;
  
  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < minAge) {
    return 'You must be at least 18 years old';
  }
  if (age > maxAge) {
    return 'Please enter a valid birth date';
  }
  
  return null;
};