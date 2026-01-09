
import React from 'react';
import { User, View } from '../types';
import { PencilSquareIcon, HomeIcon } from './Icons';

interface HeaderProps {
    user: User | null;
    onWrite: () => void;
    onNavigate: (view: View) => void;
    hasWrittenToday: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onWrite, onNavigate, hasWrittenToday }) => {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-zinc-700">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate(View.Home)}>
                       <div className="flex items-center space-x-2">
                        <HomeIcon className="w-7 h-7 text-zinc-400" />
                        <h1 className="text-xl font-bold text-zinc-100 hidden sm:block">Daily Stories</h1>
                       </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-zinc-300">{today}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <>
                                <button
                                    onClick={onWrite}
                                    disabled={hasWrittenToday}
                                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                                        hasWrittenToday
                                            ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500'
                                    }`}
                                >
                                    <PencilSquareIcon className="w-5 h-5" />
                                    <span className="hidden sm:inline">Write Story</span>
                                </button>
                                <button onClick={() => onNavigate(View.Profile)} className="flex-shrink-0">
                                    <img src={user.profilePicture} alt="Profile" className="w-10 h-10 rounded-full border-2 border-zinc-600 hover:border-indigo-500 transition-colors" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
