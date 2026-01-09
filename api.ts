
import { Story, User } from './types';

// This file acts as a mock backend API. In a real application, these functions
// would make network requests to a server.

const MOCK_USER: User = {
  id: 'user_1',
  name: 'Alex',
  age: 28,
  gender: 'Non-binary',
  location: 'San Francisco, CA',
  mobileNumber: '555-123-4567',
  profilePicture: 'https://picsum.photos/100',
  daysWritten: 12,
};

const getInitialStories = (): Story[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [
        {
            id: 'story_1',
            author: 'Jane D.',
            content: "The morning fog was thick today, clinging to the windows like a ghost. I drank my coffee black and watched the city slowly emerge from the mist. It felt like a day for secrets, a day for quiet contemplation. I walked to the park and saw an old man feeding pigeons, each one a tiny, fluttering piece of his past. He smiled at me, a genuine, crinkly-eyed smile that made me feel seen. In a world that often rushes past, that small moment of connection was everything. It reminded me that even on the grayest of days, there is warmth to be found.",
            timestamp: new Date(today.getTime() + 3 * 60 * 60 * 1000).toISOString(),
            location: 'Kyoto, Japan',
            weather: 'Foggy, 15°C',
        },
        {
            id: 'story_2',
            author: 'Carlos R.',
            content: "I finally fixed the leaky faucet. It’s a small victory, but it feels monumental. For weeks, the constant drip-drip-drip was the soundtrack to my life, a tiny, incessant reminder of procrastination. Today, with a wrench and a bit of YouTube-fueled confidence, I conquered it. The silence that followed was profound. I stood in the quiet kitchen, hands greasy and sore, feeling like a king in my own small kingdom. Sometimes, it’s not about changing the world, but about fixing your own small corner of it. Today, my corner is dry, and I am at peace.",
            timestamp: new Date(today.getTime() + 6 * 60 * 60 * 1000).toISOString(),
            location: 'Mexico City, Mexico',
            weather: 'Sunny, 24°C',
        },
        {
            id: 'story_3',
            author: 'Aisha K.',
            content: "My daughter lost her first tooth today. She was so brave, wiggling it with her tongue for days until it finally came loose in a slice of apple. Her gap-toothed grin is the most beautiful thing I’ve ever seen. We put the tooth in a tiny box for the 'tooth fairy.' She’s buzzing with an excitement that's infectious. Holding her small hand, I’m reminded of how quickly time passes, how these small, precious moments are the building blocks of a life. Tonight, I’ll be a fairy, and I’ll treasure the memory of this day forever. It was a day of small endings and magical new beginnings.",
            timestamp: new Date(today.getTime() + 9 * 60 * 60 * 1000).toISOString(),
            location: 'Lagos, Nigeria',
            weather: 'Partly Cloudy, 29°C',
        },
    ];
};


const FAKE_LATENCY = 500;

// Helper to manage user-submitted stories in localStorage
const getStoredUserStories = (): Story[] => {
    const stored = localStorage.getItem('daily-stories-user-submitted');
    return stored ? JSON.parse(stored) : [];
};

const addStoredStory = (story: Story) => {
    const stories = getStoredUserStories();
    localStorage.setItem('daily-stories-user-submitted', JSON.stringify([...stories, story]));
};

// --- API Functions ---

export const login = async (mobileNumber: string, otp: string): Promise<User> => {
    console.log(`Attempting login with mobile: ${mobileNumber}, otp: ${otp}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, you'd verify OTP and fetch user from DB
            localStorage.setItem('daily-stories-user', JSON.stringify(MOCK_USER));
            resolve(MOCK_USER);
        }, FAKE_LATENCY);
    });
};

export const logout = async (): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.removeItem('daily-stories-user');
            resolve();
        }, FAKE_LATENCY);
    });
};

export const getLoggedInUser = async (): Promise<User | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const storedUser = localStorage.getItem('daily-stories-user');
            resolve(storedUser ? JSON.parse(storedUser) : null);
        }, FAKE_LATENCY);
    });
};

export const getTodaysStories = async (): Promise<Story[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const initialStories = getInitialStories();
            const userStories = getStoredUserStories();
            resolve([...initialStories, ...userStories]);
        }, FAKE_LATENCY);
    });
};

export const addStory = async (content: string, user: User): Promise<Story> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newStory: Story = {
                id: `story_${new Date().getTime()}`,
                author: `${user.name.split(' ')[0]} ${user.name.split(' ').length > 1 ? user.name.split(' ')[1][0] + '.' : ''}`,
                content,
                timestamp: new Date().toISOString(),
                location: user.location.split(',')[0],
                weather: 'Clear, 22°C', // Mock weather
            };
            addStoredStory(newStory);
            
            const updatedUser = { ...user, daysWritten: user.daysWritten + 1 };
            localStorage.setItem('daily-stories-user', JSON.stringify(updatedUser));

            resolve(newStory);
        }, FAKE_LATENCY);
    });
};
