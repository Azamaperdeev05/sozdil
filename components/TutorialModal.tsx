import React, { useState } from 'react';
import Modal from './Modal';
import ExampleRow from './ExampleRow';
import { LetterStatus } from '../types';

const TutorialStep: React.FC<{
  title: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  onClose?: () => void;
  nextLabel?: string;
  finalLabel?: string;
}> = ({ title, children, onNext, onPrev, onClose, nextLabel = "Жалғастыру", finalLabel = "Ойынға!" }) => {
  return (
    <div className="text-center space-y-4">
      <h3 className="text-xl font-bold text-text -mt-2">{title}</h3>
      <div className="text-sm text-muted space-y-4">{children}</div>
      <div className={`flex ${onPrev ? 'justify-between' : 'justify-end'} items-center pt-4`}>
        {onPrev && <button onClick={onPrev} className="text-sm font-semibold text-muted hover:text-text transition-colors">Артқа</button>}
        {onNext && <button onClick={onNext} className="bg-accent hover:bg-accent/90 text-white font-bold py-2 px-6 rounded-lg transition-colors">{nextLabel}</button>}
        {onClose && <button onClick={onClose} className="bg-correct hover:bg-correct/90 text-white font-bold py-2 px-6 rounded-lg transition-colors">{finalLabel}</button>}
      </div>
    </div>
  );
};

const TutorialModal: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
    const [step, setStep] = useState(0);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <TutorialStep title="Сөзділ ойынына қош келдіңіз!" onNext={nextStep} nextLabel="Бастайық">
                        <p>6 әріптен тұратын жасырын сөзді 6 талпыныста табыңыз.</p>
                        <p>Алдымен ойын ережесін тез үйреніп алайық.</p>
                    </TutorialStep>
                );
            case 1:
                return (
                    <TutorialStep title="Дұрыс әріп, дұрыс орын" onNext={nextStep} onPrev={prevStep}>
                        <p>Болжамнан кейін әріп жасыл түске боялса, ол сөзде бар және өз орнында тұрғанын білдіреді.</p>
                        <ExampleRow 
                            word="КҮНДЕР" 
                            statuses={['correct', 'absent', 'absent', 'absent', 'absent', 'absent']}
                        />
                         <p className="text-sm text-muted"><b>К</b> әрпі сөздің бірінші әрпі екені белгілі болды.</p>
                    </TutorialStep>
                );
            case 2:
                return (
                    <TutorialStep title="Дұрыс әріп, қате орын" onNext={nextStep} onPrev={prevStep}>
                        <p>Егер әріп сары болса, ол сөзде бар, бірақ басқа орында тұрғанын білдіреді.</p>
                        <ExampleRow 
                            word="ЖОҒАЛТ" 
                            statuses={['absent', 'absent', 'present', 'absent', 'absent', 'absent']}
                        />
                         <p className="text-sm text-muted"><b>Ғ</b> әрпі сөзде бар, бірақ үшінші орында емес.</p>
                    </TutorialStep>
                );
            case 3:
                return (
                    <TutorialStep title="Қате әріп және пернетақта" onClose={onClose} onPrev={prevStep}>
                        <p>Сұр түс әріптің сөзде мүлде жоқ екенін көрсетеді.</p>
                         <ExampleRow 
                            word="КОМПАС" 
                            statuses={['absent', 'absent', 'absent', 'absent', 'absent', 'absent']}
                        />
                         <p className="font-semibold pt-4">Пернетақтадағы әріптер де сізге көмектеседі:</p>
                        <div className="flex flex-col items-center w-full max-w-sm mx-auto p-2 scale-90">
                            <div className="flex justify-center w-full gap-1.5 my-1">
                                <Key value="К" status="correct"/>
                                <Key value="Ғ" status="present"/>
                                <Key value="П" status="absent"/>
                                <Key value="А" status="default"/>
                            </div>
                        </div>
                        <p>Сәттілік!</p>
                    </TutorialStep>
                );
            default: return null;
        }
    };
    
    return (
        <Modal title={step === 0 ? "" : "Ойын ережесі"} onClose={onClose}>
            <div key={step}>
                {renderStep()}
            </div>
        </Modal>
    );
};


// Mini keyboard key for tutorial
const Key: React.FC<{ value: string; status: LetterStatus;}> = ({ value, status }) => {
  const statusClasses = {
    correct: '!bg-correct text-white',
    present: '!bg-present text-white',
    absent: '!bg-absent text-muted',
    default: 'bg-surface/80 text-text',
  };
  return (
    <div className={`flex-1 ${statusClasses[status]} h-12 sm:h-14 min-w-0 flex items-center justify-center rounded-md font-semibold uppercase`}>
      {value}
    </div>
  );
};

export default TutorialModal;
