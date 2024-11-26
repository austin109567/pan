import React, { FC, useRef, useState } from 'react';
import { playerService } from '../../services/playerService';
import { User } from 'lucide-react';

interface ProfileUploadProps {
  currentImageUrl?: string;
  walletAddress: string;
  onClose?: () => void;
  onUploadSuccess?: () => void;
}

export const ProfileUpload: FC<ProfileUploadProps> = ({
  currentImageUrl,
  walletAddress,
  onClose,
  onUploadSuccess
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    // 2MB max size for base64 storage
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const success = await playerService.updateProfilePicture(walletAddress, file);
      
      if (success) {
        if (onUploadSuccess) {
          onUploadSuccess();
        }
        setShowModal(false);
      } else {
        setError('Failed to upload profile picture. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError('Error uploading profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    setShowModal(true);
  };

  return (
    <>
      {/* Profile Picture Display/Button */}
      <button
        onClick={handleClick}
        className="w-full h-full group relative cursor-pointer"
      >
        {currentImageUrl ? (
          <div className="w-full h-full">
            <img
              src={currentImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUtdXNlciI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRINmE0IDQgMCAwIDAtNCA0djIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiLz48L3N2Zz4=';
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
            Change Picture
          </span>
        </div>
      </button>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Update Profile Picture
            </h3>
            
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>• Maximum file size: 2MB</p>
                <p>• Supported formats: JPG, PNG, GIF</p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </button>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                onClick={() => setShowModal(false)}
                disabled={isUploading}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};