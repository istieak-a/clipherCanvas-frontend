import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    seed: crypto.randomUUID(),
  });

  const steps = [
    { label: 'Message', icon: '✍️' },
    { label: 'Emotion', icon: '💫' },
    { label: 'Secret Key', icon: '🔐' },
    { label: 'Preview', icon: '👁️' },
  ];

  const handleNext = () => {
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

  const selectedEmotion = EMOTIONS.find(e => e.id === formData.emotion);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <span>←</span>
            <span>Back</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Art</h1>
          <p className="text-gray-600 mt-1">Express yourself through encrypted visual art</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                      index <= activeStep
                        ? 'bg-[#0084D1] text-white shadow-lg shadow-[#0084D1]/20'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {index < activeStep ? '✓' : step.icon}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    index <= activeStep ? 'text-[#0084D1]' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-3 rounded ${
                    index < activeStep ? 'bg-[#0084D1]' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <span className="text-red-500">⚠️</span>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step 1: Message */}
          {activeStep === 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0084D1]/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✍️</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">What's your message?</h2>
                  <p className="text-gray-600 text-sm">Write something that will be hidden in your art</p>
                </div>
              </div>
              
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter your secret message..."
                rows={8}
                maxLength={500}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent resize-none bg-gray-50 focus:bg-white transition-all outline-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Only visible with the secret key</p>
                <p className="text-sm text-gray-500">{formData.message.length}/500</p>
              </div>
            </div>
          )}

          {/* Step 2: Emotion */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0084D1]/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💫</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Choose an emotion</h2>
                  <p className="text-gray-600 text-sm">This will influence the art's colors and style</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EMOTIONS.map((emotion) => (
                  <button
                    key={emotion.id}
                    onClick={() => handleEmotionSelect(emotion.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.emotion === emotion.id
                        ? 'border-[#0084D1] bg-[#0084D1]/5 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{emotion.icon}</span>
                    <span className={`font-medium ${
                      formData.emotion === emotion.id ? 'text-[#0084D1]' : 'text-gray-900'
                    }`}>
                      {emotion.label}
                    </span>
                    <div 
                      className="w-full h-1 rounded mt-2"
                      style={{ backgroundColor: emotion.color }}
                    ></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Secret Key & Hint */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0084D1]/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Set your secret key</h2>
                  <p className="text-gray-600 text-sm">Others will need this to unlock your message</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.secretKey}
                    onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                    placeholder="Enter your secret key"
                    className="w-full px-4 py-3.5 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none bg-white"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔑
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hint <span className="text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.hint}
                    onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                    placeholder="e.g., My favorite color"
                    maxLength={100}
                    className="w-full px-4 py-3.5 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none bg-white"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    💡
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">{formData.hint.length}/100 characters</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-800 text-sm">
                  <strong>Remember:</strong> Keep your secret key safe! Share it only with those you want to unlock your message.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0084D1]/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👁️</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Preview your art</h2>
                  <p className="text-gray-600 text-sm">This is how your art will appear in the gallery</p>
                </div>
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-w-md mx-auto">
                {/* Pattern */}
                <div className="aspect-4/3 relative">
                  {formData.pattern && (
                    <img 
                      src={formData.pattern} 
                      alt="Generated pattern" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3 right-3">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${selectedEmotion?.color}20`,
                        color: selectedEmotion?.color 
                      }}
                    >
                      {selectedEmotion?.icon} {selectedEmotion?.label}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      Y
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">You</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>

                  {formData.hint && (
                    <p className="text-sm text-gray-500 italic">💡 {formData.hint}</p>
                  )}

                  <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <span>🤍</span> 0
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <span>🔓</span> 0
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <span>💬</span> 0
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Message Length</p>
                  <p className="font-semibold text-gray-900">{formData.message.length} characters</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Encryption</p>
                  <p className="font-semibold text-gray-900">AES-256</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-sm">
                  Your message is encrypted and can only be unlocked with your secret key.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                activeStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>←</span>
              <span>Back</span>
            </button>

            {activeStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-[#0084D1] text-white rounded-xl font-medium hover:bg-[#0070B8] transition-colors shadow-lg shadow-[#0084D1]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Art</span>
                    <span>✨</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-[#0084D1] text-white rounded-xl font-medium hover:bg-[#0070B8] transition-colors shadow-lg shadow-[#0084D1]/20"
              >
                <span>Continue</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArt;
