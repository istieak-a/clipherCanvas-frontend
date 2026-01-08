import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chip, Stepper, Step, StepLabel } from '@mui/material';
import CryptoJS from 'crypto-js';
import { generatePattern } from '../utils/patternGenerator';
import { EMOTIONS } from '../utils/mockData';
import artService from '../utils/artService';

const CreateArt = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    message: '',
    emotion: '',
    secretKey: '',
    hint: '',
    pattern: null,
    seed: crypto.randomUUID(), // Use UUID for unique, deterministic seed
  });

  const steps = ['Write Message', 'Choose Emotion', 'Set Secret Key', 'Preview'];

  const handleNext = () => {
    // Validation
    if (activeStep === 0 && !formData.message.trim()) {
      setError('Please enter a message');
      return;
    }
    if (activeStep === 1 && !formData.emotion) {
      setError('Please select an emotion');
      return;
    }
    if (activeStep === 2 && !formData.secretKey.trim()) {
      setError('Please set a secret key');
      return;
    }

    setError('');
    
    // Generate pattern when moving to preview - now includes emotion for colors!
    if (activeStep === 2) {
      const pattern = generatePattern(800, 600, formData.seed, formData.emotion);
      setFormData({ ...formData, pattern });
    }
    
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep(prev => prev - 1);
  };

  const handleEmotionSelect = (emotionId) => {
    setFormData({ ...formData, emotion: emotionId });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const emotion = EMOTIONS.find(e => e.id === formData.emotion);
      
      // Encrypt message with AES encryption using the secret key
      const encryptedContent = CryptoJS.AES.encrypt(
        formData.message,
        formData.secretKey
      ).toString();
      
      const artData = {
        message: formData.message,
        encryptedMessage: encryptedContent,
        emotion: formData.emotion,
        emotionLabel: emotion.label,
        emotionIcon: emotion.icon,
        secretKey: formData.secretKey,
        hint: formData.hint || '',
        pattern: formData.pattern,
        seed: formData.seed,
      };

      const response = await artService.createArtPost(artData);
      
      if (response.success) {
        navigate('/gallery');
      } else {
        setError(response.error || 'Failed to create art');
      }
    } catch (err) {
      console.error('Create art error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Art</h1>
          <p className="text-gray-600">Express yourself through encrypted visual art</p>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Step 1: Message */}
          {activeStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What's your message?</h2>
              <p className="text-gray-600 mb-6">
                Write a message that will be encrypted and hidden in your art. Only those with the
                secret key can reveal it.
              </p>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter your secret message..."
                rows={8}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0084D1] focus:border-transparent resize-none"
              />
              <div className="text-right text-sm text-gray-500">
                {formData.message.length}/500 characters
              </div>
            </div>
          )}

          {/* Step 2: Emotion */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Choose an emotion</h2>
              <p className="text-gray-600 mb-6">
                Select the emotion that best represents your message. This will influence the art's
                visual style.
              </p>
              <div className="flex flex-wrap gap-3">
                {EMOTIONS.map((emotion) => (
                  <Chip
                    key={emotion.id}
                    label={
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{emotion.icon}</span>
                        <span>{emotion.label}</span>
                      </span>
                    }
                    onClick={() => handleEmotionSelect(emotion.id)}
                    variant={formData.emotion === emotion.id ? 'filled' : 'outlined'}
                    sx={{
                      fontSize: '1rem',
                      padding: '24px 16px',
                      backgroundColor: formData.emotion === emotion.id ? emotion.color : 'transparent',
                      borderColor: emotion.color,
                      color: formData.emotion === emotion.id ? '#fff' : '#374151',
                      '&:hover': {
                        backgroundColor: formData.emotion === emotion.id ? emotion.color : `${emotion.color}20`,
                      },
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Secret Key & Hint */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Set your secret key</h2>
                <p className="text-gray-600 mb-6">
                  Create a secret key that others will need to unlock and read your message.
                </p>
                <input
                  type="text"
                  value={formData.secretKey}
                  onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                  placeholder="Enter your secret key"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0084D1] focus:border-transparent"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add a hint (optional)</h3>
                <p className="text-gray-600 mb-4">
                  Give viewers a hint to help them guess the secret key.
                </p>
                <input
                  type="text"
                  value={formData.hint}
                  onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                  placeholder="e.g., My favorite color"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0084D1] focus:border-transparent"
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.hint.length}/100 characters
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Preview your art</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="aspect-4/3 rounded-lg overflow-hidden shadow-lg">
                  {formData.pattern && (
                    <img 
                      src={formData.pattern} 
                      alt="Generated pattern" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Emotion</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {EMOTIONS.find(e => e.id === formData.emotion)?.icon}
                      </span>
                      <span className="text-gray-900">
                        {EMOTIONS.find(e => e.id === formData.emotion)?.label}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Message Length</h4>
                    <p className="text-gray-900">{formData.message.length} characters</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow col-span-2">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Hint</h4>
                    <p className="text-gray-900 italic">
                      {formData.hint || 'No hint provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  <strong>Note:</strong> Once published, your encrypted message will be visible only
                  to those who enter the correct secret key.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Back
            </button>

            {activeStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-[#0084D1] text-white rounded-lg font-medium hover:bg-[#0070B8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Publish Art'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-[#0084D1] text-white rounded-lg font-medium hover:bg-[#0070B8] transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArt;
