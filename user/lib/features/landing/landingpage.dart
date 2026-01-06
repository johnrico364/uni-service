import 'package:flutter/material.dart';
import '../../shared/bottom_navigator/bottom_navigator.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Landing Page')),
      body: const Center(
        child: Text(
          'LANDING PAGE',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
      bottomNavigationBar: const BottomNavigator(),
    );
  }
}
