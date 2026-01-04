part of 'bloc_bloc.dart';

@immutable
sealed class BlocEvent {}

final class LoginRequested extends BlocEvent {
	final String email;
	final String password;
	LoginRequested({required this.email, required this.password});
}

final class RegisterRequested extends BlocEvent {
	final String email;
	final String password;
	RegisterRequested({required this.email, required this.password});
}

final class LogoutRequested extends BlocEvent {}

final class LoginWithGoogle extends BlocEvent {}
