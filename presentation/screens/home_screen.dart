import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _selectedIndex = 0;

  static final List<Widget> _widgetOptions = <Widget>[
    const Center(child: Text('Мой план (Дни тренировок)')),
    const Center(child: Text('База упражнений')),
    const Center(child: Text('История и прогресс')),
    const Center(child: Text('Настройки')),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gym Training'),
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_today),
            onPressed: () {},
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            // Ваш background2 для всех страниц
            image: AssetImage('assets/icons/background2.png'),
            fit: BoxFit.cover,
          ),
        ),
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.fitness_center),
            label: 'Тренировки',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.list),
            label: 'Упражнения',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.show_chart),
            label: 'Прогресс',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Настройки',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Начать новую тренировку
        },
        child: const Icon(Icons.play_arrow),
      ),
    );
  }
}
