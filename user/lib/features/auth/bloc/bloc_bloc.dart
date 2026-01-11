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
      emit(AuthError(e.message ?? e.code));
    } catch (e) {
      emit(AuthError(e.toString()));
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
      emit(AuthError(e.message ?? e.code));
    } catch (e) {
      emit(AuthError(e.toString()));
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
      emit(AuthError(e.message ?? e.code));
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }

  Future<void> _onLogoutRequested(
      LogoutRequested event, Emitter<BlocState> emit) async {
    emit(AuthLoading());
    await _authService.signOut();
    emit(AuthUnauthenticated());
  }
}
