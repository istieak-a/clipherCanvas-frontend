import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import artService from '../utils/artService';

const UnlockModal = ({ open, onClose, art, onSuccess }) => {
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unlockedMessage, setUnlockedMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

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
      const response = await artService.unlockArtPost(art.id, secretKey);
      
      if (response.success) {
        setUnlockedMessage(response.message);
        setShowMessage(true);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || 'Incorrect secret key. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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

            {/* Art Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{art.userAvatar}</span>
                <div>
                  <p className="font-semibold text-gray-900">{art.userName}</p>
                  <p className="text-sm text-gray-500">@{art.userUsername}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">{art.emotionIcon}</span>
                <span className="text-gray-700">{art.emotionLabel}</span>
              </div>
            </div>

            {/* Hint */}
            {art.hint && art.hint !== 'No hint provided' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-1">💡 Hint:</p>
                <p className="text-blue-800 italic">{art.hint}</p>
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
            <div className="bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-lg p-6 text-white shadow-lg">
              <p className="text-sm font-semibold mb-2 opacity-90">Secret Message:</p>
              <p className="text-lg leading-relaxed">{unlockedMessage}</p>
            </div>

            {/* Art Info */}
            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-2">
              <span className="text-2xl">{art.emotionIcon}</span>
              <div>
                <p className="text-sm text-gray-500">Emotion</p>
                <p className="font-semibold text-gray-900">{art.emotionLabel}</p>
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
            onClick={handleClose}
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
