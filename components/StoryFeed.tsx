
import React from 'react';
import { Story } from '../types';
import StoryCard from './StoryCard';

interface StoryFeedProps {
  stories: Story[];
}

const StoryFeed: React.FC<StoryFeedProps> = ({ stories }) => {
  return (
    <div className="space-y-8">
      {stories.length > 0 ? (
        stories
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .map(story => <StoryCard key={story.id} story={story} />)
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-zinc-400">No stories yet today.</h2>
          <p className="mt-2 text-zinc-500">Why not be the first to share?</p>
        </div>
      )}
    </div>
  );
};

export default StoryFeed;
