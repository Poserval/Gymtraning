import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:gym_training/app/theme.dart';
import 'package:gym_training/presentation/screens/splash_screen.dart';
import 'package:gym_training/presentation/screens/home_screen.dart';

final _router = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(
      path: '/splash',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomeScreen(),
    ),
  ],
);

class GymTrainingApp extends StatelessWidget {
  const GymTrainingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Gym Training',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: _router,
      debugShowCheckedModeBanner: false,
    );
  }
}
