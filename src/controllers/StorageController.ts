import type { FormData } from '../types/form';

interface ApplicationData {
  timestamp: number;
  email: string;
  formData: Partial<FormData>;
  status: 'success' | 'unsuccessful' | 'pending';
}

type ApplicationStatus = 'started' | 'sms-code' | 'success' | 'failed' | 'pending' | 'offers' | null;

export class StorageController {
  private static instance: StorageController;

  private constructor() {}

  public static getInstance(): StorageController {
    if (!StorageController.instance) {
      StorageController.instance = new StorageController();
    }
    return StorageController.instance;
  }

  // Form Data (Session Storage)
  public getFormData(): FormData | null {
    const data = sessionStorage.getItem('formData');
    return data ? JSON.parse(data) : null;
  }

  public setFormData(data: FormData): void {
    sessionStorage.setItem('formData', JSON.stringify(data));
  }

  public clearFormData(): void {
    sessionStorage.removeItem('formData');
  }

  // Contact First Name (Session Storage)
  public getContactFirstName(): string | null {
    return sessionStorage.getItem('contactFirstName');
  }

  public setContactFirstName(firstName: string): void {
    sessionStorage.setItem('contactFirstName', firstName);
  }

  public clearContactFirstName(): void {
    sessionStorage.removeItem('contactFirstName');
  }

  // Scheduled Time (Session Storage)
  public getScheduledTime(): Date | null {
    const time = sessionStorage.getItem('scheduledTime');
    return time ? new Date(time) : null;
  }

  public setScheduledTime(time: Date): void {
    sessionStorage.setItem('scheduledTime', time.toISOString());
  }

  public clearScheduledTime(): void {
    sessionStorage.removeItem('scheduledTime');
  }

  // Application Data (Local Storage)
  public getApplicationData(): ApplicationData | null {
    const data = localStorage.getItem('applicationData');
    return data ? JSON.parse(data) : null;
  }

  public setApplicationData(data: ApplicationData): void {
    localStorage.setItem('applicationData', JSON.stringify(data));
    // Update application status based on the data
    this.setApplicationStatus(data.status);
  }

  public clearApplicationData(): void {
    localStorage.removeItem('applicationData');
    this.clearApplicationStatus();
  }

  // Consolidated Application Status Management
  private getApplicationStatus(): ApplicationStatus {
    const status = localStorage.getItem('applicationStatus');
    return status as ApplicationStatus;
  }

  private setApplicationStatus(status: ApplicationStatus): void {
    if (status) {
      localStorage.setItem('applicationStatus', status);
    } else {
      localStorage.removeItem('applicationStatus');
    }
  }

  private clearApplicationStatus(): void {
    localStorage.removeItem('applicationStatus');
  }

  // Application Status Getters
  public isApplicationStarted(): boolean {
    return this.getApplicationStatus() === 'started';
  }

  public isApplicationSmsCode(): boolean {
    return this.getApplicationStatus() === 'sms-code';
  }

  public isApplicationSuccessful(): boolean {
    return this.getApplicationStatus() === 'success';
  }

  public isApplicationFailed(): boolean {
    return this.getApplicationStatus() === 'failed';
  }

  public isApplicationPending(): boolean {
    return this.getApplicationStatus() === 'pending';
  }

  public isApplicationOffers(): boolean {
    return this.getApplicationStatus() === 'offers';
  }

  // Application Status Setters
  public setApplicationStarted(): void {
    this.setApplicationStatus('started');
  }
  
  public setApplicationSmsCode(): void {
    this.setApplicationStatus('sms-code');
  }

  public setApplicationSuccess(): void {
    this.setApplicationStatus('success');
  }

  public setApplicationFailed(): void {
    this.setApplicationStatus('failed');
  }

  public setApplicationPending(): void {
    this.setApplicationStatus('pending');
  }

  public setApplicationOffers(): void {
    this.setApplicationStatus('offers');
  }

  // User IP (Session Storage)
  public getUserIp(): string | null {
    return sessionStorage.getItem('userIp');
  }

  public setUserIp(ip: string): void {
    sessionStorage.setItem('userIp', ip);
  }

  public clearUserIp(): void {
    sessionStorage.removeItem('userIp');
  }

  // Clear All Storage
  public clearAll(): void {
    // Clear session storage
    this.clearFormData();
    this.clearUserIp();
    this.clearContactFirstName();
    this.clearScheduledTime();

    // Clear local storage
    this.clearApplicationData();
    this.clearApplicationStatus();
  }

  // Check if application is blocked
  public isApplicationBlocked(): boolean {
    const applicationData = this.getApplicationData();
    if (!applicationData) return false;

    const { timestamp, status } = applicationData;
    const blockDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const isBlocked = Date.now() - timestamp < blockDuration;
    const isCompleted = status === 'success' || status === 'unsuccessful';

    return isBlocked && isCompleted;
  }

  // Get remaining block time in days
  public getBlockTimeRemaining(): number {
    const applicationData = this.getApplicationData();
    if (!applicationData) return 0;

    const { timestamp } = applicationData;
    const blockDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const timeRemaining = blockDuration - (Date.now() - timestamp);
    return Math.ceil(timeRemaining / (24 * 60 * 60 * 1000));
  }
}

// Export singleton instance
export const storageController = StorageController.getInstance();