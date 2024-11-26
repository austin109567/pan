import { FC, useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { GuildArchetype } from '../../types/guild';
import { compressImage } from '../../utils/imageCompressor';

interface AddGuildModalProps {
  onClose: () => void;
  onSubmit: (formData: {
    name: string;
    description: string;
    imageUrl?: string;
    archetype: GuildArchetype;
  }) => void;
}

export const AddGuildModal: FC<AddGuildModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [archetype, setArchetype] = useState<GuildArchetype>('Adventurer');
  const [imageUrl, setImageUrl] = useState<string>();
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      const compressedImage = await compressImage(file);
      setImageUrl(compressedImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      imageUrl,
      archetype
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#1A1B23] rounded-xl border border-primary-main/20 p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Create New Guild</h3>
          <button
            onClick={onClose}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-lightGray mb-2">
              Guild Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-primary-main/20 rounded-lg text-white"
              placeholder="Enter guild name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-lightGray mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-primary-main/20 rounded-lg text-white"
              placeholder="Enter guild description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-lightGray mb-2">
              Archetype
            </label>
            <select
              value={archetype}
              onChange={(e) => setArchetype(e.target.value as GuildArchetype)}
              className="w-full px-4 py-2 bg-black/40 border border-primary-main/20 rounded-lg text-white"
            >
              <option value="Adventurer">Adventurer</option>
              <option value="Finance">Finance</option>
              <option value="Philanthropist">Philanthropist</option>
              <option value="PartyAnimal">Party Animal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-lightGray mb-2">
              Guild Image
            </label>
            <div className="border-2 border-dashed border-primary-main/20 rounded-lg p-4">
              {imageUrl ? (
                <div className="space-y-4">
                  <img
                    src={imageUrl}
                    alt="Guild preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setImageUrl(undefined)}
                    className="text-red-400 hover:text-red-300 transition-colors text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-primary-main mb-2" />
                  <span className="text-sm text-neutral-lightGray">
                    Click to upload or drag and drop
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-lightGray hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors"
            >
              Create Guild
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};