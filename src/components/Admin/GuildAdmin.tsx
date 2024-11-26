import { FC, useState, useRef } from 'react';
import { Edit2, Save, X, Upload, Plus, Trash2, UserPlus } from 'lucide-react';
import { Guild, GuildArchetype } from '../../types/guild';
import { guildService } from '../../services/guildService';
import { useWallet } from '@solana/wallet-adapter-react';

const ADMIN_WALLET = "8jN1XtgiuWeyNjzysYVqGZ1mPAG37sjmuCTnENz66wrs";

interface NewGuildForm {
  name: string;
  description: string;
  imageUrl?: string;
  archetype: GuildArchetype;
}

export const GuildAdmin: FC = () => {
  const { publicKey } = useWallet();
  const [editingGuildId, setEditingGuildId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Guild>>({});
  const [showAddGuildModal, setShowAddGuildModal] = useState(false);
  const [newGuildForm, setNewGuildForm] = useState<NewGuildForm>({
    name: '',
    description: '',
    archetype: 'Adventurer'
  });
  const [showAddLeaderModal, setShowAddLeaderModal] = useState(false);
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [leaderWallet, setLeaderWallet] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if current user is admin
  if (!publicKey || publicKey.toString() !== ADMIN_WALLET) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-neutral-lightGray">
            Only the project admin can access guild administration.
          </p>
        </div>
      </div>
    );
  }

  const guilds = guildService.getCommunityGuilds() || [];

  const handleEdit = (guild: Guild) => {
    setEditingGuildId(guild.id);
    setEditForm(guild);
  };

  const handleSave = () => {
    if (!editingGuildId || !editForm) return;

    guildService.updateGuild(editingGuildId, editForm);
    setEditingGuildId(null);
    setEditForm({});
    showSuccessMessage('Guild updated successfully!');
  };

  const handleDelete = (guildId: string) => {
    if (confirm('Are you sure you want to delete this guild?')) {
      guildService.updateGuild(guildId, { isDeleted: true });
      showSuccessMessage('Guild deleted successfully!');
    }
  };

  const handleAddLeader = () => {
    if (!selectedGuildId || !leaderWallet) return;

    const guild = guildService.getGuildById(selectedGuildId);
    if (guild) {
      const updatedLeaders = [...(guild.leaders || []), leaderWallet];
      const success = guildService.updateGuild(selectedGuildId, { leaders: updatedLeaders });
      
      if (success) {
        showSuccessMessage('Guild leader added successfully!');
        setShowAddLeaderModal(false);
        setSelectedGuildId(null);
        setLeaderWallet('');
      } else {
        setError('Failed to add guild leader');
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        if (editingGuildId) {
          setEditForm(prev => ({ ...prev, imageUrl: imageData }));
        } else {
          setNewGuildForm(prev => ({ ...prev, imageUrl: imageData }));
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading guild image:', error);
      setError('Failed to upload image');
    }
  };

  const handleAddGuild = () => {
    if (!newGuildForm.name || !newGuildForm.description) {
      setError('Name and description are required');
      return;
    }

    const newGuild = guildService.createGuild({
      name: newGuildForm.name,
      description: newGuildForm.description,
      imageUrl: newGuildForm.imageUrl,
      archetype: newGuildForm.archetype,
      leaders: [],
      isCore: false
    });

    if (newGuild) {
      setShowAddGuildModal(false);
      setNewGuildForm({
        name: '',
        description: '',
        archetype: 'Adventurer'
      });
      showSuccessMessage('Guild created successfully!');
    }
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Guild Administration</h2>
        <button
          onClick={() => setShowAddGuildModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Guild
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {guilds.map(guild => (
          <div
            key={guild.id}
            className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-primary-main/20"
          >
            {editingGuildId === guild.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-lightGray mb-2">
                    Guild Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-primary-main/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-lightGray mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-primary-main/20 rounded-lg text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-lightGray mb-2">
                    Archetype
                  </label>
                  <select
                    value={editForm.archetype || 'Adventurer'}
                    onChange={e => setEditForm({ ...editForm, archetype: e.target.value as GuildArchetype })}
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
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-black/40">
                      {editForm.imageUrl ? (
                        <img
                          src={editForm.imageUrl}
                          alt={editForm.name}
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

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingGuildId(null)}
                    className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="p-2 text-primary-main hover:text-primary-main/80 transition-colors rounded-lg hover:bg-primary-main/10"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={guild.imageUrl}
                        alt={guild.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{guild.name}</h3>
                      <p className="text-sm text-neutral-lightGray">
                        {guild.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedGuildId(guild.id);
                        setShowAddLeaderModal(true);
                      }}
                      className="p-2 text-primary-main hover:text-primary-main/80 transition-colors rounded-lg hover:bg-primary-main/10"
                      title="Add guild leader"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(guild)}
                      className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
                      title="Edit guild"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(guild.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-400/5"
                      title="Delete guild"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-neutral-lightGray mb-4">
                  {guild.description}
                </p>

                {guild.leaders && guild.leaders.length > 0 && (
                  <div className="text-sm text-neutral-lightGray">
                    Leaders: {guild.leaders.map(leader => 
                      leader.slice(0, 4) + '...' + leader.slice(-4)
                    ).join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Guild Modal */}
      {showAddGuildModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddGuildModal(false)}
          />
          <div className="relative bg-[#1A1B23] rounded-xl border border-primary-main/20 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Create New Guild</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-lightGray mb-2">
                  Guild Name
                </label>
                <input
                  type="text"
                  value={newGuildForm.name}
                  onChange={(e) => setNewGuildForm({ ...newGuildForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-black/40 border border-primary-main/20 rounded-lg text-white"
                  placeholder="Enter guild name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-lightGray mb-2">
                  Description
                </label>
                <textarea
                  value={newGuildForm.description}
                  onChange={(e) => setNewGuildForm({ ...newGuildForm, description: e.target.value })}
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
                  value={newGuildForm.archetype}
                  onChange={(e) => setNewGuildForm({ ...newGuildForm, archetype: e.target.value as GuildArchetype })}
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
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-black/40">
                    {newGuildForm.imageUrl ? (
                      <img
                        src={newGuildForm.imageUrl}
                        alt="New guild"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-neutral-lightGray" />
                      </div>
                    )}
                  </div>
                  <input
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

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowAddGuildModal(false)}
                  className="px-4 py-2 text-neutral-lightGray hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGuild}
                  className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors"
                >
                  Create Guild
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Leader Modal */}
      {showAddLeaderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddLeaderModal(false)}
          />
          <div className="relative bg-[#1A1B23] rounded-xl border border-primary-main/20 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Add Guild Leader</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={leaderWallet}
                onChange={(e) => setLeaderWallet(e.target.value)}
                placeholder="Enter wallet address"
                className="w-full px-4 py-2 bg-black/40 border border-primary-main/20 rounded-lg text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddLeaderModal(false)}
                  className="px-4 py-2 text-neutral-lightGray hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLeader}
                  className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors"
                >
                  Add Leader
                </button>
              </div>
            </div>
            {error && (
              <p className="mt-4 text-red-400 text-sm">{error}</p>
            )}
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg animate-fade-in">
          {successMessage}
        </div>
      )}
    </div>
  );
};