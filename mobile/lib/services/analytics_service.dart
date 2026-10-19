import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'storage_service.dart';

/// Same Supabase table as the website (lib/analytics.ts). Fire-and-forget, never blocks the game.
/// Debug builds send nothing so development traffic stays out of production stats.
class AnalyticsService {
  static const _url = 'https://xbkvmfqefbarpcsfsrav.supabase.co/rest/v1/game_analytics';
  // Public anon key (the same one shipped in the web bundle); writes are limited by RLS.
  static const _anon =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhia3ZtZnFlZmJhcnBjc2ZzcmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTQ1NTYsImV4cCI6MjEwNjA5MDU1Nn0.dDw3QXook7KMJQ2nf6vubQYcvzXqtuBjyRh49RcCwEc';
  static final String _session = 's_${DateTime.now().millisecondsSinceEpoch.toRadixString(36)}';

  static String get _platform => Platform.isIOS ? 'ios' : Platform.isAndroid ? 'android' : Platform.isMacOS ? 'macos' : 'mobile';

  static void track(String eventType, {int? wordLength, int? gameNumber, String? status, int? guessCount, int? durationSeconds, String? solution, Map<String, dynamic>? payload}) {
    if (kDebugMode || kIsWeb) return; // web build here is only a preview, not the product
    final body = <String, dynamic>{
      'event_type': eventType,
      'visitor_id': StorageService.getVisitorId(),
      'session_id': _session,
      'device_type': Platform.isMacOS ? 'desktop' : 'mobile',
      'os': Platform.isIOS ? 'iOS' : Platform.isMacOS ? 'macOS' : 'Android',
      'platform': _platform,
      'language': Platform.localeName,
      'referrer': 'app',
      'is_pwa': false,
      'word_length': ?wordLength,
      'game_number': ?gameNumber,
      'game_status': ?status,
      'guess_count': ?guessCount,
      'duration_seconds': ?durationSeconds,
      'solution_word': ?solution,
      'payload': ?payload,
    };
    _post(body);
  }

  static Future<void> _post(Map<String, dynamic> body) async {
    final client = HttpClient()..connectionTimeout = const Duration(seconds: 5);
    try {
      final req = await client.postUrl(Uri.parse(_url));
      req.headers
        ..set('apikey', _anon)
        ..set('Authorization', 'Bearer $_anon')
        ..contentType = ContentType.json;
      req.add(utf8.encode(jsonEncode(body)));
      await (await req.close()).drain<void>();
    } catch (_) {
      // offline or blocked: analytics must never affect the game
    } finally {
      client.close();
    }
  }
}
