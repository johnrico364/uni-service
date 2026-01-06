import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String? phone;
  final String? profileImage;
  final String role;
  final String status;

  UserModel({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.phone,
    this.profileImage,
    required this.role,
    required this.status,
  });

  String get fullName => '$firstName $lastName';

  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return UserModel(
      id: doc.id,
      firstName: data['first_name'] ?? data['firstName'] ?? '',
      lastName: data['last_name'] ?? data['lastName'] ?? '',
      email: data['email'] ?? '',
      phone: data['phone'],
      profileImage: data['profile_image'] ?? data['profileImage'],
      role: data['role'] ?? 'user',
      status: data['status'] ?? 'inactive',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'first_name': firstName,
      'last_name': lastName,
      'email': email,
      'phone': phone,
      'profile_image': profileImage,
      'role': role,
      'status': status,
    };
  }
}

class UserService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Fetch all users (login accounts)
  Stream<List<UserModel>> getAllUsers() {
    return _firestore
        .collection('users')
        .where('role', whereIn: ['user', 'service_provider'])
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => UserModel.fromFirestore(doc))
            .toList());
  }

  // Fetch users once (for search)
  Future<List<UserModel>> fetchAllUsers() async {
    try {
      final snapshot = await _firestore
          .collection('users')
          .where('role', whereIn: ['user', 'service_provider'])
          .get();
      
      return snapshot.docs
          .map((doc) => UserModel.fromFirestore(doc))
          .toList();
    } catch (e) {
      print('Error fetching users: $e');
      return [];
    }
  }

  // Search users by name, email, or phone
  Future<List<UserModel>> searchUsers(String query) async {
    try {
      final allUsers = await fetchAllUsers();
      final lowerQuery = query.toLowerCase();
      
      return allUsers.where((user) {
        return user.fullName.toLowerCase().contains(lowerQuery) ||
            user.email.toLowerCase().contains(lowerQuery) ||
            (user.phone != null && user.phone!.contains(query));
      }).toList();
    } catch (e) {
      print('Error searching users: $e');
      return [];
    }
  }

  // Get user by ID
  Future<UserModel?> getUserById(String userId) async {
    try {
      final doc = await _firestore.collection('users').doc(userId).get();
      if (doc.exists) {
        return UserModel.fromFirestore(doc);
      }
      return null;
    } catch (e) {
      print('Error fetching user: $e');
      return null;
    }
  }
}
