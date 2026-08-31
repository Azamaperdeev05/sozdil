# Сөзділ — Қазақша Wordle (Kazakh Word Game) 🎯🇰🇿

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white)](https://sozdil.vercel.app/)
[![PageSpeed Performance](https://img.shields.io/badge/PageSpeed-100%2F100-brightgreen?logo=googlechrome&logoColor=white)](https://pagespeed.web.dev/analysis/https-sozdil-vercel-app)
[![React 19](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple?logo=pwa&logoColor=white)](https://sozdil.vercel.app/)

> **Сөзділ** — қазақ тіліндегі заманауи, жылдам әрі толыққанды сөз табу ойыны (Kazakh Wordle). Күн сайын жаңа сөздерді тауып, сөздік қорды дамытуға, достармен сайысуға және үздіксіз серияларды жинауға арналған.

🌐 **Ресми сілтеме:** [sozdil.vercel.app](https://sozdil.vercel.app/)

---

## 🌟 Басты мүмкіндіктер (Features)

### 1. 🔤 Үш түрлі ұзындық режимі (4, 5, 6 әріп)
- **4 әріптік режим:** Қарапайым әрі шапшаң ойлануға арналған.
- **5 әріптік режим:** Классикалық Wordle ережесіне негізделген.
- **6 әріптік режим:** Сөздік қоры мол, қиын сөздерді ұнататын эрудиттерге арналған.

### 2. ⚔️ «Досыңмен сайыс» (Challenge a Friend)
- Кез келген қазақша сөзді жасырып, досыңызға шифрланған сілтеме жіберуге болады.
- **Base62 алгоритмі мен Bitwise Scramble:** Сілтемеде сөз мүлде көрінбейді (мысалы: `sozdil.vercel.app/?c=1em84i0d`), қауіпсіз әрі қысқа.
- **WhatsApp және Telegram:** Нәтижені немесе жұмбақталған сілтемені бір басумен чаттарға жіберу.

### 3. 🏆 Жетістіктер мен Бейдждер (Gamification & Achievements)
- 6 санат бойынша **50-ден астам ерекше жетістіктер**:
  - 🏆 *Жеңістер саны мен тәжірибе* (1-ден 500 жеңіске дейін)
  - 🔥 *Үздіксіз сериялар* (2-ден 100 күнге дейінгі тоқтаусыз ойындар)
  - 🎯 *Шеберлік пен дәлдік* (1-ші қадамнан табу «Көріпкел», 2-ші қадамнан табу «Мерген» т.б.)
  - 🎮 *Режимдер білгірі* (әр режим бойынша арнайы марапаттар)
  - ⚔️ *Сайыс шеберлері* (достарына сөз жасырып, құпия шешу)
  - ✨ *Тілдік ерекшеліктер* (төл дыбыстар «Ә, І, Ң, Ғ, Ү, Ұ, Қ, Ө, Һ» бар сөздер)
- Нақты уақыттағы анимациялық құттықтау хабарламалары мен прогресс-барлар.

### 4. 📲 Прогрессивті веб-қолданба (PWA & Offline-First)
- **Android / Chrome:** 1 басумен басты экранға орнату.
- **iOS (iPhone/Safari):** Қадамдық көрнекі нұсқаулықпен үй экранына қосу.
- **100% Offline-ready:** Интернетсіз де толық жұмыс істейді, серверсіз `localStorage` кэштеу архитектурасы.

### 5. ⚡ PageSpeed 100/100 & High Performance
- **Critical CSS Inlining:** Барлық CSS өндірістік жинақтауда HTML ішіне кірістіріліп, сыртқы бұғаттаушы желі сұраныстары 0-ге жеткізілді.
- **Google Inter Font:** Оңтайландырылған заманауи типографика.
- **Reicon SVG System:** Жеңіл, бірыңғай және жылдам векторлық иконкалар жүйесі.
- **Mobile First UX:** Смартфондар мен тар экрандарға толықтай бейімделген 2 қатарлы эргономикалық интерфейс (40-44px Tap Targets).

---

## 🛠️ Технологиялық стек (Tech Stack)

| Бағыты | Технология | Сипаттамасы |
|---|---|---|
| **Frontend** | React 19 + TypeScript 5.8 | Қатаң типтелген заманауи реактивті интерфейс |
| **Bundler** | Vite 6.4 | Лезде жинақтайтын (HMR) әрі Inlined CSS қолдайтын құрастырушы |
| **Styles** | Tailwind CSS v4 | Жаңа буынды, нөлдік артық жүктемелі CSS жүйесі |
| **Icons** | Reicon (`reicon-react`) | Заманауи, минималистік SVG иконкалар топтамасы |
| **Fonts** | Google Inter | `display=swap` және `preconnect` арқылы жүктелген таза шрифт |
| **Storage** | LocalStorage API | Офлайн синхрондау, пайдаланушының құпиялылығын сақтау |
| **Hosting** | Vercel | Global Edge CDN арқылы найзағайдай жылдам жариялау |

---

## 📁 Жоба құрылымы (Project Structure)

```text
sozdil/
├── components/                # React интерфейс компоненттері
│   ├── AchievementsModal.tsx  # Жетістіктер мен бейдждер терезесі
│   ├── CalendarModal.tsx      # Ойын тарихы мен күнтізбе архиві
│   ├── ChallengeModal.tsx     # Досыңа сөз жасыру (Сайыс) терезесі
│   ├── Countdown.tsx          # Келесі күнге дейінгі кері санақ таймері
│   ├── EndGameModal.tsx       # Жеңіс/Жеңіліс нәтижесі, әлеуметтік бөлісу
│   ├── Grid.tsx               # 6 қатарлы сөз енгізу ұяшықтары
│   ├── Header.tsx             # 2 қатарлы мобильді эргономикалық мәзір
│   ├── InfoModal.tsx          # Ойын ережелері мен нұсқаулық
│   ├── InstallBanner.tsx      # PWA экранға қосу баннері (iOS & Android)
│   ├── InstallButton.tsx      # Мәзірдегі орнату батырмасы
│   ├── Keyboard.tsx           # 35 әріпті интерактивті қазақша пернетақта
│   ├── Modal.tsx              # Әмбебап модаль терезе каркасы
│   ├── StatsModal.tsx         # Жеке статистика мен талдаулар
│   └── Toast.tsx              # Анимациялық қысқа хабарламалар
├── lib/                       # Бизнес-логика және көмекші модулдер
│   ├── achievements.ts        # 50+ жетістік ережелері мен жағдайлары
│   ├── api.ts                 # Ойын деректерін синхрондау
│   ├── challenge.ts           # Base62 сөз шифрлау/дешифрлеу модулі
│   ├── gameTime.ts            # Алматы уақыты бойынша күн ауысуын есептеу
│   ├── getTodayWord.ts        # Күн сөзін детерминистік таңдау алгоритмі
│   ├── statuses.ts            # Жасыл, сары, сұр түстерді анықтау логикасы
│   ├── usePWAInstall.ts       # PWA орнату күйлерін бақылау хугі
│   └── words.ts               # Қазақша сөздіктерді динамикалық жүктеу
├── words_4.ts                 # 4 әріпті қазақша сөздік қоры
├── words_5.ts                 # 5 әріпті қазақша сөздік қоры
├── words_6.ts                 # 6 әріпті қазақша сөздік қоры
├── App.tsx                    # Басты қолданба логикасы
├── index.html                 # Оңтайландырылған SEO, Meta, OpenGraph және Schema.org
├── vite.config.ts             # Inlined Critical CSS плагині бар Vite конфигурациясы
└── vercel.json                # Vercel SPA баптаулары
```

---

## 🚀 Жергілікті іске қосу (Local Development)

### 1. Репозиторийді көшіріп алып, тәуелділіктерді орнату:
```bash
git clone https://github.com/Azamaperdeev05/sozdil.git
cd sozdil
npm install
```

### 2. Әзірлеу серверін іске қосу:
```bash
npm run dev
```
Браузерде `http://localhost:5173` адресі ашылады.

### 3. Тексеру және жинақтау:
```bash
# TypeScript типтерін тексеру
npm run check

# Production нұсқасын жинақтау (Inlined CSS + Minification)
npm run build

# Жинақталған dist нұсқасын жергілікті тексеру
npm run start
```

---

## 🔒 Қауіпсіздік және Құпиялылық (Security & Privacy)

- **0 сыртқы деректер базасы:** Пайдаланушының жеке ақпараты, логиндері немесе құпиясөздері сұралмайды.
- **Жергілікті сақтау (Local-only):** Ойын нәтижелері мен сериялар тек пайдаланушының құрылғысында (`localStorage`) сақталады.
- **XSS & Injection қорғанысы:** Қатаң қазақ әліпбиі регулярлық өрнектері (`/^[А-ЯӘІҢҒҮҰҚӨҺЁ]+$/`) арқылы мәтіндер тазартылады.
- **0 осалдықтар (0 Vulnerabilities):** Тәуелділіктер тұрақты түрде аудиттен өтіп, соңғы қауіпсіз нұсқаларға жаңартылған.

---

## 👨‍💻 Авторы мен Үлескерлер

- **Жоба авторы:** [Азамат Пердеев](https://telegram.me/code_improper)
- **GitHub:** [@Azamaperdeev05](https://github.com/Azamaperdeev05)
- **Telegram арнасы:** [@code_improper](https://telegram.me/code_improper)

---

## 📄 Лицензия (License)

Бұл жоба [MIT Лицензиясы](LICENSE) аясында ашық түрде таратылады. Қазақ тілін дамытуға үлес қосқысы келетін барлық жандарға жоба ашық! 🇰🇿✨
