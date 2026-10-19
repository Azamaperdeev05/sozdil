import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'reicon-react';
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
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Алдыңғы ай"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface text-text transition"
          >
            <ChevronLeft size={20} weight="Outline" />
          </button>
          <div className="text-base font-bold">{`${MONTH_NAMES[month]} ${year}`}</div>
          <button
            type="button"
            onClick={() => !isCurrentMonth && changeMonth(1)}
            disabled={isCurrentMonth}
            aria-label="Келесі ай"
            className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
              isCurrentMonth ? 'opacity-25 cursor-default' : 'hover:bg-surface text-text cursor-pointer'
            }`}
          >
            <ChevronRight size={20} weight="Outline" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {DAY_NAMES.map(day => <div key={day} className="text-[11px] font-semibold text-muted pb-1">{day}</div>)}
          {Array(startDay).fill(null).map((_, i) => <div key={`b-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const entry = history[dateStr];
            const isToday = isCurrentMonth && day === today.getDate();
            const cls = entry === 'WON' ? 'bg-accent text-on-accent font-bold' : entry === 'LOST' ? 'bg-absent text-muted' : 'text-text';
            return (
              <div
                key={day}
                className={`mx-auto w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold ${cls} ${isToday ? 'ring-2 ring-ink ring-offset-2 ring-offset-bg' : ''}`}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 pt-4 mt-3 border-t border-border text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-accent" />Тапты</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-absent" />Таппады</span>
        </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;
