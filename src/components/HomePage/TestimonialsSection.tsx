import { FC } from 'react';
import { Star, Quote } from 'lucide-react';
import { ContentBox } from '../ContentBox';
import { GlassPanel } from '../GlassPanel';

const TESTIMONIALS = [
  {
    name: 'CryptoRaider',
    avatar: '/assets/pandas/happypanda.PNG',
    role: 'Guild Leader',
    quote: 'The raid boss battles are incredibly engaging. Love teaming up with other raiders!',
    rating: 5
  },
  {
    name: 'NFTHunter',
    avatar: '/assets/pandas/nestledpanda.PNG',
    role: 'Veteran Player',
    quote: 'Best NFT gaming experience on Solana. The community is amazing!',
    rating: 5
  },
  {
    name: 'PandaWarrior',
    avatar: '/assets/pandas/sittingpanda.PNG',
    role: 'Top Raider',
    quote: 'The rewards system is fantastic. Every raid feels worthwhile.',
    rating: 5
  }
];

export const TestimonialsSection: FC = () => {
  return (
    <ContentBox>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-title 
                     bg-gradient-to-r from-primary-main to-primary-light dark:from-orange-400 dark:to-orange-500 
                     bg-clip-text text-transparent">
          Player Stories
        </h2>
        <p className="text-xl text-text-light-secondary dark:text-orange-300">
          Hear from our community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TESTIMONIALS.map((testimonial) => (
          <GlassPanel key={testimonial.name} className="relative">
            <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-main/20" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-main/20">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                <p className="text-sm text-primary-main">{testimonial.role}</p>
              </div>
            </div>

            <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
              "{testimonial.quote}"
            </p>

            <div className="flex gap-1">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-primary-main" fill="currentColor" />
              ))}
            </div>
          </GlassPanel>
        ))}
      </div>
    </ContentBox>
  );
};