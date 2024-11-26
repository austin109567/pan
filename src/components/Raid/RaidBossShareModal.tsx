import { FC, useEffect, useRef } from 'react';
import { X, Share2 } from 'lucide-react';
import { RaidState } from '../../types/raid';

interface RaidBossShareModalProps {
  raid: RaidState;
  participated: boolean;
  onClose: () => void;
}

export const RaidBossShareModal: FC<RaidBossShareModalProps> = ({ raid, participated, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const createShareImage = async () => {
      canvas.width = 1200;
      canvas.height = 630;

      // Background
      ctx.fillStyle = '#1A1B23';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      try {
        // Load and draw raid boss image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = raid.boss.imageUrl;
        });

        // Draw raid boss image with gradient overlay
        ctx.drawImage(img, 0, 0, canvas.width / 2, canvas.height);
        
        // Add gradient overlay
        const gradient = ctx.createLinearGradient(canvas.width / 2 - 200, 0, canvas.width / 2, 0);
        gradient.addColorStop(0, 'rgba(26, 27, 35, 0)');
        gradient.addColorStop(1, 'rgba(26, 27, 35, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(canvas.width / 2 - 200, 0, 200, canvas.height);

        // Draw text content
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 64px sans-serif';
        ctx.fillText('Raid Boss Defeated!', canvas.width / 2 + 40, 100);

        ctx.font = 'bold 48px sans-serif';
        ctx.fillText(raid.boss.name, canvas.width / 2 + 40, 180);

        ctx.font = '32px sans-serif';
        ctx.fillStyle = '#D24985';
        ctx.fillText(`${raid.boss.rewards.xp.toLocaleString()} XP Reward`, canvas.width / 2 + 40, 240);

        if (participated) {
          ctx.fillStyle = '#4CAF50';
          ctx.font = 'bold 36px sans-serif';
          ctx.fillText('✓ I Participated in this Raid!', canvas.width / 2 + 40, 300);
        }

        // Draw stats
        ctx.font = '24px sans-serif';
        ctx.fillStyle = '#9071A8';
        ctx.fillText(`${raid.participants.length} Raiders`, canvas.width / 2 + 40, 360);
        ctx.fillText(`${raid.questCompletions} Quests Completed`, canvas.width / 2 + 40, 400);
      } catch (error) {
        console.error('Error creating share image:', error);
      }
    };

    createShareImage();
  }, [raid, participated]);

  const handleShare = async () => {
    if (!canvasRef.current) return;

    try {
      const imageData = canvasRef.current.toDataURL('image/png');
      const text = participated 
        ? `I helped defeat the #RaidBoss ${raid.boss.name} on @KibalzXYZ! 🐼⚔️`
        : `The #RaidBoss ${raid.boss.name} has been defeated on @KibalzXYZ! 🐼⚔️`;

      // Open Twitter share dialog
      const shareUrl = new URL('https://twitter.com/intent/tweet');
      shareUrl.searchParams.append('text', text);
      
      // Open in new window
      window.open(shareUrl.toString(), '_blank', 'width=550,height=420');
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-neutral-charcoal/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-[#1A1B23] rounded-xl border border-primary-pink/20 p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Share Victory</h3>
          <button
            onClick={onClose}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="aspect-[1200/630] w-full rounded-lg overflow-hidden mb-6">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A8CD8] transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share on Twitter
          </button>
        </div>
      </div>
    </div>
  );
};