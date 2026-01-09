
import React, { useState } from 'react';

interface WriteStoryModalProps {
  onClose: () => void;
  onSubmit: (content: string) => void;
}

const WriteStoryModal: React.FC<WriteStoryModalProps> = ({ onClose, onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-zinc-100">Write your story for today</h2>
          <p className="text-sm text-zinc-400 mt-1">Focus on moments, feelings, or events that made today unique. This story will be part of today’s shared human experience.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Be honest. Be you..."
              className="w-full h-64 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none font-serif"
              autoFocus
            />
          </div>
          <div className="p-6 bg-zinc-800/50 rounded-b-xl flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-zinc-300 bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors"
            >
              Publish Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteStoryModal;
