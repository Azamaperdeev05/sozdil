import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle } from 'reicon-react';
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
    <Modal title="Досыңа сөз жасыр" onClose={onClose}>
      <div className="text-text space-y-5">
        <p className="text-sm text-muted text-center -mt-1">
          Сөз ойлап тап — ол сілтеме ішінде шифрланып жасырылады.
        </p>

        <div className="grid grid-cols-3 p-1 rounded-full bg-surface max-w-[15rem] mx-auto" role="group" aria-label="Әріп саны">
          {[4, 5, 6].map((len) => (
            <button
              key={len}
              type="button"
              onClick={() => {
                setLength(len);
                setWord('');
              }}
              aria-pressed={length === len}
              className={`h-8 rounded-full text-xs font-semibold transition ${
                length === len ? 'bg-ink text-on-ink' : 'text-muted hover:text-text'
              }`}
            >
              {len} әріп
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label htmlFor="challenge-word-input" className="sr-only">
            Жасыратын {length} әріпті сөз
          </label>
          <input
            id="challenge-word-input"
            type="text"
            maxLength={length}
            value={word}
            onChange={(e) => setWord(e.target.value.replace(/[^а-яА-ЯәіңғүұқөһӘІҢҒҮҰҚӨҺёЁ]/g, '').toUpperCase())}
            placeholder={`${length} әріпті сөз`}
            autoComplete="off"
            className="w-full h-14 bg-bg border-2 border-border focus:border-ink text-center text-xl font-bold tracking-[0.3em] rounded-2xl outline-none transition placeholder:text-muted/60 placeholder:tracking-normal placeholder:font-medium placeholder:text-base uppercase"
            autoFocus
          />
          <p className="text-center text-xs min-h-[1rem]" aria-live="polite">
            {isLoadingDict ? (
              <span className="text-muted">Сөздік жүктелуде…</span>
            ) : word.length === 0 ? (
              <span className="text-muted">Кез келген қазақша зат есім</span>
            ) : !isExactLength ? (
              <span className="text-muted">Тағы {length - word.length} әріп</span>
            ) : isValidWord ? (
              <span className="text-accent-ink font-semibold">✓ Сөздікте бар</span>
            ) : (
              <span className="text-danger font-medium">Бұл сөз сөздікте жоқ — басқасын таңда</span>
            )}
          </p>
        </div>

        {isValidWord && challengeUrl && (
          <div className="space-y-2 animate-fade-in">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full h-12 rounded-full bg-ink text-on-ink font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              {copied ? <CheckCircle size={18} weight="Filled" /> : <Copy size={18} weight="Outline" />}
              <span>{copied ? 'Сілтеме көшірілді' : 'Сілтемені көшіру'}</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 rounded-full border border-border text-text font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface active:scale-[0.98] transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                WhatsApp
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 rounded-full border border-border text-text font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface active:scale-[0.98] transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.34-.674.34l.211-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.833.877z" /></svg>
                Telegram
              </a>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ChallengeModal;
