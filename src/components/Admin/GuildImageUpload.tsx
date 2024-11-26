import { FC, useRef } from 'react';
import { Upload } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

interface GuildImageUploadProps {
  currentImage?: string;
  onImageUpload: (imageData: string) => void;
}

export const GuildImageUpload: FC<GuildImageUploadProps> = ({ currentImage, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      const compressedImage = await compressImage(file);
      onImageUpload(compressedImage);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-lightGray mb-2">
        Guild Image
      </label>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-black/40">
          {currentImage ? (
            <img
              src={currentImage}
              alt="Guild"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-neutral-lightGray" />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-primary-main/20 text-primary-main rounded-lg hover:bg-primary-main/30 transition-colors"
        >
          Upload Image
        </button>
      </div>
    </div>
  );
}