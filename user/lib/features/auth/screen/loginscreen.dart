import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/bloc_bloc.dart';
import '../auth_service.dart';
import 'registerscreen.dart';
import '../../landing/landingpage.dart';

class LoginScreen extends StatefulWidget {
	const LoginScreen({super.key});

	@override
	State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
	final _emailController = TextEditingController();
	final _passwordController = TextEditingController();
	final _formKey = GlobalKey<FormState>();

	@override
	Widget build(BuildContext context) {
		return BlocProvider(
			create: (_) => BlocBloc(authService: AuthService()),
			child: Scaffold(
				appBar: AppBar(title: const Text('Login')),
				body: BlocListener<BlocBloc, BlocState>(
					listener: (context, state) {
						if (state is AuthLoading) {
							showDialog(
								context: context,
								barrierDismissible: false,
								builder: (_) => const Center(child: CircularProgressIndicator()),
							);
						} else {
							// close any loading dialog
							if (Navigator.canPop(context)) Navigator.popUntil(context, (route) => route.isFirst || route.settings.name != null);
						}

						if (state is AuthAuthenticated) {
							ScaffoldMessenger.of(context).showSnackBar(
									const SnackBar(content: Text('Login successful')));
							Navigator.of(context).pushAndRemoveUntil(
								MaterialPageRoute(builder: (_) => const LandingPage()),
								(route) => false,
							);
						}

						if (state is AuthError) {
							ScaffoldMessenger.of(context)
									.showSnackBar(SnackBar(content: Text(state.message)));
						}
					},
					child: Padding(
						padding: const EdgeInsets.all(16.0),
						child: Builder(builder: (innerContext) {
							return Form(
							key: _formKey,
							child: Column(
								mainAxisAlignment: MainAxisAlignment.center,
								children: [
									TextFormField(
										controller: _emailController,
										keyboardType: TextInputType.emailAddress,
										decoration: const InputDecoration(labelText: 'Email'),
										validator: (v) => (v == null || v.isEmpty) ? 'Enter email' : null,
									),
									const SizedBox(height: 12),
									TextFormField(
										controller: _passwordController,
										obscureText: true,
										decoration: const InputDecoration(labelText: 'Password'),
										validator: (v) => (v == null || v.length < 6) ? 'Password min 6 chars' : null,
									),
									const SizedBox(height: 20),
									ElevatedButton(
										onPressed: () {
											if (_formKey.currentState!.validate()) {
												BlocProvider.of<BlocBloc>(innerContext).add(LoginRequested(
															email: _emailController.text.trim(),
															password: _passwordController.text.trim(),
														));
											}
										},
										child: const Text('Login'),
									),
									const SizedBox(height: 12),
									TextButton(
										onPressed: () {
											Navigator.of(innerContext).push(
												MaterialPageRoute(
																	builder: (_) => BlocProvider.value(
																				value: BlocProvider.of<BlocBloc>(innerContext),
																				child: const RegisterScreen(),
																		),
												),
											);
										},
										child: const Text('Create an account'),
									),
								],
							),
						);
						}),
					),
				),
			),
		);
	}
}

