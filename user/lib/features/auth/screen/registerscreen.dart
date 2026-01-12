import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/bloc_bloc.dart';
import '../auth_service.dart';

class RegisterScreen extends StatefulWidget {
  final BlocBloc? bloc;
  const RegisterScreen({super.key, this.bloc});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _agreedToTerms = false;
  BlocBloc? _bloc;

  // Focus nodes to track input focus state
  final _emailFocus = FocusNode();
  final _passwordFocus = FocusNode();
  final _confirmPasswordFocus = FocusNode();

  @override
  void initState() {
    super.initState();
    _emailFocus.addListener(() => setState(() {}));
    _passwordFocus.addListener(() => setState(() {}));
    _confirmPasswordFocus.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _emailFocus.dispose();
    _passwordFocus.dispose();
    _confirmPasswordFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final content = Scaffold(
      backgroundColor: const Color(0xFF6A74FF),
      body: BlocListener<BlocBloc, BlocState>(
        listener: (context, state) {
          if (state is AuthLoading) {
            showDialog(
              context: context,
              barrierDismissible: false,
              builder:
                  (_) => Container(
                    color: Colors.black54,
                    child: const Center(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    ),
                  ),
            );
          } else {
            // Close loading dialog if open
            if (Navigator.canPop(context)) {
              Navigator.pop(context);
            }
          }

          if (state is AuthAuthenticated) {
            // Close loading dialog if still open
            if (Navigator.canPop(context)) {
              Navigator.pop(context);
            }
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Registration successful'),
                backgroundColor: Color(0xFF1a1a2e),
              ),
            );
            // Close register screen to go back to root
            // StreamBuilder in main.dart will detect auth state change and show BottomNavigator
            Navigator.of(context).popUntil((route) => route.isFirst);
          }

          if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          }
        },
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    const SizedBox(height: 40),

                    // Logo Section - Moon with Witch
                    Container(
                      height: 150,
                      width: 150,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFFE8E8F0),
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Moon background
                          Image.asset(
                            'assets/images/splashscreen/moon.png',
                            height: 150,
                            width: 150,
                            fit: BoxFit.cover,
                          ),
                          // Witch silhouette
                          Positioned(
                            child: Image.asset(
                              'assets/images/splashscreen/witch.png',
                              height: 80,
                              fit: BoxFit.contain,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 40),

                    // Email Field
                    _buildInputField(
                      controller: _emailController,
                      focusNode: _emailFocus,
                      labelText: 'Email',
                      isFocused: _emailFocus.hasFocus,
                      keyboardType: TextInputType.emailAddress,
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

                    // Password Field
                    _buildInputField(
                      controller: _passwordController,
                      focusNode: _passwordFocus,
                      labelText: 'Password',
                      isFocused: _passwordFocus.hasFocus,
                      obscureText: _obscurePassword,
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword
                              ? Icons.visibility_off
                              : Icons.visibility,
                          color:
                              _passwordFocus.hasFocus
                                  ? Colors.white
                                  : const Color(0xFF1a1a2e),
                        ),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                      validator:
                          (v) =>
                              (v == null || v.length < 6)
                                  ? 'Password min 6 chars'
                                  : null,
                    ),

                    const SizedBox(height: 16),

                    // Confirm Password Field
                    _buildInputField(
                      controller: _confirmPasswordController,
                      focusNode: _confirmPasswordFocus,
                      labelText: 'Confirm Password',
                      isFocused: _confirmPasswordFocus.hasFocus,
                      obscureText: _obscureConfirmPassword,
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscureConfirmPassword
                              ? Icons.visibility_off
                              : Icons.visibility,
                          color:
                              _confirmPasswordFocus.hasFocus
                                  ? Colors.white
                                  : const Color(0xFF1a1a2e),
                        ),
                        onPressed: () {
                          setState(() {
                            _obscureConfirmPassword = !_obscureConfirmPassword;
                          });
                        },
                      ),
                      validator: (v) {
                        if (v == null || v.isEmpty) {
                          return 'Confirm your password';
                        }
                        if (v != _passwordController.text) {
                          return 'Passwords do not match';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 20),

                    // Terms and Conditions Checkbox
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                          width: 24,
                          height: 24,
                          child: Checkbox(
                            value: _agreedToTerms,
                            onChanged: (value) {
                              setState(() {
                                _agreedToTerms = value ?? false;
                              });
                            },
                            fillColor: WidgetStateProperty.resolveWith((
                              states,
                            ) {
                              if (states.contains(WidgetState.selected)) {
                                return const Color(0xFF1a1a2e);
                              }
                              return Colors.transparent;
                            }),
                            side: const BorderSide(
                              color: Color(0xFF1a1a2e),
                              width: 2,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: RichText(
                            text: TextSpan(
                              style: const TextStyle(
                                fontSize: 14,
                                color: Color(0xFF1a1a2e),
                              ),
                              children: [
                                const TextSpan(
                                  text:
                                      'By checking this box, you agree to be bound by our ',
                                ),
                                TextSpan(
                                  text: 'Terms and Conditions',
                                  style: const TextStyle(
                                    decoration: TextDecoration.underline,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  recognizer:
                                      TapGestureRecognizer()
                                        ..onTap = () {
                                          // Handle terms tap
                                        },
                                ),
                                const TextSpan(text: ' agreement.'),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 30),

                    // Register Button
                    SizedBox(
                      width: double.infinity,
                      height: 55,
                      child: ElevatedButton(
                        onPressed: () {
                          if (_formKey.currentState!.validate()) {
                            if (!_agreedToTerms) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Please agree to Terms and Conditions',
                                  ),
                                  backgroundColor: Colors.red,
                                ),
                              );
                              return;
                            }
                            _bloc?.add(
                              RegisterRequested(
                                email: _emailController.text.trim(),
                                password: _passwordController.text.trim(),
                              ),
                            );
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1a1a2e),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                          elevation: 0,
                        ),
                        child: const Text(
                          'Register',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Or Sign in with
                    const Text(
                      'Or, Sign in with',
                      style: TextStyle(color: Color(0xFF1a1a2e), fontSize: 14),
                    ),

                    const SizedBox(height: 20),

                    // Google Sign In Button
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
                              style: TextStyle(fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 40),

                    // Already have account
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Already have an account?  ",
                          style: TextStyle(
                            color: Color(0xFF1a1a2e),
                            fontSize: 14,
                          ),
                        ),
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: const Text(
                            'Login here',
                            style: TextStyle(
                              color: Color(0xFFFFFFFF),
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );

    // If a bloc instance was provided, reuse it; otherwise provide a local bloc.
    if (widget.bloc != null) {
      _bloc = widget.bloc;
      return BlocProvider.value(value: widget.bloc!, child: content);
    }

    return BlocProvider(
      create: (_) {
        _bloc = BlocBloc(authService: AuthService());
        return _bloc!;
      },
      child: content,
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required FocusNode focusNode,
    required String labelText,
    required bool isFocused,
    bool obscureText = false,
    Widget? suffixIcon,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      focusNode: focusNode,
      obscureText: obscureText,
      keyboardType: keyboardType,
      style: TextStyle(
        color: isFocused ? Colors.white : const Color(0xFF1a1a2e),
        fontSize: 16,
      ),
      decoration: InputDecoration(
        labelText: labelText,
        labelStyle: TextStyle(
          color:
              isFocused
                  ? Colors.white
                  : const Color(0xFF1a1a2e).withOpacity(0.7),
          fontSize: 16,
        ),
        floatingLabelStyle: TextStyle(
          color: isFocused ? Colors.white : const Color(0xFF1a1a2e),
          fontSize: 14,
        ),
        filled: false,
        suffixIcon: suffixIcon,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 20,
          vertical: 18,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFF1a1a2e), width: 1),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFF1a1a2e), width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Colors.white, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Colors.red, width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Colors.red, width: 2),
        ),
      ),
      validator: validator,
    );
  }
}
