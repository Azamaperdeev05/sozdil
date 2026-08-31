# Сөзділ Mobile — Flutter & Android қосымшасы 📱🇰🇿

<div align="center">

[![Flutter 3.x](https://img.shields.io/badge/Flutter-3.x-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev/)
[![Dart](https://img.shields.io/badge/Dart-3.x-0175C2?style=for-the-badge&logo=dart&logoColor=white)](https://dart.dev/)
[![Android App Links](https://img.shields.io/badge/Android-App_Links_Verified-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com/training/app-links)
[![Reicon Icons](https://img.shields.io/badge/Icons-Reicon_Flutter-FF6B6B?style=for-the-badge)](https://reicon.dev)

</div>

---

## 📖 Қосымша туралы (About)

**Сөзділ Mobile** — [sozdil.vercel.app](https://sozdil.vercel.app/) веб-нұсқасының Flutter және Dart негізінде жасалған, Android платформасына арналған толыққанды нативті мобильді клиенті.

---

## ✨ Басты ерекшеліктері (Key Mobile Features)

1. **🔗 Автоматты Android App Links (Digital Asset Links):**
   - Қолданбаның ресми қолтаңба сертификатымен расталған `https://sozdil.vercel.app/.well-known/assetlinks.json` арқылы жүйеге кіріктірілген.
   - WhatsApp немесе Telegram-нан түскен кез келген сайыс сілтемесі телефон баптауынсыз бірден осы қосымшада ашылады.

2. **⚡ Детерминистік ойын қозғалтқышы (Deterministic Engine):**
   - Веб-нұсқадағы күн сөздерімен 100% сәйкес келеді (Алматы уақыты GMT+5 бойынша).
   - 4, 5, және 6 әріптік 25 000-нан астам тазартылған қазақша сөздер базасы құрылғыда офлайн кэштелген.

3. **🎨 Reicon Векторлық интерфейс (Reicon Flutter):**
   - Ресми `reicon_flutter` және `flutter_svg` кітапханалары арқылы барлық батырмалар мен белгішелер пиксельдік дәлдікпен (pixel-perfect) салынған.

4. **📱 Смартфон экрандарына бейімделген тор (Responsive Grid):**
   - 6 қатарлы сөз ұяшықтары кез келген экран биіктігіне сәйкес пернетақтамен соқтығыспай, өлшемін динамикалық реттейді.

5. **🏆 50+ Жетістіктер және тарих архиві:**
   - SharedPreferences арқылы ойын нәтижелері мен марапаттар офлайн сақталады.

---

## 📁 Мобильді жоба құрылымы (Project Structure)

```text
mobile/
├── android/
│   ├── app/
│   │   ├── build.gradle.kts                # Release қолтаңбасы & SDK нұсқалары
│   │   ├── sozdil-release.keystore         # Тұрақты өндірістік қолтаңба
│   │   └── src/main/
│   │       ├── AndroidManifest.xml         # Қолданба атауы, Deep Link фильтрлері
│   │       └── res/mipmap-*                # Жоғары сапалы логотип иконкалары
├── assets/
│   └── words/
│       ├── words_4.json                    # 4 әріпті сөздік (JSON)
│       ├── words_5.json                    # 5 әріпті сөздік (JSON)
│       └── words_6.json                    # 6 әріпті сөздік (JSON)
├── lib/
│   ├── constants/
│   │   ├── app_colors.dart                 # Dark Theme түстер палитрасы
│   │   └── kazakh_keyboard.dart            # 35 әріпті қазақша пернетақта
│   ├── models/
│   │   ├── achievement.dart                # Жетістіктер деректер моделі
│   │   └── letter_status.dart              # Дұрыс/Басқа/Жоқ күйлері
│   ├── services/
│   │   ├── achievement_service.dart        # 50 бейдждің бақылау логикасы
│   │   ├── challenge_service.dart          # Base62 шифрлау қозғалтқышы
│   │   ├── game_engine.dart                # Күн сөзін есептеу қозғалтқышы
│   │   └── storage_service.dart            # Жергілікті SharedPreferences
│   ├── widgets/
│   │   ├── modals/
│   │   │   ├── achievements_modal.dart     # Жетістіктер терезесі
│   │   │   ├── calendar_modal.dart         # Қазақша күнтізбе
│   │   │   ├── challenge_modal.dart        # Сайыс сілтемесін жасау
│   │   │   ├── end_game_modal.dart         # Ойын соңы және бөлісу
│   │   │   ├── rules_modal.dart            # Ойын ережесі
│   │   │   └── stats_modal.dart            # Статистика тақтасы
│   │   ├── app_header.dart                 # 2 қатарлы мобильді мәзір
│   │   ├── reicon_widget.dart              # Reicon SVG компоненті
│   │   ├── virtual_keyboard.dart           # 35 әріпті пернетақта
│   │   └── word_grid.dart                  # Динамикалық ұяшықтар торы
│   └── main.dart                           # Қолданбаның басты нүктесі
└── pubspec.yaml                            # Пакеттер тізімі
```

---

## 🛠 Жинақтау және Іске қосу (Build Instructions)

### 1. Тәуелділіктерді орнату:
```bash
flutter pub get
```

### 2. Құрылғыда іске қосу:
```bash
flutter run
```

### 3. Production Release APK жинақтау:
```bash
cd android
./gradlew app:assembleRelease
```
Жинақталған APK мына мекенжайда сақталады:
`mobile/build/app/outputs/flutter-apk/app-release.apk` немесе `mobile/build/app/outputs/apk/release/app-release.apk`

---

## 📄 Лицензия

MIT License © 2026 Азамат Пердеев.
