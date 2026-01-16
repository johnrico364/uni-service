import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import '../auth_service.dart';
import 'package:firebase_auth/firebase_auth.dart' as fb;

part 'bloc_event.dart';
part 'bloc_state.dart';



class BlocBloc extends Bloc<BlocEvent, BlocState> {
  final AuthService _authService;
  BlocBloc({required AuthService authService})
      : _authService = authService,
        super(BlocInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<LoginWithGoogle>(_onLoginWithGoogle);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
  }

  Future<void> _onLoginRequested(
      LoginRequested event, Emitter<BlocState> emit) async {
    emit(AuthLoading());
    try {
      final user = await _authService.signIn(event.email, event.password);
      if (user != null) {
        emit(AuthAuthenticated(uid: user.uid, email: user.email));
      } else {
        emit(AuthUnauthenticated());
      }
    } on fb.FirebaseAuthException catch (e) {
      emit(AuthError(_getErrorMessage(e)));
    } catch (e) {
      emit(AuthError('An unexpected error occurred. Please try again.'));
    }
  }

  Future<void> _onRegisterRequested(
      RegisterRequested event, Emitter<BlocState> emit) async {
    emit(AuthLoading());
    try {
      final user = await _authService.register(event.email, event.password);
      if (user != null) {
        emit(AuthAuthenticated(uid: user.uid, email: user.email));
      } else {
        emit(AuthUnauthenticated());
      }
    } on fb.FirebaseAuthException catch (e) {
      emit(AuthError(_getErrorMessage(e)));
    } catch (e) {
      emit(AuthError('An unexpected error occurred. Please try again.'));
    }
  }

  Future<void> _onLoginWithGoogle(
      LoginWithGoogle event, Emitter<BlocState> emit) async {
    emit(AuthLoading());
    try {
      final user = await _authService.signInWithGoogle();
      if (user != null) {
        emit(AuthAuthenticated(uid: user.uid, email: user.email));
      } else {
        emit(AuthUnauthenticated());
      }
    } on fb.FirebaseAuthException catch (e) {
      emit(AuthError(_getErrorMessage(e)));
    } catch (e) {
      emit(AuthError('An unexpected error occurred. Please try again.'));
    }
  }

  Future<void> _onLogoutRequested(
      LogoutRequested event, Emitter<BlocState> emit) async {
    emit(AuthLoading());
    await _authService.signOut();
    emit(AuthUnauthenticated());
  }

  String _getErrorMessage(fb.FirebaseAuthException e) {
    switch (e.code) {
      case 'user-not-found':
        return 'No account found with this email address.';
      case 'wrong-password':
        return 'Incorrect password. Please try again.';
      case 'invalid-email':
        return 'The email address is invalid.';
      case 'user-disabled':
        return 'This account has been disabled.';
      case 'email-already-in-use':
        return 'An account already exists with this email address.';
      case 'weak-password':
        return 'The password is too weak. Please use a stronger password.';
      case 'invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return e.message ?? 'An error occurred: ${e.code}';
    }
  }
}
