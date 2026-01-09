
import React from 'react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl shadow-lg p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
        <img
          src={user.profilePicture}
          alt={user.name}
          className="w-32 h-32 rounded-full border-4 border-zinc-600"
        />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-white">{user.name}</h1>
          <p className="text-zinc-400 mt-1">{user.location}</p>
          <div className="mt-6 border-t border-zinc-700 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-zinc-400">Age</dt>
                <dd className="mt-1 text-lg text-white">{user.age}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-zinc-400">Gender</dt>
                <dd className="mt-1 text-lg text-white">{user.gender}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-zinc-400">Mobile Number</dt>
                <dd className="mt-1 text-lg text-white">{user.mobileNumber} (Private)</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-zinc-400">Days Written</dt>
                <dd className="mt-1 text-lg font-semibold text-indigo-400">{user.daysWritten}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={onLogout}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-500 transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
