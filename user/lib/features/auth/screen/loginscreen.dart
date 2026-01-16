import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/bloc_bloc.dart';
import '../auth_service.dart';
import 'registerscreen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _obscurePassword = true;
  BlocBloc? _bloc;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        _bloc = BlocBloc(authService: AuthService());
        return _bloc!;
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF6A74FF),
        body: BlocListener<BlocBloc, BlocState>(
          listener: (context, state) {
            if (state is AuthLoading) {
              showDialog(
                context: context,
                barrierDismissible: false,
                builder:
                    (_) => const Center(child: CircularProgressIndicator()),
              );
            } else {
              // Close loading dialog if open
              if (Navigator.canPop(context)) Navigator.pop(context);
            }

            if (state is AuthAuthenticated) {
              // Close any open dialogs
              if (Navigator.canPop(context)) Navigator.pop(context);
              // Navigation is handled by StreamBuilder in main.dart
              // Firebase auth state change will automatically trigger rebuild
            }

            if (state is AuthError) {
              setState(() {
                _errorMessage = state.message;
              });
            } else {
              // Clear error message when state changes to non-error
              if (_errorMessage != null) {
                setState(() {
                  _errorMessage = null;
                });
              }
            }
          },
          child: Container(
            color: const Color(0xFF6A74FF),
            child: SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 22,
                  vertical: 18,
                ),
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 420),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        children: [
                          const SizedBox(height: 10),
                          SizedBox(
                            height: 160,
                            width: 160,
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                Container(
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.22),
                                        blurRadius: 18,
                                        offset: const Offset(0, 8),
                                      ),
                                    ],
                                  ),
                                  child: const CircleAvatar(
                                    radius: 80,
                                    backgroundColor: Colors.transparent,
                                    backgroundImage: AssetImage(
                                      'assets/images/splashscreen/moon.png',
                                    ),
                                  ),
                                ),
                                Image.asset(
                                  'assets/images/splashscreen/witch.png',
                                  width: 135,
                                  fit: BoxFit.contain,
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 6),

                          const Text(
                            'MAGICBOOKING',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontFamily: 'Cinzel Decorative',
                              fontSize: 40,
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                              height: 1.0,
                            ),
                          ),

                          const SizedBox(height: 10),

                          Text(
                            'Powered by magic, built for convenience.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.85),
                              fontSize: 12,
                            ),
                          ),

                          const SizedBox(height: 15),

                          const Text(
                            'A new way to deliver',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Colors.black87,
                              fontSize: 16,
                              fontFamily: 'Cinzel Decorative',
                              fontWeight: FontWeight.w500,
                            ),
                          ),

                          const SizedBox(height: 30),

                          // Error message above email field
                          if (_errorMessage != null)
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 12,
                              ),
                              margin: const EdgeInsets.only(bottom: 16),
                              decoration: BoxDecoration(
                                color: Colors.redAccent.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(
                                  color: Colors.redAccent,
                                  width: 1.5,
                                ),
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.error_outline,
                                    color: Colors.redAccent,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      _errorMessage!,
                                      style: const TextStyle(
                                        color: Colors.redAccent,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                          // Email field with floating label
                          TextFormField(
                            onChanged: (value) {
                              // Clear error when user starts typing
                              if (_errorMessage != null) {
                                setState(() {
                                  _errorMessage = null;
                                });
                              }
                            },
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            style: const TextStyle(color: Colors.white),
                            cursorColor: Colors.white,
                            decoration: InputDecoration(
                              labelText: 'Email',
                              labelStyle: TextStyle(
                                color: Colors.black.withOpacity(0.6),
                              ),
                              floatingLabelStyle: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w500,
                              ),
                              prefixIcon: Icon(
                                Icons.email_outlined,
                                color: Colors.black.withOpacity(0.6),
                              ),
                              filled: true,
                              fillColor: Colors.transparent,
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: Colors.black54,
                                  width: 1.2,
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: Colors.white,
                                  width: 1.5,
                                ),
                              ),
                              errorBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: Colors.redAccent,
                                  width: 1.2,
                                ),
                              ),
                              focusedErrorBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: Colors.redAccent,
                                  width: 1.5,
                                ),
                              ),
                            ),
                            validator: (v) {
                              if (v == null || v.isEmpty) {
                                return 'Enter email';
                              }
                              if (!v.contains('@') || !v.contains('.')) {
                                return 'Enter a valid email';
                              }
                              return null;
                            },
                          ),

                          const SizedBox(height: 16),

                          // Password field with floating label
                          TextFormField(
                            controller: _passwordController,
                            keyboardType: TextInputType.text,
                            obscureText: _obscurePassword,
                            style: const TextStyle(color: Colors.white),
                            cursorColor: Colors.white,
                            decoration: InputDecoration(
                              labelText: 'Password',
                              labelStyle: TextStyle(
                                color: Colors.black.withOpacity(0.6),
                              ),
                              floatingLabelStyle: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w500,
                              ),
                              prefixIcon: Icon(
                                Icons.lock_outline,
                                color: Colors.black.withOpacity(0.6),
                              ),
                              suffixIcon: IconButton(
                                onPressed:
                                    () => setState(
                                      () =>
                                          _obscurePassword = !_obscurePassword,
                                    ),
                                icon: Icon(
                                  _obscurePassword
                                      ? Icons.visibility_off
                                      : Icons.visibility,
                                  color: Colors.black.withOpacity(0.6),
                                ),
                              ),
                              filled: true,
                              fillColor: Colors.transparent,
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: Colors.black54,
                                  width: 1.2,
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: Colors.white,
                                  width: 1.5,
                                ),
                              ),
                              errorBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: Colors.redAccent,
                                  width: 1.2,
                                ),
                              ),
                              focusedErrorBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: Colors.redAccent,
                                  width: 1.5,
                                ),
                              ),
                            ),
                            validator:
                                (v) =>
                                    v == null || v.length < 6
                                        ? 'Min 6 characters'
                                        : null,
                          ),

                          const SizedBox(height: 10),

                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () {},
                              child: const Text(
                                'Forgot Password?',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 10),

                          // Log in button
                          SizedBox(
                            width: double.infinity,
                            height: 56,
                            child: ElevatedButton(
                              onPressed: () {
                                if (_formKey.currentState!.validate()) {
                                  _bloc?.add(
                                    LoginRequested(
                                      email: _emailController.text.trim(),
                                      password: _passwordController.text.trim(),
                                    ),
                                  );
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.black,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              child: const Text(
                                'Log in',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 18),

                          // Or divider
                          Row(
                            children: [
                              Expanded(
                                child: Divider(
                                  color: Colors.white.withOpacity(0.8),
                                  thickness: 1,
                                ),
                              ),
                              const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 12),
                                child: Text(
                                  'Or',
                                  style: TextStyle(
                                    color: Colors.black87,
                                    fontSize: 14,
                                    fontFamily: 'Cinzel Decorative',
                                  ),
                                ),
                              ),
                              Expanded(
                                child: Divider(
                                  color: Colors.white.withOpacity(0.8),
                                  thickness: 1,
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 14),

                          // Google button
                          SizedBox(
                            width: double.infinity,
                            height: 56,
                            child: ElevatedButton(
                              onPressed: () {
                                _bloc?.add(LoginWithGoogle());
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFE6E6E6),
                                foregroundColor: Colors.black87,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Image.asset(
                                    'assets/images/splashscreen/google-logo.png',
                                    width: 24,
                                    height: 24,
                                  ),
                                  const SizedBox(width: 10),
                                  const Text(
                                    'Sign In with Google',
                                    style: TextStyle(
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),

                          const SizedBox(height: 24),

                          // Register text
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "Don't have an account? ",
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.9),
                                  fontSize: 12,
                                ),
                              ),
                              GestureDetector(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => const RegisterScreen(),
                                    ),
                                  );
                                },
                                child: const Text(
                                  'Register here',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    decoration: TextDecoration.underline,
                                    decorationColor: Colors.white,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
