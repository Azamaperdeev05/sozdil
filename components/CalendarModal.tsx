import React, { useState } from 'react';
import Modal from './Modal';
import { UI_MESSAGES } from '../constants';

const MONTH_NAMES = ["Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым","Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан"];
const DAY_NAMES = ["Дс","Сс","Ср","Бс","Жм","Сб","Жс"];

const CalendarModal: React.FC<{
  onClose: () => void;
  history: { [date: string]: 'WON' | 'LOST' };
}> = ({ onClose, history }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + offset);
      return d;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  return (
    <Modal title={UI_MESSAGES.CALENDAR} onClose={onClose}>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-surface transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="text-lg font-bold font-display">{`${MONTH_NAMES[month]} ${year}`}</div>
          <button
            onClick={() => !isCurrentMonth && changeMonth(1)}
            disabled={isCurrentMonth}
            className={`p-2 rounded-full transition-colors ${isCurrentMonth ? 'opacity-30 cursor-default' : 'hover:bg-surface cursor-pointer'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {DAY_NAMES.map(day => <div key={day} className="font-semibold text-muted">{day}</div>)}
          {Array(startDay).fill(null).map((_, i) => <div key={`b-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const entry = history[dateStr];
            const cls = entry === 'WON' ? 'bg-correct text-white' : entry === 'LOST' ? 'bg-absent text-white' : 'bg-transparent text-text';
            return (
              <div key={day} className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold ${cls}`}>
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;
