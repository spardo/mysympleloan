import React from 'react';
import { CheckCircle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storageController } from '../../controllers/StorageController';
import { FormRouteEnum } from '../../routes/FormRoutes';
import { useFormRouting } from '../../routes/FormRoutes';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Button from '../ui/Button';

export default function SuccessStep() {
  const { navigateToRoute } = useFormRouting();
  const phoneNumber = '(855) 303-1455';
  const phoneNumberLink = 'tel:8553031455';

  // Redirect if not successful
  if (!storageController.isApplicationSuccessful()) {
    navigateToRoute(FormRouteEnum.START);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#b3905e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#b3905e]" />
        </div>
        
        <Title as="h2" className="mb-2">Application Received!</Title>
        <Description>
          Thank you for your submission. We'll be in touch with you shortly with next steps.
        </Description>
      </div>
      
      <div className="w-full md:w-1/2 mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <Description className="text-center">
            For immediate assistance, call us at
          </Description>
          
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

      <Description size="sm" className="text-center">
        Our team is available Monday through Friday, 5 AM to 7 PM PST and on Saturday from 8 AM to 4 PM PST.
      </Description>
    </div>
  );
}