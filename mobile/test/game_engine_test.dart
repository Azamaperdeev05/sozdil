import 'package:flutter_test/flutter_test.dart';
import 'package:sozdil_app/models/letter_status.dart';
import 'package:sozdil_app/services/challenge_service.dart';
import 'package:sozdil_app/services/game_engine.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('GameEngine status evaluation tests', () {
    test('Exact match returns all correct', () {
      final statuses = GameEngine.getGuessStatuses('ҚАЗАҚ', 'ҚАЗАҚ');
      expect(statuses, List.filled(5, LetterStatus.correct));
    });

    test('Misplaced letters return present', () {
      final statuses = GameEngine.getGuessStatuses('ҚАЛАМ', 'МАЛАҚ');
      // Қ: solution has Қ at index 4 -> present
      // А: solution has А at 1, 3 -> correct at 1
      // Л: solution has Л at 2 -> correct at 2
      // А: solution has second А at 3 -> correct at 3 (if matches)
      // М: solution has М at 0 -> present
      expect(statuses[0], LetterStatus.present);
      expect(statuses[1], LetterStatus.correct);
      expect(statuses[2], LetterStatus.correct);
    });

    test('Absent letters return absent', () {
      final statuses = GameEngine.getGuessStatuses('БІЛІМ', 'ҚАЗАҚ');
      expect(statuses, List.filled(5, LetterStatus.absent));
    });
  });

  group('ChallengeService encryption/decryption tests', () {
    test('Encodes and decodes Kazakh words correctly', () {
      const testWords = ['ҚЫРАН', 'АЛМАТЫ', 'САМАЛ', 'ӨРКЕН', 'ҮМІТ'];
      for (final word in testWords) {
        final encoded = ChallengeService.encodeChallenge(word);
        expect(encoded, isNotNull);
        expect(encoded!.length, lessThanOrEqualTo(10));

        final decoded = ChallengeService.decodeChallenge(encoded);
        expect(decoded, equals(word));
      }
    });

    test('Direct Kazakh string passes decoding intact', () {
      expect(ChallengeService.decodeChallenge('БАЛЫҚ'), equals('БАЛЫҚ'));
    });
  });
}
