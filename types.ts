
export interface Story {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  location?: string;
  weather?: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  mobileNumber: string; // Private
  profilePicture: string;
  daysWritten: number;
}

export enum View {
  Home = 'HOME',
  Profile = 'PROFILE',
}
