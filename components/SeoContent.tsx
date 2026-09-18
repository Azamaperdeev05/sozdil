import React, { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Сөзділ (Wordle қазақша) ойыны деген не?',
    a: 'Сөзділ — әлемге әйгілі Wordle ойынының қазақ тіліндегі ресми әрі толыққанды аналогы. Мұнда ойыншылар 4, 5 және 6 әріптен тұратын жасырын сөзді 6 мүмкіндікте табуы қажет. Ойын қазақ тілінің сөздік қорын байытуға, есте сақтау қабілеті мен логикалық ойлауды шыңдауға көмектеседі.',
  },
  {
    q: 'Қазақша сөз табу ойынының ережесі қандай? Түстер нені білдіреді?',
    a: 'Әр болжамнан кейін торкөздердің түсі өзгереді: 🟩 ЖАСЫЛ — әріп сөз ішінде бар әрі дәл өз орнында тұр; 🟨 САРЫ — әріп сөз құрамында бар, бірақ тұрған орны басқа; ⬛️ СҰР — әріп жасырылған сөзде мүлде жоқ.',
  },
  {
    q: 'Күнделікті жаңа сөз қашан жаңарады?',
    a: 'Барлық ойыншылар үшін жаңа күнделікті сөз әр түні сағат 00:00-де (жергілікті уақыт бойынша) автоматты түрде жаңарады. Күніне бір рет барлық ойыншыға бірдей ортақ сөз жасырылады.',
  },
  {
    q: 'Сөздікте қандай сөздер бар?',
    a: 'Сөзділ сөздігі тек қазақ әдеби тілінің нормативті зат есімдерінен (атау септігінде, жекеше түрде) құралған. Барлық қырғыз, өзбек немесе көнетүркі диалектілері, сондай-ақ қате жазылған сөздер арнайы тазартудан өткен.',
  },
  {
    q: 'Досыма қалай сөз жасырып, жарыса аламын (Challenge режимі)?',
    a: 'Жоғарғы мәзірдегі «Досыңды шақыр» (найзағай белгішесі) батырмасын басып, қалаған 4, 5 немесе 6 әріпті қазақша сөзді жасырыңыз. Пайда болған сілтемені WhatsApp, Telegram немесе әлеуметтік желі арқылы досыңызға жіберіп, оның сөзді неше мүмкіндіктен табатынын көріңіз!',
  },
  {
    q: 'Сөзділ ойынын телефонға қосымша (PWA) ретінде қалай орнатады?',
    a: 'Сөзділ — заманауи PWA қосымша. Android қолданушылары сайттағы «Орнату» батырмасын басып немесе Chrome мәзірінен «Қолданбаны орнату» арқылы жаза алады. iPhone (iOS) қолданушылары Safari-де «Бөлісу» (Share) батырмасын басып, «Басты экранға қосу» (На экран «Домой») таңдауы жеткілікті. Ойын Play Market-сіз офлайн да істейді.',
  },
];

const KEYWORD_TAGS = [
  'Сөзділ',
  'Wordle қазақша',
  'Қазақша сөз ойыны',
  'Сөз табу ойыны',
  'Сөз тап',
  'Қазақша вордли',
  'Казахский вордле',
  'Қазақша кроссворд',
  'Сөзжұмбақ',
  'Сөз құрау',
  'Sozdil kz',
  'Kazakh Wordle',
];

const SeoContent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  return (
    <section
      aria-label="Сөзділ туралы мәлімет және жиі қойылатын сұрақтар"
      className="w-full max-w-xl mx-auto px-3 py-6 mt-4 text-left border-t border-border/60"
    >
      {/* Header toggle */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-text flex items-center gap-1.5">
            <span>📖</span>
            <span>Сөзділ туралы & Жиі қойылатын сұрақтар</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Қазақша Wordle ойынының ережелері мен мүмкіндіктері
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface hover:bg-border text-accent border border-border transition-colors active:scale-95 flex-shrink-0"
        >
          {isOpen ? 'Жасыру ▲' : 'Толығырақ ▼'}
        </button>
      </div>

      {/* Expandable SEO block */}
      <div className={`${isOpen ? 'block' : 'hidden'} mt-4 space-y-4 text-xs text-muted leading-relaxed`}>
        {/* Intro */}
        <div className="bg-surface/50 border border-border/70 rounded-xl p-3.5 space-y-2">
          <h3 className="font-bold text-text text-sm">
            Сөзділ — Қазақ тіліндегі күнделікті сөз табу ойыны
          </h3>
          <p>
            <b>Сөзділ</b> — күн сайын жаңа қазақша сөздерді табуға арналған интеллектуалды, тегін онлайн ойын. Әлемге әйгілі Wordle ойынының қағидаты бойынша жасалған бұл жоба қазақ тілінің бай сөздік қорын дәріптеуге және пайдаланушылардың логикалық ойлауын шыңдауға бағытталған.
          </p>
          <p>
            Ойында <b>4, 5 және 6 әріптен</b> тұратын үш түрлі деңгей қарастырылған. Күн сайын барлық ойыншыларға бірдей ортақ сөз жасырылады. Оны 6 талпыныс ішінде тауып, өз нәтижеңізді достарыңызбен WhatsApp немесе Telegram арқылы бөлісе аласыз.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
          <div className="bg-surface/40 border border-border/50 rounded-lg p-2.5">
            <span className="text-base">📅</span>
            <p className="font-semibold text-text mt-1 text-[11px]">Күн сайын жаңа сөз</p>
            <p className="text-[10px] text-muted mt-0.5">Түн ортасы 00:00-де автоматты жаңарады</p>
          </div>
          <div className="bg-surface/40 border border-border/50 rounded-lg p-2.5">
            <span className="text-base">⚡️</span>
            <p className="font-semibold text-text mt-1 text-[11px]">Challenge режимі</p>
            <p className="text-[10px] text-muted mt-0.5">Досыңа жеке сөз жасырып жарыс</p>
          </div>
          <div className="bg-surface/40 border border-border/50 rounded-lg p-2.5">
            <span className="text-base">📱</span>
            <p className="font-semibold text-text mt-1 text-[11px]">Офлайн PWA қолдау</p>
            <p className="text-[10px] text-muted mt-0.5">Интернетсіз де қолданба ретінде ойнаңыз</p>
          </div>
        </div>

        {/* FAQ list */}
        <div className="space-y-2 pt-2">
          <h3 className="font-bold text-text text-xs uppercase tracking-wider text-muted">
            Жиі қойылатын сұрақтар (FAQ)
          </h3>
          {FAQ_ITEMS.map((item, idx) => {
            const isItemOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-surface/60 border border-border/70 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isItemOpen}
                  aria-controls={`faq-ans-${idx}`}
                  className="w-full text-left p-3 flex items-center justify-between gap-2 font-semibold text-text hover:text-accent transition-colors"
                >
                  <span className="text-xs">{item.q}</span>
                  <span className="text-muted text-[10px] flex-shrink-0">
                    {isItemOpen ? '▲' : '▼'}
                  </span>
                </button>
                {isItemOpen && (
                  <div id={`faq-ans-${idx}`} className="px-3 pb-3 pt-1 text-xs text-muted border-t border-border/40 leading-relaxed bg-surface/30">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SEO Keywords tags / chips */}
        <div className="pt-2 border-t border-border/40">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">
            Танымал іздеу тақырыптары:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {KEYWORD_TAGS.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-md bg-surface/80 text-muted border border-border/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeoContent;
