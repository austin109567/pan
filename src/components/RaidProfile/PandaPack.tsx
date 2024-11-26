import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Share2, ArrowLeft } from 'lucide-react';
import { guildQuestions } from '../../data/guildQuestions';
import { Guild, GuildArchetype, CORE_GUILDS } from '../../types/guild';
import { guildService } from '../../services/guildService';
import { playerService } from '../../services/playerService';

export const PandaPack: FC = () => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; archetype: GuildArchetype; }[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [assignedArchetype, setAssignedArchetype] = useState<GuildArchetype | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if user already has an archetype
  useEffect(() => {
    if (publicKey) {
      const player = playerService.getPlayer(publicKey.toString());
      if (player?.archetype) {
        navigate('/profile');
      }
    }
  }, [publicKey, navigate]);

  // Get 5 random questions
  const [questions] = useState(() => {
    const shuffled = [...guildQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  });

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (archetype: GuildArchetype) => {
    if (!publicKey) return;

    const newAnswers = [...answers, { questionId: currentQuestion.id, archetype }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Randomly select an archetype from the answers
      const randomIndex = Math.floor(Math.random() * newAnswers.length);
      const selectedArchetype = newAnswers[randomIndex].archetype;

      // Verify it's a valid core archetype
      const isValidArchetype = CORE_GUILDS.some(guild => guild.archetype === selectedArchetype);
      if (!isValidArchetype) {
        setError('Invalid archetype selected. Please try again.');
        return;
      }

      setAssignedArchetype(selectedArchetype);

      // Update player's archetype and guild
      const success = playerService.setArchetype(publicKey.toString(), selectedArchetype);
      if (success) {
        setShowCongrats(true);
      } else {
        setError('Failed to assign archetype. Please try again.');
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setAnswers(prev => prev.slice(0, -1));
    }
  };

  const handleShareToTwitter = () => {
    if (!assignedArchetype) return;
    
    const text = `I just joined the ${assignedArchetype} archetype on @PanDaPan! 🐼✨`;
    const url = 'https://pandapan.xyz';
    
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="gradient-box p-8">
        {showCongrats && assignedArchetype ? (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-primary-main mb-4">
              <img
                src={`/assets/archetypes/${assignedArchetype.toLowerCase()}.png`}
                alt={assignedArchetype}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h4 className="text-2xl font-bold text-white mb-2">
                Welcome to the {assignedArchetype} Archetype!
              </h4>
              <p className="text-neutral-lightGray">
                Your journey as a {assignedArchetype} begins now. Share your new path with others!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleShareToTwitter}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A8CD8] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share on Twitter
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="text-center mb-8">
              <p className="text-sm text-neutral-lightGray">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <div className="w-full bg-primary-main/20 h-1 rounded-full mt-2">
                <div 
                  className="h-full bg-primary-main rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-lg text-white text-center px-4">
              {currentQuestion.question}
            </p>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(choice.archetype)}
                  className="w-full px-6 py-4 bg-black/40 border border-primary-main/20 rounded-lg text-white hover:bg-primary-main/10 hover:border-primary-main/40 transition-all text-left active:scale-[0.98]"
                >
                  {choice.text}
                </button>
              ))}
            </div>

            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePreviousQuestion}
                className="flex items-center gap-2 text-neutral-lightGray hover:text-white transition-colors mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Question
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};