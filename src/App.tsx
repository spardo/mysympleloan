import React from 'react';
import { HashRouter } from 'react-router-dom';
import MicroForm from './components/MicroForm';
import Footer from './components/Footer';
import HubspotScript from './components/HubspotScript';
import GoogleTagManager from './components/GoogleTagManager';
import AwsRumScript from './components/AwsRumScript';
import TrustpilotScript from './components/TrustpilotScript';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 px-4 sm:px-6">
        <TrustpilotScript />
        <MicroForm />
        <Footer />
        <HubspotScript />
        <GoogleTagManager />
        <AwsRumScript />
      </div>
    </HashRouter>
  );
}

export default App;