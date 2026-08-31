import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { getChallengeUrl } from '../lib/challenge';
import { loadWordsForLength } from '../lib/words';

interface ChallengeModalProps {
  onClose: () => void;
  initialLength?: number;
  onCopied?: () => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ onClose, initialLength = 5, onCopied }) => {
  const [length, setLength] = useState<number>(initialLength);
  const [word, setWord] = useState<string>('');
  const [dict, setDict] = useState<Set<string>>(new Set());
  const [isLoadingDict, setIsLoadingDict] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingDict(true);
    loadWordsForLength(length).then((words) => {
      if (isMounted) {
        setDict(new Set(words.map((w) => w.toUpperCase())));
        setIsLoadingDict(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [length]);

  const cleanWord = word.trim().toUpperCase();
  const isExactLength = cleanWord.length === length;
  const isValidWord = isExactLength && dict.has(cleanWord);
  const challengeUrl = isValidWord ? getChallengeUrl(cleanWord) : null;

  const handleCopy = () => {
    if (!challengeUrl) return;
    navigator.clipboard.writeText(challengeUrl).then(() => {
      setCopied(true);
      if (onCopied) onCopied();
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareText = challengeUrl
    ? `Мен саған Сөзділ ойынында жасырын ${length} әріптік сөз жасырдым! 🎯 Тауып көр:\n\n${challengeUrl}`
    : '';

  const whatsappUrl = challengeUrl
    ? `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
    : '';

  const telegramUrl = challengeUrl
    ? `https://t.me/share/url?url=${encodeURIComponent(challengeUrl)}&text=${encodeURIComponent(`Мен саған Сөзділ ойынында жасырын ${length} әріптік сөз жасырдым! 🎯 Тауып көр`)}`
    : '';

  return (
    <Modal title="Досыңа сөз жасыр ⚔️" onClose={onClose}>
      <div className="text-text space-y-4">
        <p className="text-sm text-muted text-center">
          Қазақша сөз жасырып, досыңызға шифрланған сілтеме жіберіңіз. Сөз сілтеме ішінде құпия сақталады!
        </p>

        {/* Length selector */}
        <div className="flex justify-center items-center gap-2">
          <span className="text-xs text-muted font-medium">Әріп саны:</span>
          <div className="flex rounded-lg bg-surface p-0.5 border border-border">
            {[4, 5, 6].map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => {
                  setLength(len);
                  setWord('');
                }}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  length === len ? 'bg-accent text-white shadow' : 'text-muted hover:text-text'
                }`}
              >
                {len} әріп
              </button>
            ))}
          </div>
        </div>

        {/* Word input */}
        <div className="space-y-1.5">
          <label htmlFor="challenge-word-input" className="block text-xs font-semibold text-muted text-center">
            Жасыратын {length} әріпті сөзді енгізіңіз:
          </label>
          <input
            id="challenge-word-input"
            type="text"
            maxLength={length}
            value={word}
            onChange={(e) => setWord(e.target.value.replace(/[^а-яА-ЯәіңғүұқөһӘІҢҒҮҰҚӨҺёЁ]/g, '').toUpperCase())}
            placeholder={`${length} әріп`}
            className="w-full bg-surface border-2 border-border focus:border-accent text-center text-xl font-bold tracking-widest py-3 px-4 rounded-xl outline-none transition-all placeholder:text-muted/40 uppercase"
            autoFocus
          />
        </div>

        {/* Live Validation status */}
        <div className="text-center text-xs min-h-[20px]">
          {isLoadingDict ? (
            <span className="text-muted">Сөздік тексерілуде...</span>
          ) : word.length === 0 ? (
            <span className="text-muted">Кез келген зат есімді енгізіңіз</span>
          ) : !isExactLength ? (
            <span className="text-muted">Тағы {length - word.length} әріп қажет</span>
          ) : isValidWord ? (
            <span className="text-correct font-semibold flex items-center justify-center gap-1">
              ✓ Сөздікте бар жарамды сөз!
            </span>
          ) : (
            <span className="text-amber-400 font-medium">
              Бұл сөз біздің сөздікте табылмады (басқа сөз таңдаңыз)
            </span>
          )}
        </div>

        {/* Share Section */}
        {isValidWord && challengeUrl && (
          <div className="space-y-3 pt-3 border-t border-border animate-fadeIn">
            <p className="text-xs text-muted text-center font-medium">
              Шифрланған сілтемені досыңызға жіберіңіз:
            </p>

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

            <button
              type="button"
              onClick={handleCopy}
              className="w-full bg-surface hover:bg-border text-text font-bold py-3 px-4 rounded-xl transition-all border border-border flex items-center justify-center gap-2 text-sm active:scale-98"
            >
              {copied ? (
                <span className="text-correct flex items-center gap-1.5 font-bold">
                  ✓ Сілтеме көшірілді!
                </span>
              ) : (
                <>
                  <span>📋 Сілтемені көшіру</span>
                  <span className="text-xs text-muted font-normal truncate max-w-[150px]">
                    ({challengeUrl.replace('https://', '')})
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ChallengeModal;
