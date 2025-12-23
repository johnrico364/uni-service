import 'package:flutter/material.dart';
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
	final _formKey = GlobalKey<FormState>();

	@override
	Widget build(BuildContext context) {
		final content = Scaffold(
			appBar: AppBar(title: const Text('Register')),
			body: BlocListener<BlocBloc, BlocState>(
					listener: (context, state) {
						if (state is AuthLoading) {
							showDialog(
								context: context,
								barrierDismissible: false,
								builder: (_) => const Center(child: CircularProgressIndicator()),
							);
						} else {
							if (Navigator.canPop(context)) Navigator.popUntil(context, (route) => route.isFirst || route.settings.name != null);
						}

						if (state is AuthAuthenticated) {
							ScaffoldMessenger.of(context).showSnackBar(
									const SnackBar(content: Text('Registration successful')));
							Navigator.of(context).pop();
						}

						if (state is AuthError) {
							ScaffoldMessenger.of(context)
									.showSnackBar(SnackBar(content: Text(state.message)));
						}
					},
					  child: Padding(
						padding: const EdgeInsets.all(16.0),
						child: Form(
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
												BlocProvider.of<BlocBloc>(context).add(RegisterRequested(
															email: _emailController.text.trim(),
															password: _passwordController.text.trim(),
														));
											}
										},
										child: const Text('Create account'),
									),
								],
							),
						),
					),
				),
			);

			// If a bloc instance was provided, reuse it; otherwise provide a local bloc.
			if (widget.bloc != null) {
				return BlocProvider.value(
					value: widget.bloc!,
					child: content,
				);
			}

			return BlocProvider(
				create: (_) => BlocBloc(authService: AuthService()),
				child: content,
			);
    
		
	}
}

