import 'dart:convert';
import 'dart:io';

class WordDefinition {
  final String source;
  final String text;
  const WordDefinition(this.source, this.text);
}

/// Dictionary definitions from the same JSON buckets the website serves (public/defs/N.json).
class DefinitionService {
  static const _base = 'https://sozdil.vercel.app/defs';
  static final Map<int, Map<String, dynamic>> _buckets = {};

  // Must match getWordBucket() in lib/definitions.ts (UTF-16 code units, 200 buckets)
  static int bucketOf(String word) {
    var hash = 0;
    for (final cu in word.codeUnits) {
      hash = (hash * 31 + cu) & 0xFFFFFFFF;
    }
    return hash % 200;
  }

  static String _clean(String t) => t.replaceAll(RegExp(r'\s+([.,;:!?])'), r'$1').replaceAll(RegExp(r'\s+'), ' ').trim();

  static Future<List<WordDefinition>> fetch(String word) async {
    final w = word.toUpperCase().trim();
    if (w.isEmpty) return [];
    final b = bucketOf(w);
    var data = _buckets[b];
    if (data == null) {
      HttpClient? client;
      try {
        client = HttpClient()..connectionTimeout = const Duration(seconds: 6);
        final req = await client.getUrl(Uri.parse('$_base/$b.json'));
        final res = await req.close();
        if (res.statusCode != 200) return [];
        data = jsonDecode(await res.transform(utf8.decoder).join()) as Map<String, dynamic>;
        _buckets[b] = data;
      } catch (_) {
        return []; // offline: the sheet falls back to the Sozdikqor link
      } finally {
        client?.close();
      }
    }
    final raw = data[w];
    if (raw is! List) return [];
    return raw
        .whereType<Map>()
        .map((d) => WordDefinition('${d['s'] ?? ''}', _clean('${d['t'] ?? ''}')))
        .where((d) => d.text.isNotEmpty)
        .toList();
  }
}
