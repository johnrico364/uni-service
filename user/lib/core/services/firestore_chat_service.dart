import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/chat_models.dart';

class FirestoreChatService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Collection references
  CollectionReference get _conversationsRef => _firestore.collection('conversations');
  CollectionReference get _usersRef => _firestore.collection('users');

  // Get current user
  User? get currentUser => _auth.currentUser;

  /// Create or get a conversation between two users
  Future<Conversation> getOrCreateConversation({
    required ChatUser otherUser,
  }) async {
    final currentUserData = currentUser;
    if (currentUserData == null) throw Exception('User not logged in');

    // Create conversation ID from user UIDs (sorted to be consistent)
    final ids = [currentUserData.uid, otherUser.uid]..sort();
    final conversationId = '${ids[0]}_${ids[1]}';

    // Check if conversation exists
    final conversationDoc = await _conversationsRef.doc(conversationId).get();

    if (conversationDoc.exists) {
      return Conversation.fromMap(conversationId, conversationDoc.data() as Map<String, dynamic>);
    }

    // Create new conversation
    final currentUserName = currentUserData.displayName ?? 'Unknown';
    final currentUserImage = currentUserData.photoURL ?? '';

    final conversation = Conversation(
      id: conversationId,
      participant1Uid: currentUserData.uid,
      participant1Name: currentUserName,
      participant1Image: currentUserImage,
      participant2Uid: otherUser.uid,
      participant2Name: otherUser.name,
      participant2Image: otherUser.profileImage ?? '',
      lastMessage: '',
      lastMessageTime: DateTime.now(),
    );

    await _conversationsRef.doc(conversationId).set(conversation.toMap());

    return conversation;
  }

  /// Get all conversations for current user
  Stream<List<Conversation>> getConversationsStream() {
    if (currentUser == null) return Stream.value([]);

    return _conversationsRef
        .where('participant1Uid', isEqualTo: currentUser!.uid)
        .orderBy('lastMessageTime', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        return Conversation.fromMap(doc.id, doc.data() as Map<String, dynamic>);
      }).toList();
    });
  }

  /// Get messages from a conversation
  Stream<List<ChatMessage>> getMessagesStream(String conversationId) {
    return _conversationsRef
        .doc(conversationId)
        .collection('messages')
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        return ChatMessage.fromMap(doc.data() as Map<String, dynamic>);
      }).toList();
    });
  }

  /// Send a message
  Future<void> sendMessage({
    required String conversationId,
    required String message,
  }) async {
    final user = currentUser;
    if (user == null) throw Exception('User not logged in');

    final messageId = _firestore.collection('temp').doc().id;

    final chatMessage = ChatMessage(
      id: messageId,
      senderUid: user.uid,
      senderName: user.displayName ?? 'Unknown',
      senderImage: user.photoURL ?? '',
      message: message,
      timestamp: DateTime.now(),
      type: 'text',
    );

    // Add message to conversation
    await _conversationsRef
        .doc(conversationId)
        .collection('messages')
        .doc(messageId)
        .set(chatMessage.toMap());

    // Update conversation's last message
    await _conversationsRef.doc(conversationId).update({
      'lastMessage': message,
      'lastMessageTime': DateTime.now(),
    });
  }

  /// Delete a message
  Future<void> deleteMessage({
    required String conversationId,
    required String messageId,
  }) async {
    await _conversationsRef
        .doc(conversationId)
        .collection('messages')
        .doc(messageId)
        .delete();
  }

  /// Get other user's info
  Future<ChatUser?> getUserInfo(String uid) async {
    try {
      final userDoc = await _usersRef.doc(uid).get();
      if (userDoc.exists) {
        return ChatUser.fromMap(userDoc.data() as Map<String, dynamic>);
      }
      return null;
    } catch (e) {
      print('Error getting user info: $e');
      return null;
    }
  }

  /// Search users
  Future<List<ChatUser>> searchUsers(String query) async {
    try {
      final snapshot = await _usersRef
          .where('name', isGreaterThanOrEqualTo: query)
          .where('name', isLessThan: '${query}z')
          .get();

      return snapshot.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        return ChatUser.fromMap(data);
      }).toList();
    } catch (e) {
      print('Error searching users: $e');
      return [];
    }
  }

  /// Mark conversation as read
  Future<void> markConversationAsRead(String conversationId) async {
    await _conversationsRef.doc(conversationId).update({
      'unreadCount': 0,
    });
  }

  /// Get conversation by ID
  Future<Conversation?> getConversationById(String conversationId) async {
    try {
      final doc = await _conversationsRef.doc(conversationId).get();
      if (doc.exists) {
        return Conversation.fromMap(doc.id, doc.data() as Map<String, dynamic>);
      }
      return null;
    } catch (e) {
      print('Error getting conversation: $e');
      return null;
    }
  }
}
