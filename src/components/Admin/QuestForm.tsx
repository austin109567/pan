import { FC, useState, useRef } from 'react';
import { Calendar, Clock, Trophy, Upload, X } from 'lucide-react';
import { Quest } from '../../types/quest';
import { questService } from '../../services/questService';

interface QuestFormProps {
  quest?: Quest;
  onSubmit?: (quest: Quest) => void;
  isEditing?: boolean;
}

export const QuestForm: FC<QuestFormProps> = ({ quest, onSubmit, isEditing }) => {
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly'>(quest?.type || 'daily');
  const [title, setTitle] = useState(quest?.title || '');
  const [description, setDescription] = useState(quest?.description || '');
  const [xpReward, setXpReward] = useState(quest?.xpReward.toString() || '100');
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState(quest?.imageUrl || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (!xpReward || isNaN(Number(xpReward)) || Number(xpReward) <= 0) {
      setError('Valid XP reward is required');
      return;
    }

    const questData = {
      id: quest?.id || '',
      title: title.trim(),
      type,
      description: description.trim(),
      xpReward: Number(xpReward),
      imageUrl: imagePreview || imageUrl || undefined,
      dateCreated: quest?.dateCreated || Date.now(),
      dateAvailable: Date.now(),
      dateExpires: Date.now() + (
        type === 'daily' ? 24 * 60 * 60 * 1000 :
        type === 'weekly' ? 7 * 24 * 60 * 60 * 1000 :
        30 * 24 * 60 * 60 * 1000
      ),
      status: 'available',
      completedBy: quest?.completedBy || []
    };

    try {
      if (isEditing && onSubmit) {
        onSubmit(questData as Quest);
      } else {
        const newQuest = await questService.createQuest(questData);
        if (onSubmit) {
          onSubmit(newQuest);
        }
      }

      // Reset form if not editing
      if (!isEditing) {
        setTitle('');
        setDescription('');
        setXpReward('100');
        setError('');
        removeImage();
      }
    } catch (error) {
      console.error('Error creating quest:', error);
      setError('Failed to create quest. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image Upload Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Quest Image (Optional)
          </label>
          <div className="border-2 border-dashed border-primary-pink/20 rounded-lg p-4">
            {imagePreview || imageUrl ? (
              <div className="space-y-4">
                <img
                  src={imagePreview || imageUrl}
                  alt="Quest preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={removeImage}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Remove Image
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <Upload className="w-8 h-8 text-primary-pink mb-2" />
                <span className="text-sm text-gray-400">
                  Click to upload or drag and drop
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Quest Details Section */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Quest Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-pink"
            placeholder="Enter quest title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Quest Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setType('daily')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                type === 'daily'
                  ? 'bg-primary-pink text-white'
                  : 'text-gray-400 hover:bg-primary-pink/10 hover:text-primary-pink'
              }`}
            >
              <Clock className="w-4 h-4" />
              Daily
            </button>
            <button
              onClick={() => setType('weekly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                type === 'weekly'
                  ? 'bg-primary-pink text-white'
                  : 'text-gray-400 hover:bg-primary-pink/10 hover:text-primary-pink'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Weekly
            </button>
            <button
              onClick={() => setType('monthly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                type === 'monthly'
                  ? 'bg-primary-pink text-white'
                  : 'text-gray-400 hover:bg-primary-pink/10 hover:text-primary-pink'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Monthly
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40 min-h-[100px]"
            placeholder="Enter quest description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            XP Reward
          </label>
          <input
            type="number"
            value={xpReward}
            onChange={(e) => setXpReward(e.target.value)}
            className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40"
            placeholder="Enter XP reward..."
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-colors"
        >
          {isEditing ? 'Update Quest' : 'Create Quest'}
        </button>
      </div>
    </div>
  );
};