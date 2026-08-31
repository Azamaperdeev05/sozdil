class ChallengeService {
  static const String _alphabet = 'АӘБВГҒДЕЁЖЗИЙКҚЛМНҢОӨПРСТУҰҮФХҺЦЧШЩЪЫІЬЭЮЯ';
  static const String _b62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  static final BigInt _mask = BigInt.parse('7E3A95C14B', radix: 16);

  static String _toBase62(BigInt bn) {
    String s = '';
    BigInt n = bn;
    final b62Len = BigInt.from(62);
    while (n > BigInt.zero) {
      final rem = (n % b62Len).toInt();
      s = _b62[rem] + s;
      n = n ~/ b62Len;
    }
    return s.isEmpty ? '0' : s;
  }

  static BigInt? _fromBase62(String str) {
    BigInt res = BigInt.zero;
    final b62Len = BigInt.from(62);
    for (int i = 0; i < str.length; i++) {
      final idx = _b62.indexOf(str[i]);
      if (idx == -1) return null;
      res = res * b62Len + BigInt.from(idx);
    }
    return res;
  }

  static String? encodeChallenge(String word) {
    final clean = word.trim().toUpperCase();
    final len = clean.length;
    if (len < 4 || len > 6) return null;

    BigInt num = BigInt.zero;
    final radix42 = BigInt.from(42);
    for (int i = 0; i < len; i++) {
      final idx = _alphabet.indexOf(clean[i]);
      if (idx == -1) return null;
      num = num * radix42 + BigInt.from(idx);
    }

    final maskVal = _mask + BigInt.from(len) * BigInt.parse('1A2B3C', radix: 16);
    final scrambled = (num ^ maskVal) * BigInt.from(8) + BigInt.from(len);
    return _toBase62(scrambled);
  }

  static String? decodeChallenge(String code) {
    if (code.isEmpty) return null;
    final clean = Uri.decodeComponent(code.trim()).toUpperCase();

    // 1. Plain Kazakh word check
    final kazakhRegex = RegExp(r'^[А-ЯӘІҢҒҮҰҚӨҺЁ]{4,6}$');
    if (kazakhRegex.hasMatch(clean)) {
      return clean;
    }

    // 2. Base62 decode
    try {
      final parsed = _fromBase62(code.trim());
      if (parsed != null) {
        final len = (parsed % BigInt.from(8)).toInt();
        if (len >= 4 && len <= 6) {
          final maskVal = _mask + BigInt.from(len) * BigInt.parse('1A2B3C', radix: 16);
          BigInt num = (parsed ~/ BigInt.from(8)) ^ maskVal;
          final chars = <String>[];
          final radix42 = BigInt.from(42);

          for (int i = 0; i < len; i++) {
            final idx = (num % radix42).toInt();
            if (idx >= 0 && idx < _alphabet.length) {
              chars.insert(0, _alphabet[idx]);
              num = num ~/ radix42;
            }
          }

          if (num == BigInt.zero && chars.length == len) {
            final word = chars.join('');
            if (kazakhRegex.hasMatch(word)) {
              return word;
            }
          }
        }
      }
    } catch (_) {}

    return null;
  }

  static String getChallengeUrl(String word) {
    final code = encodeChallenge(word);
    return 'https://sozdil.vercel.app/?c=${code ?? ''}';
  }
}
