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
    correct: { word: 'КҮНІ', statuses: ['correct', 'absent', 'absent', 'absent'], letter: 'К' },
    present: { word: 'ЖАРҚ', statuses: ['absent', 'present', 'absent', 'absent'], letter: 'А' },
    absent:  { word: 'АУЫЛ', statuses: ['absent', 'absent', 'absent', 'absent'], letter: 'У' },
  },
  5: {
    correct: { word: 'ЖАРЫС', statuses: ['correct', 'absent', 'absent', 'absent', 'absent'], letter: 'Ж' },
    present: { word: 'ТІЛШІ', statuses: ['absent', 'absent', 'present', 'absent', 'absent'], letter: 'Л' },
    absent:  { word: 'БОЛАТ', statuses: ['absent', 'absent', 'absent', 'absent', 'absent'], letter: 'О' },
  },
  6: {
    correct: { word: 'КҮНДЕР', statuses: ['correct', 'absent', 'absent', 'absent', 'absent', 'absent'], letter: 'К' },
    present: { word: 'ЖОҒАЛТ', statuses: ['absent', 'absent', 'present', 'absent', 'absent', 'absent'], letter: 'Ғ' },
    absent:  { word: 'КОМПАС', statuses: ['absent', 'absent', 'absent', 'absent', 'absent', 'absent'], letter: 'П' },
  },
};

const InfoModal: React.FC<{ onClose: () => void; wordLength: number }> = ({ onClose, wordLength }) => {
  const ex = EXAMPLES[wordLength] ?? EXAMPLES[6];
  return (
    <Modal title={UI_MESSAGES.GAME_RULES} onClose={onClose}>
      <div className="text-sm text-muted space-y-4">
        <p className="text-center">
          {MAX_GUESSES} талпыныста {wordLength} әріптен тұратын сөзді табыңыз.
          <br />
          Әр болжамнан кейін плиткалардың түсі өзгереді.
        </p>
        <div className="space-y-5 pt-4">
          <ExampleRow
            word={ex.correct.word}
            statuses={ex.correct.statuses}
            description={<><b>{ex.correct.letter}</b> әрпі сөз ішінде бар әрі өз орнында тұр.</>}
          />
          <ExampleRow
            word={ex.present.word}
            statuses={ex.present.statuses}
            description={<><b>{ex.present.letter}</b> әрпі сөз ішінде бар, алайда тұрған жері қате.</>}
          />
          <ExampleRow
            word={ex.absent.word}
            statuses={ex.absent.statuses}
            description={<><b>{ex.absent.letter}</b> әрпі сөзде мүлде жоқ.</>}
          />
        </div>
        <p className="pt-4 border-t border-border text-center font-semibold">Күн сайын жаңа сөз шығады!</p>
      </div>
    </Modal>
  );
};

export default InfoModal;
