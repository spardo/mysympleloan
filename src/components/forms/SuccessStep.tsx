import React, { useState } from 'react';
import { CheckCircle, Phone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { storageController } from '../../controllers/StorageController';
import { FormRouteEnum } from '../../routes/FormRoutes';
import { useFormRouting } from '../../routes/FormRoutes';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Button from '../ui/Button';
import ScheduleCallForm from './ScheduleCallForm';
import { isBusinessHours } from '../../utils/businessHours';
import { getBrowserTimezone } from '../../utils/timezones';
import ErrorMessage from '../ui/ErrorMessage';
import ApplicationProgress from '../ApplicationProgress';

export default function SuccessStep() {
  const { navigateToRoute } = useFormRouting();
  const phoneNumber = '(855) 303-1455';
  const phoneNumberLink = 'tel:8553031455';
  const firstName = storageController.getContactFirstName() || '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(storageController.getScheduledTime());

  const enableScheduler = false;

  // Redirect if not successful
  if (!storageController.isApplicationSuccessful()) {
    navigateToRoute(FormRouteEnum.START);
    return null;
  }

  const handleScheduleCall = async (selectedTime: Date) => {
    setLoading(true);
    setError(null);
    try {
      // Store the scheduled time
      storageController.setScheduledTime(selectedTime);
      setScheduledTime(selectedTime);
    } catch (error) {
      console.error('Failed to schedule call:', error);
      setError('Unable to schedule your call. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const formatAppointmentTime = (date: Date): string => {
    const timezone = getBrowserTimezone();
    const zonedDate = utcToZonedTime(date, timezone);
    return format(zonedDate, "EEEE, MMMM d 'at' h:mm a");
  };

  if (!isBusinessHours() && !scheduledTime && enableScheduler) {
    return (
      <>
        <ScheduleCallForm 
          firstName={firstName} 
          onSchedule={handleScheduleCall} 
        />
        {error && (
          <ErrorMessage 
            message={error}
            className="mt-4"
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#b3905e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#b3905e]" />
        </div>
        
        <Title as="h2" className="mb-2">
          {scheduledTime ? (
            'Application Received!'
          ) : (
            `Congratulations, ${firstName}!`
          )}
        </Title>
        <Description size="lg">
          {scheduledTime ? (
            <span>
              Thank you <span className="font-medium">{firstName}</span>, we look forward to speaking with you on{' '}
              <span className="font-medium">{formatAppointmentTime(scheduledTime)}</span>
            </span>
          ) : (
            <span>
              We have a question about your application.
            </span>
          )}
        </Description>
      </div>

      <ApplicationProgress />
      
      <div className="w-full md:w-1/2 mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          {scheduledTime ? (
            <>
              <div className="flex items-center justify-center gap-2 text-[#b3905e]">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Appointment Scheduled</span>
              </div>
              <Description className="text-center">
                <span>For immediate assistance before your appointment, call:</span>
              </Description>
            </>
          ) : (
            <Description className="text-center">
              <span>Please call us at:</span>
            </Description>
          )}
          
          <Button
            as="a"
            href={phoneNumberLink}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Phone className="w-5 h-5" />}
          >
            {phoneNumber}
          </Button>
        </div>
      </div>
    </div>
  );
}