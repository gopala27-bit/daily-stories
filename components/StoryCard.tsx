
import React from 'react';
import { Story } from '../types';
import { MapPinIcon, SunIcon, ClockIcon } from './Icons';

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const storyTime = new Date(story.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50">
      <div className="prose prose-invert prose-lg max-w-none text-zinc-300 whitespace-pre-wrap font-serif leading-relaxed">
        {story.content}
      </div>
      <div className="mt-6 pt-4 border-t border-zinc-700/50 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center space-x-4">
            {story.location && (
                <span className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1.5" />
                    {story.location}
                </span>
            )}
            {story.weather && (
                <span className="flex items-center">
                    <SunIcon className="w-4 h-4 mr-1.5" />
                    {story.weather}
                </span>
            )}
        </div>
        <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1.5" />
            <span>{storyTime} by {story.author}</span>
        </div>
      </div>
    </article>
  );
};

export default StoryCard;
