import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CryptoJS from 'crypto-js';
import artService from '../utils/artService';
import { EMOTIONS } from '../utils/mockData';

const UnlockModal = ({ open, onClose, art, onSuccess }) => {
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unlockedMessage, setUnlockedMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  // Reset state when modal opens with new art
  useEffect(() => {
    if (open) {
      setSecretKey('');
      setError('');
      setUnlockedMessage('');
      setShowMessage(false);
    }
  }, [open, art?.id]);

  // Get emotion data - fallback to first emotion if not found
  const getEmotionData = () => {
    if (!art) return { icon: '🎨', label: 'Art' };
    
    // Try to find from EMOTIONS array using art.emotion (the ID)
    const emotionFromId = EMOTIONS.find(e => e.id === art.emotion);
    if (emotionFromId) {
      return { icon: emotionFromId.icon, label: emotionFromId.label };
    }
    
    // Fallback to art's own properties if available
    if (art.emotionIcon && art.emotionLabel) {
      return { icon: art.emotionIcon, label: art.emotionLabel };
    }
    
    return { icon: '🎨', label: 'Art' };
  };

  const emotionData = getEmotionData();

  const handleClose = () => {
    setSecretKey('');
    setError('');
    setUnlockedMessage('');
    setShowMessage(false);
    onClose();
  };

  const handleUnlock = async () => {
    if (!secretKey.trim()) {
      setError('Please enter a secret key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Decrypt the encrypted message using CryptoJS AES
      const decryptedBytes = CryptoJS.AES.decrypt(
        art.encryptedMessage,
        secretKey
      );
      
      const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
      // Check if decryption was successful
      if (!decryptedMessage || decryptedMessage.length === 0) {
        setError('Incorrect secret key. Please try again.');
        setLoading(false);
        return;
      }
      
      // Successfully decrypted - show the message FIRST
      setUnlockedMessage(decryptedMessage);
      setShowMessage(true);
      setLoading(false);
      
      // Then notify backend to track the unlock (don't await, fire and forget)
      artService.unlockArtPost(art.id, secretKey).catch(err => {
        console.warn('Could not track unlock:', err);
      });
      
      // Note: We call onSuccess when user CLOSES the modal after seeing the message
      // This prevents the modal from being reset while viewing the unlocked message
    } catch (err) {
      console.error('Decryption error:', err);
      setError('Incorrect secret key or corrupted data. Please try again.');
      setLoading(false);
    }
  };

  const handleCloseAfterSuccess = () => {
    // Call onSuccess to refresh data, then close
    if (onSuccess) {
      onSuccess();
    }
    handleClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleUnlock();
    }
  };

  if (!art) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔐</span>
          <span className="font-semibold">
            {showMessage ? 'Message Unlocked!' : 'Unlock Secret Message'}
          </span>
        </div>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {!showMessage ? (
          <div className="space-y-4">
            {/* Art Preview */}
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <img
                src={art.pattern}
                alt="Art preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Art Info with Emotion */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{art.userAvatar || '👤'}</span>
                <div>
                  <p className="font-semibold text-gray-900">{art.userName || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">@{art.userUsername || 'user'}</p>
                </div>
              </div>
              
              {/* Emotion Display - More prominent */}
              <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
                <span className="text-2xl">{emotionData.icon}</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Emotion</p>
                  <p className="font-medium text-gray-900">{emotionData.label}</p>
                </div>
              </div>
            </div>

            {/* Hint */}
            {art.hint && art.hint !== 'No hint provided' && art.hint.trim() !== '' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-amber-900 mb-1">💡 Hint:</p>
                <p className="text-amber-800 italic text-lg">{art.hint}</p>
              </div>
            )}

            {/* Secret Key Input */}
            <TextField
              autoFocus
              fullWidth
              label="Enter Secret Key"
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              onKeyPress={handleKeyPress}
              error={!!error}
              helperText={error}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#0084D1',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#0084D1',
                },
              }}
            />

            <p className="text-xs text-gray-500 text-center">
              Enter the secret key to reveal the hidden message
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Success Animation */}
            <div className="text-center py-4">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600">You've unlocked the secret message</p>
            </div>

            {/* Unlocked Message */}
            <div className="bg-gradient-to-br from-[#0084D1] to-[#0070B8] rounded-lg p-6 text-white shadow-lg">
              <p className="text-sm font-semibold mb-2 opacity-90">Secret Message:</p>
              <p className="text-lg leading-relaxed">{unlockedMessage}</p>
            </div>

            {/* Emotion Info */}
            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
              <span className="text-3xl">{emotionData.icon}</span>
              <div>
                <p className="text-sm text-gray-500">Emotion</p>
                <p className="font-semibold text-gray-900">{emotionData.label}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        {!showMessage ? (
          <>
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUnlock}
              disabled={loading}
              className="px-6 py-2 bg-[#0084D1] text-white rounded-lg hover:bg-[#0070B8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Unlocking...' : 'Unlock'}
            </button>
          </>
        ) : (
          <button
            onClick={handleCloseAfterSuccess}
            className="px-6 py-2 bg-[#0084D1] text-white rounded-lg hover:bg-[#0070B8] transition-colors"
          >
            Close
          </button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UnlockModal;
