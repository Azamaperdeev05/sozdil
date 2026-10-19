import 'package:flutter/material.dart';
import '../services/storage_service.dart';

/// App-wide light / dark / system choice, persisted in SharedPreferences.
class ThemeController {
  static final ValueNotifier<ThemeMode> mode = ValueNotifier(ThemeMode.system);

  static void load() {
    mode.value = switch (StorageService.getThemeMode()) {
      'light' => ThemeMode.light,
      'dark' => ThemeMode.dark,
      _ => ThemeMode.system,
    };
  }

  static void set(ThemeMode m) {
    mode.value = m;
    StorageService.setThemeMode(m == ThemeMode.light ? 'light' : m == ThemeMode.dark ? 'dark' : 'system');
  }
}
