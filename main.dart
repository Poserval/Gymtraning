import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gym_training/app/app.dart';
import 'package:hive_flutter/hive_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Инициализируем Hive (база данных)
  await Hive.initFlutter();
  // Регистрируем адаптеры (создадим позже)
  // Hive.registerAdapter(ExerciseAdapter());
  
  runApp(
    const ProviderScope(
      child: GymTrainingApp(),
    ),
  );
}
