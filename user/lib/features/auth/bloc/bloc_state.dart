part of 'bloc_bloc.dart';

@immutable
sealed class BlocState {}

final class BlocInitial extends BlocState {}

final class AuthLoading extends BlocState {}

final class AuthAuthenticated extends BlocState {
	final String uid;
	final String? email;
	AuthAuthenticated({required this.uid, this.email});
}

final class AuthUnauthenticated extends BlocState {}

final class AuthError extends BlocState {
	final String message;
	AuthError(this.message);
}
