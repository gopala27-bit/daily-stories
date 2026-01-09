
import React, { useState, useEffect, useMemo } from 'react';
import { Story, User, View } from './types';
import Header from './components/Header';
import StoryFeed from './components/StoryFeed';
import WriteStoryModal from './components/WriteStoryModal';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import * as api from './api';

const App: React.FC = () => {
    const [view, setView] = useState<View>(View.Home);
    const [stories, setStories] = useState<Story[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isWriting, setIsWriting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserSession = async () => {
            const sessionUser = await api.getLoggedInUser();
            if (sessionUser) {
                setUser(sessionUser);
                const fetchedStories = await api.getTodaysStories();
                setStories(fetchedStories);
            }
            setIsLoading(false);
        };
        checkUserSession();
    }, []);

    const isToday = (someDate: Date) => {
        const today = new Date();
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear();
    };
    
    const todaysStories = useMemo(() => {
        return stories.filter(story => isToday(new Date(story.timestamp)));
    }, [stories]);

    const hasWrittenToday = useMemo(() => {
        if (!user) return false;
        return todaysStories.some(story => story.author === `${user.name.split(' ')[0]} ${user.name.split(' ').length > 1 ? user.name.split(' ')[1][0] + '.' : ''}`);
    }, [todaysStories, user]);


    const handleLogin = async (loggedInUser: User) => {
        setUser(loggedInUser);
        setView(View.Home);
        const fetchedStories = await api.getTodaysStories();
        setStories(fetchedStories);
    };

    const handleLogout = async () => {
        await api.logout();
        setUser(null);
        setStories([]);
        setView(View.Home);
    };

    const handleAddStory = async (content: string) => {
        if (!user) return;

        setIsWriting(false);
        const newStory = await api.addStory(content, user);
        
        setStories(prevStories => [...prevStories, newStory]);
        
        const updatedUser = await api.getLoggedInUser();
        if (updatedUser) {
            setUser(updatedUser);
        }
    };

    const renderView = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-[60vh]">
                    <p className="text-zinc-400">Initializing...</p>
                </div>
            );
        }

        if (!user) {
            return <AuthPage onLogin={handleLogin} />;
        }
        switch (view) {
            case View.Profile:
                return <ProfilePage user={user} onLogout={handleLogout} />;
            case View.Home:
            default:
                return <StoryFeed stories={todaysStories} />;
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans">
            <Header
                user={user}
                onWrite={() => setIsWriting(true)}
                onNavigate={setView}
                hasWrittenToday={hasWrittenToday}
            />
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderView()}
            </main>
            {isWriting && (
                <WriteStoryModal
                    onClose={() => setIsWriting(false)}
                    onSubmit={handleAddStory}
                />
            )}
        </div>
    );
};

export default App;
