import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AlertCircle, Phone, MapPin, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import { UserContext, API } from '../App';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const SOSPage = () => {
  const { user } = useContext(UserContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [emergencyType, setEmergencyType] = useState('');
  const [triggering, setTriggering] = useState(false);

  const emergencyTypes = [
    { id: 'harassment', label: 'Harassment', icon: <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" /> },
    { id: 'accident', label: 'Accident/Injury', icon: <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" /> },
    { id: 'threat', label: 'Safety Threat', icon: <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" /> },
    { id: 'other', label: 'Other Emergency', icon: <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" /> }
  ];

  const handleSOSClick = (type) => {
    setEmergencyType(type);
    setShowConfirm(true);
  };

  const triggerSOS = async () => {
    setTriggering(true);
    try {
      await axios.post(`${API}/sos/trigger`, {
        worker_id: user.id,
        worker_name: user.name,
        location: 'Mock Location: 12.9716° N, 77.5946° E',
        emergency_type: emergencyType
      });
      
      setShowConfirm(false);
      setShowSuccess(true);
      toast.success('🚨 SOS Alert Sent! Help is on the way.', {
        duration: 5000,
        style: {
          background: '#15803D',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600'
        }
      });
    } catch (error) {
      console.error('Error triggering SOS:', error);
      toast.error('Failed to trigger SOS. Please call emergency hotline: 1800-SWAYAM-911');
    }
    setTriggering(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Warning Banner */}
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8" data-testid="sos-warning">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-red-100 p-2 sm:p-3 rounded-full flex-shrink-0">
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-red-900 mb-2">Emergency SOS</h2>
              <p className="text-sm sm:text-base text-red-800">
                Use this only in case of real emergency. Our safety team will be immediately notified and help will be dispatched.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Types */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-[#1C1917] mb-4">Select Emergency Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {emergencyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSOSClick(type.id)}
                className="card-job text-left hover:border-red-400 transition-all p-4 sm:p-6"
                data-testid={`sos-type-${type.id}`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-red-100 p-2 sm:p-3 rounded-full text-red-600 flex-shrink-0">
                    {type.icon}
                  </div>
                  <span className="font-semibold text-[#1C1917] text-base sm:text-lg">{type.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8" data-testid="sos-info">
          <h3 className="text-lg sm:text-xl font-bold text-[#1C1917] mb-4">What Happens When You Trigger SOS?</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { icon: <Phone className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'Emergency call placed to SWAYAM Safety Team' },
              { icon: <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'Your live location is shared with emergency contacts' },
              { icon: <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'SMS alerts sent to your trusted contacts' },
              { icon: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'Local authorities notified if needed' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3" data-testid={`sos-step-${idx}`}>
                <div className="bg-teal-100 p-2 rounded-full text-[#0F766E] flex-shrink-0">
                  {item.icon}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground pt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-teal-50 rounded-xl p-4 sm:p-6">
          <h3 className="font-bold text-[#0F766E] mb-2 sm:mb-3">24/7 Emergency Hotline</h3>
          <p className="text-xl sm:text-2xl font-bold text-[#1C1917]">1800-SWAYAM-911</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Always available for immediate assistance</p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md mx-4" data-testid="sos-confirm-dialog">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 sm:p-4 rounded-full sos-pulse">
                <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl sm:text-2xl">Confirm Emergency SOS</DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base">
              Are you sure you want to trigger an emergency alert? This will notify our safety team immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowConfirm(false)}
              disabled={triggering}
              data-testid="cancel-sos-button"
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={triggerSOS}
              disabled={triggering}
              data-testid="confirm-sos-button"
            >
              {triggering ? 'Alerting...' : 'Yes, Trigger SOS'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md mx-4" data-testid="sos-success-dialog">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 sm:p-4 rounded-full">
                <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl sm:text-2xl">SOS Alert Sent!</DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base">
              Our safety team has been notified. Help is on the way. Stay safe!
            </DialogDescription>
          </DialogHeader>
          <div className="bg-teal-50 rounded-lg p-4 mt-4">
            <p className="text-sm font-semibold text-[#0F766E] mb-2">Emergency Response Active:</p>
            <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
              <li>• Safety team alerted</li>
              <li>• Location shared</li>
              <li>• Emergency contacts notified</li>
              <li>• Support line: 1800-SWAYAM-911</li>
            </ul>
          </div>
          <Button 
            className="btn-primary w-full mt-4"
            onClick={() => setShowSuccess(false)}
            data-testid="close-success-button"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SOSPage;