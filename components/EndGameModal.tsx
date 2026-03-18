import React from 'react';
import Modal from './Modal';
import Countdown from './Countdown';
import { LetterStatus, GameStatus } from '../types';
import { MAX_GUESSES, APP_URL, UI_MESSAGES } from '../constants';

const ShareTile: React.FC<{ status: LetterStatus }> = ({ status }) => {
  const statusClasses: Record<LetterStatus, string> = {
    correct: 'bg-correct',
    present: 'bg-present',
    absent: 'bg-absent',
    default: 'bg-surface',
  };
  return <div className={`w-full aspect-square rounded-sm ${statusClasses[status]}`} />;
};

const ShareRow: React.FC<{ statuses: LetterStatus[] }> = ({ statuses }) => {
  const cols: Record<number, string> = { 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' };
  return (
    <div className={`grid ${cols[statuses.length] ?? 'grid-cols-6'} gap-1`}>
      {statuses.map((s, i) => <ShareTile key={i} status={s} />)}
    </div>
  );
};

interface EndGameModalProps {
  status: GameStatus;
  solution: string;
  guesses: string[];
  guessStatuses: LetterStatus[][];
  gameNumber: number;
  onShare: () => void;
  onClose: () => void;
}

const EndGameModal: React.FC<EndGameModalProps> = ({ status, solution, guesses, guessStatuses, gameNumber, onShare, onClose }) => {
  const handleShare = () => {
    const guessCount = status === 'WON' ? guesses.length : 'X';
    const emojiGrid = guessStatuses.map(row =>
      row.map(s => s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬛').join('')
    ).join('\n');
    navigator.clipboard
      .writeText(`Сөзділ ${gameNumber} ${guessCount}/${MAX_GUESSES}\n\n${emojiGrid}\n\n${APP_URL}`)
      .then(onShare);
  };

  return (
    <Modal title="" onClose={onClose}>
      <div className="text-center space-y-4">
        {status === 'WON' && (
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-correct/10 rounded-full flex items-center justify-center">
              <svg className="h-10 w-10 text-correct" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
        <h2 className="text-2xl font-bold font-display text-center -mt-2">
          {status === 'WON' ? UI_MESSAGES.GAME_WON : UI_MESSAGES.GAME_LOST}
        </h2>
        <div className="flex flex-col gap-1 w-full max-w-[240px] mx-auto my-4">
          {guessStatuses.map((statuses, i) => <ShareRow key={i} statuses={statuses} />)}
        </div>
        <p className="text-lg">
          Жасырын сөз: <strong className="text-xl text-correct tracking-widest">{solution}</strong>
        </p>
        <div className="space-y-4 pt-4 border-t border-border mt-4">
          <Countdown />
          <div className="grid grid-cols-2 gap-4">
            <a
              href={`https://sozdikqor.kz/search?q=${solution.charAt(0).toUpperCase() + solution.slice(1).toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface hover:bg-border text-text font-bold py-4 px-4 rounded-xl transition-colors w-full flex items-center justify-center gap-2 text-center"
            >
              {UI_MESSAGES.WORD_DEFINITION}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804V4.804A7.968 7.968 0 0014.5 4z" />
              </svg>
            </a>
            <button
              onClick={handleShare}
              className="bg-accent hover:bg-accent/90 text-white font-bold py-4 px-4 rounded-xl transition-colors w-full flex items-center justify-center gap-2"
            >
              {UI_MESSAGES.SHARE_TEXT}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EndGameModal;
