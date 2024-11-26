import { FC, useState, useRef } from 'react';
import { Upload, X, Twitter, Plus, Trash2 } from 'lucide-react';
import { RaidState } from '../../types/raid';
import { raidService } from '../../services/raidService';

interface RaidQuest {
  description: string;
  xpReward: number;
}

interface RaidBossFormProps {
  raid?: RaidState;
  onComplete?: () => void;
}

export const RaidBossForm: FC<RaidBossFormProps> = ({ raid, onComplete }) => {
  const [name, setName] = useState(raid?.boss.name || '');
  const [description, setDescription] = useState(raid?.boss.description || '');
  const [twitterHandle, setTwitterHandle] = useState(raid?.boss.twitterHandle || '');
  const [baseHp, setBaseHp] = useState('1000');
  const [defense, setDefense] = useState(raid?.boss.defense?.toString() || '');
  const [xpReward, setXpReward] = useState(raid?.boss.rewards.xp.toString() || '1000');
  const [bonusXp, setBonusXp] = useState(raid?.boss.rewards.bonusXp?.toString() || '500');
  const [imagePreview, setImagePreview] = useState<string | null>(raid?.boss.imageUrl || null);
  const [quests, setQuests] = useState<RaidQuest[]>(raid?.boss.quests || []);
  const [error, setError] = useState('');
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addQuest = () => {
    setQuests([...quests, { description: '', xpReward: 100 }]);
  };

  const removeQuest = (index: number) => {
    setQuests(quests.filter((_, i) => i !== index));
  };

  const updateQuest = (index: number, field: keyof RaidQuest, value: string | number) => {
    const updatedQuests = [...quests];
    updatedQuests[index] = {
      ...updatedQuests[index],
      [field]: value
    };
    setQuests(updatedQuests);
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (!baseHp || isNaN(Number(baseHp)) || Number(baseHp) <= 0) {
      setError('Valid base HP value is required');
      return;
    }

    if (defense && (isNaN(Number(defense)) || Number(defense) < 0)) {
      setError('Defense value must be a positive number');
      return;
    }

    if (!xpReward || isNaN(Number(xpReward)) || Number(xpReward) <= 0) {
      setError('Valid XP reward is required');
      return;
    }

    setError('');

    // Create raid boss with minimal fields
    const raidBossData = {
      boss_name: name.trim(),
      boss_description: description.trim(),
      boss_health: Number(baseHp),
      boss_max_health: Number(baseHp),
      boss_xp_reward: Number(xpReward),
      state: 'preparing'
    };

    try {
      if (raid) {
        await raidService.updateRaidBoss(raid.id, raidBossData);
      } else {
        const result = await raidService.createRaidBoss(raidBossData);
        console.log('Created raid boss:', result);
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      console.error('Error saving raid boss:', err);
      setError(err.message || 'Failed to save raid boss');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column - Image Upload and Quests */}
      <div className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Raid Boss Image <span className="text-neutral-lightGray">(Optional)</span>
          </label>
          <div className="border-2 border-dashed border-primary-pink/20 rounded-lg p-4">
            {imagePreview ? (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="Raid boss preview"
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

        {/* Quests Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-200">
              Raid Boss Quests <span className="text-red-400">*</span>
            </label>
            <button
              onClick={addQuest}
              className="flex items-center gap-2 px-3 py-1 bg-primary-pink/20 text-primary-pink rounded-lg hover:bg-primary-pink/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Quest
            </button>
          </div>

          <div className="space-y-4">
            {quests.map((quest, index) => (
              <div key={index} className="bg-black/40 rounded-lg p-4 border border-primary-pink/20">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-white font-medium">Quest #{index + 1}</h4>
                  <button
                    onClick={() => removeQuest(index)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Description</label>
                    <textarea
                      value={quest.description}
                      onChange={(e) => updateQuest(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40"
                      placeholder="Enter quest description..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">XP Reward</label>
                    <input
                      type="number"
                      value={quest.xpReward}
                      onChange={(e) => updateQuest(index, 'xpReward', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40"
                      placeholder="Enter XP reward..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Raid Boss Details */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40"
            placeholder="Enter raid boss name..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40 min-h-[100px]"
            placeholder="Enter raid boss description..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Twitter Handle <span className="text-neutral-lightGray">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40"
              placeholder="@username"
            />
            <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Base HP <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={baseHp}
              onChange={(e) => setBaseHp(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40"
              placeholder="Enter base HP..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Defense <span className="text-neutral-lightGray">(Optional)</span>
              <span className="block text-xs text-neutral-lightGray">+10 HP per point</span>
            </label>
            <input
              type="number"
              value={defense}
              onChange={(e) => setDefense(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40"
              placeholder="Enter defense value..."
            />
          </div>
        </div>

        {/* XP Rewards */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Base XP Reward <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={xpReward}
              onChange={(e) => setXpReward(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40"
              placeholder="Enter XP reward..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Completion Bonus XP <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={bonusXp}
              onChange={(e) => setBonusXp(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40"
              placeholder="Enter bonus XP..."
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <div className="text-xs text-neutral-lightGray mb-4">
          <span className="text-red-400">*</span> Required fields
        </div>

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-colors"
        >
          {raid ? 'Update Raid Boss' : 'Create Raid Boss'}
        </button>
      </div>
    </div>
  );
};