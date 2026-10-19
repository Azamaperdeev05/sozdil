import React from 'react';
import Modal from './Modal';
import ExampleRow from './ExampleRow';
import { LetterStatus } from '../types';
import { MAX_GUESSES, UI_MESSAGES } from '../constants';

const EXAMPLES: Record<number, {
  correct: { word: string; statuses: LetterStatus[]; letter: string };
  present: { word: string; statuses: LetterStatus[]; letter: string };
  absent:  { word: string; statuses: LetterStatus[]; letter: string };
}> = {
  4: {
    correct: { word: 'КҮНІ', statuses: ['correct', 'default', 'default', 'default'], letter: 'К' },
    present: { word: 'ЖАРҚ', statuses: ['default', 'present', 'default', 'default'], letter: 'А' },
    absent:  { word: 'АУЫЛ', statuses: ['default', 'absent', 'default', 'default'], letter: 'У' },
  },
  5: {
    correct: { word: 'ЖАРЫС', statuses: ['correct', 'default', 'default', 'default', 'default'], letter: 'Ж' },
    present: { word: 'ТІЛШІ', statuses: ['default', 'default', 'present', 'default', 'default'], letter: 'Л' },
    absent:  { word: 'БОЛАТ', statuses: ['default', 'absent', 'default', 'default', 'default'], letter: 'О' },
  },
  6: {
    correct: { word: 'КҮНДЕР', statuses: ['correct', 'default', 'default', 'default', 'default', 'default'], letter: 'К' },
    present: { word: 'ЖОҒАЛТ', statuses: ['default', 'default', 'present', 'default', 'default', 'default'], letter: 'Ғ' },
    absent:  { word: 'КОМПАС', statuses: ['default', 'default', 'default', 'absent', 'default', 'default'], letter: 'П' },
  },
};

const InfoModal: React.FC<{ onClose: () => void; wordLength: number }> = ({ onClose, wordLength }) => {
  const ex = EXAMPLES[wordLength] ?? EXAMPLES[6];
  return (
    <Modal title={UI_MESSAGES.GAME_RULES} onClose={onClose}>
      <div className="text-sm text-muted space-y-4">
        <p className="text-center text-text">
          {MAX_GUESSES} талпыныста {wordLength} әріптен тұратын сөзді табыңыз.
          <br />
          <span className="text-muted">Әр болжамнан кейін әріптердің түсі өзгереді.</span>
        </p>
        <div className="space-y-5 pt-2">
          <ExampleRow
            word={ex.correct.word}
            statuses={ex.correct.statuses}
            description={<><b className="text-text">Толық жасыл</b> — <b className="text-text">{ex.correct.letter}</b> әрпі сөзде бар әрі өз орнында тұр.</>}
          />
          <ExampleRow
            word={ex.present.word}
            statuses={ex.present.statuses}
            description={<><b className="text-text">Ашық жасыл</b> — <b className="text-text">{ex.present.letter}</b> әрпі сөзде бар, бірақ орны басқа.</>}
          />
          <ExampleRow
            word={ex.absent.word}
            statuses={ex.absent.statuses}
            description={<><b className="text-text">Сұр</b> — <b className="text-text">{ex.absent.letter}</b> әрпі сөзде мүлде жоқ.</>}
          />
        </div>
        <p className="pt-4 border-t border-border text-center text-text font-semibold">Күн сайын 00:00-де жаңа сөз шығады</p>
      </div>
    </Modal>
  );
};

export default InfoModal;
