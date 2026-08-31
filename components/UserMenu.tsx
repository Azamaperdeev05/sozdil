import React from 'react';
import type { User } from '../lib/authService';

interface UserMenuProps {
  user: User | null;
  isSyncing: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onProfile: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  isSyncing,
  onSignIn,
  onSignOut,
  onProfile,
}) => {
  if (isSyncing) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="3" opacity="0.3"
          />
          <path
            d="M4 12a8 8 0 018-8"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={onSignIn}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg
          bg-white/5 border border-border hover:bg-white/10
          transition-colors text-sm text-text"
        title="Google-мен кіру"
        aria-label="Google аккаунтымен кіру"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Кіру
      </button>
    );
  }

  // Кірген пайдаланушы — аватарды басу → профиль модалы
  return (
    <button
      type="button"
      onClick={onProfile}
      className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-accent/50 transition-all"
      title="Профиль"
      aria-label="Профиль параметрлері"
    >
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.displayName ?? "Пайдаланушы профилі"}
          className="h-8 w-8 rounded-full border border-border"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent">
          {(user.displayName ?? user.email ?? '?')[0].toUpperCase()}
        </div>
      )}
    </button>
  );
};

export default UserMenu;
