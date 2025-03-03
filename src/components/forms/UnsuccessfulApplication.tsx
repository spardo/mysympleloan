import React, { useEffect } from 'react';
import { Shield, ExternalLink } from 'lucide-react';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Button from '../ui/Button';

export default function UnsuccessfulApplication() {
  useEffect(() => {
    // Set application block in localStorage with unsuccessful status
    localStorage.setItem('applicationSuccess', JSON.stringify({
      timestamp: Date.now(),
      email: sessionStorage.getItem('formData') ? JSON.parse(sessionStorage.getItem('formData')!).email : '',
      formData: sessionStorage.getItem('formData') ? JSON.parse(sessionStorage.getItem('formData')!) : {},
      status: 'unsuccessful'
    }));
    
    // Clear form data from sessionStorage
    sessionStorage.removeItem('formData');
  }, []);

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Shield className="w-8 h-8 text-red-600" />
      </div>

      <Title as="h2" className="mb-2">Identity Verification Required</Title>
      <Description size="lg" className="max-w-md mx-auto mb-6">
        To protect your security and maintain the integrity of our lending platform, we were unable to verify your identity using the information provided.
      </Description>
      
      <div className="w-1/2 mx-auto">
        <Button
          as="a"
          href="https://fiona.com/partner/symple-lending-loans/loans"
          variant="primary"
          size="lg"
          fullWidth
          icon={<ExternalLink className="w-5 h-5" />}
        >
          Explore Alternative Options
        </Button>
      </div>
    </div>
  );
}