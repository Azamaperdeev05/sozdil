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

const EndGameModal: React.FC<EndGameModalProps> = ({
  status,
  solution,
  guesses,
  guessStatuses,
  gameNumber,
  onShare,
  onClose,
}) => {
  const guessCount = status === 'WON' ? guesses.length : 'X';
  const emojiGrid = guessStatuses
    .map((row) =>
      row.map((s) => (s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬛')).join('')
    )
    .join('\n');
  const shareText = `Сөзділ #${gameNumber} ${guessCount}/${MAX_GUESSES}\n\n${emojiGrid}\n\n${APP_URL}`;

  const handleShare = () => {
    navigator.clipboard.writeText(shareText).then(onShare);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(APP_URL)}&text=${encodeURIComponent(`Сөзділ #${gameNumber} ${guessCount}/${MAX_GUESSES}\n\n${emojiGrid}`)}`;

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
          {guessStatuses.map((statuses, i) => (
            <ShareRow key={i} statuses={statuses} />
          ))}
        </div>
        <p className="text-lg">
          Жасырын сөз: <strong className="text-xl text-correct tracking-widest">{solution}</strong>
        </p>

        <div className="space-y-3 pt-4 border-t border-border mt-4">
          <Countdown />

          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-sm shadow-md active:scale-95"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              WhatsApp
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#229ED9] hover:bg-[#1f8ec3] text-white font-bold py-3 px-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-sm shadow-md active:scale-95"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.34-.674.34l.211-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.833.877z" />
              </svg>
              Telegram
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              href={`https://sozdikqor.kz/search?q=${solution.charAt(0).toUpperCase() + solution.slice(1).toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface hover:bg-border text-text font-bold py-3 px-3 rounded-xl transition-colors w-full flex items-center justify-center gap-2 text-center text-sm border border-border"
            >
              {UI_MESSAGES.WORD_DEFINITION}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804V4.804A7.968 7.968 0 0014.5 4z" />
              </svg>
            </a>
            <button
              onClick={handleShare}
              className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-3 rounded-xl transition-colors w-full flex items-center justify-center gap-2 text-sm"
            >
              {UI_MESSAGES.SHARE_TEXT}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
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
