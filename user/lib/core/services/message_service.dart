import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class MessageModel {
  final String id;
  final String senderId;
  final String receiverId;
  final String message;
  final DateTime timestamp;
  final bool isRead;
  final String? type; // 'service' or 'product'

  MessageModel({
    required this.id,
    required this.senderId,
    required this.receiverId,
    required this.message,
    required this.timestamp,
    this.isRead = false,
    this.type,
  });

  factory MessageModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return MessageModel(
      id: doc.id,
      senderId: data['sender_id'] ?? data['senderId'] ?? '',
      receiverId: data['receiver_id'] ?? data['receiverId'] ?? '',
      message: data['message'] ?? '',
      timestamp: (data['timestamp'] as Timestamp?)?.toDate() ?? DateTime.now(),
      isRead: data['is_read'] ?? data['isRead'] ?? false,
      type: data['type'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'sender_id': senderId,
      'receiver_id': receiverId,
      'message': message,
      'timestamp': Timestamp.fromDate(timestamp),
      'is_read': isRead,
      'type': type,
    };
  }
}

class MessageConversation {
  final String userId;
  final String userName;
  final String? userAvatar;
  final String lastMessage;
  final DateTime lastMessageTime;
  final bool hasUnread;
  final String? type; // 'service' or 'product'

  MessageConversation({
    required this.userId,
    required this.userName,
    this.userAvatar,
    required this.lastMessage,
    required this.lastMessageTime,
    this.hasUnread = false,
    this.type,
  });
}

class MessageService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Get current user ID
  String? get currentUserId => _auth.currentUser?.uid;

  // Fetch all conversations for the current user
  Stream<List<MessageConversation>> getConversations() {
    final userId = currentUserId;
    if (userId == null) return Stream.value([]);

    return _firestore
        .collection('messages')
        .where('receiver_id', isEqualTo: userId)
        .orderBy('timestamp', descending: true)
        .snapshots()
        .asyncMap((snapshot) async {
      // Group messages by sender
      final Map<String, MessageConversation> conversations = {};
      
      for (var doc in snapshot.docs) {
        final message = MessageModel.fromFirestore(doc);
        final senderId = message.senderId;
        
        if (!conversations.containsKey(senderId)) {
          // Fetch sender details
          final senderDoc = await _firestore
              .collection('users')
              .doc(senderId)
              .get();
          
          if (senderDoc.exists) {
            final senderData = senderDoc.data() as Map<String, dynamic>;
            final senderName = '${senderData['first_name'] ?? senderData['firstName'] ?? ''} ${senderData['last_name'] ?? senderData['lastName'] ?? ''}'.trim();
            
            conversations[senderId] = MessageConversation(
              userId: senderId,
              userName: senderName.isEmpty ? 'Unknown User' : senderName,
              userAvatar: senderData['profile_image'] ?? senderData['profileImage'],
              lastMessage: message.message,
              lastMessageTime: message.timestamp,
              hasUnread: !message.isRead,
              type: message.type,
            );
          }
        } else {
          // Update if this is a newer message
          final existing = conversations[senderId]!;
          if (message.timestamp.isAfter(existing.lastMessageTime)) {
            conversations[senderId] = MessageConversation(
              userId: existing.userId,
              userName: existing.userName,
              userAvatar: existing.userAvatar,
              lastMessage: message.message,
              lastMessageTime: message.timestamp,
              hasUnread: existing.hasUnread || !message.isRead,
              type: message.type ?? existing.type,
            );
          }
        }
      }
      
      return conversations.values.toList()
        ..sort((a, b) => b.lastMessageTime.compareTo(a.lastMessageTime));
    });
  }

  // Fetch conversations once (for search)
  Future<List<MessageConversation>> fetchConversations() async {
    final userId = currentUserId;
    if (userId == null) return [];

    try {
      final snapshot = await _firestore
          .collection('messages')
          .where('receiver_id', isEqualTo: userId)
          .orderBy('timestamp', descending: true)
          .get();

      final Map<String, MessageConversation> conversations = {};
      
      for (var doc in snapshot.docs) {
        final message = MessageModel.fromFirestore(doc);
        final senderId = message.senderId;
        
        if (!conversations.containsKey(senderId)) {
          final senderDoc = await _firestore
              .collection('users')
              .doc(senderId)
              .get();
          
          if (senderDoc.exists) {
            final senderData = senderDoc.data() as Map<String, dynamic>;
            final senderName = '${senderData['first_name'] ?? senderData['firstName'] ?? ''} ${senderData['last_name'] ?? senderData['lastName'] ?? ''}'.trim();
            
            conversations[senderId] = MessageConversation(
              userId: senderId,
              userName: senderName.isEmpty ? 'Unknown User' : senderName,
              userAvatar: senderData['profile_image'] ?? senderData['profileImage'],
              lastMessage: message.message,
              lastMessageTime: message.timestamp,
              hasUnread: !message.isRead,
              type: message.type,
            );
          }
        }
      }
      
      return conversations.values.toList()
        ..sort((a, b) => b.lastMessageTime.compareTo(a.lastMessageTime));
    } catch (e) {
      print('Error fetching conversations: $e');
      return [];
    }
  }

  // Get messages for a specific conversation
  Stream<List<MessageModel>> getMessages(String otherUserId) {
    final userId = currentUserId;
    if (userId == null) return Stream.value([]);

    // Query messages where current user is sender and other user is receiver
    // OR current user is receiver and other user is sender
    // We'll use a composite query approach
    return _firestore
        .collection('messages')
        .where('sender_id', isEqualTo: userId)
        .where('receiver_id', isEqualTo: otherUserId)
        .orderBy('timestamp', descending: false)
        .snapshots()
        .asyncMap((snapshot1) async {
      // Also fetch reverse direction
      final snapshot2 = await _firestore
          .collection('messages')
          .where('sender_id', isEqualTo: otherUserId)
          .where('receiver_id', isEqualTo: userId)
          .orderBy('timestamp', descending: false)
          .get();

      final allMessages = <MessageModel>[];
      allMessages.addAll(
        snapshot1.docs.map((doc) => MessageModel.fromFirestore(doc)),
      );
      allMessages.addAll(
        snapshot2.docs.map((doc) => MessageModel.fromFirestore(doc)),
      );

      // Sort by timestamp
      allMessages.sort((a, b) => a.timestamp.compareTo(b.timestamp));
      return allMessages;
    });
  }

  // Fetch messages once for a conversation
  Future<List<MessageModel>> fetchMessages(String otherUserId) async {
    final userId = currentUserId;
    if (userId == null) return [];

    try {
      // Fetch messages where current user is sender
      final snapshot1 = await _firestore
          .collection('messages')
          .where('sender_id', isEqualTo: userId)
          .where('receiver_id', isEqualTo: otherUserId)
          .orderBy('timestamp', descending: false)
          .get();

      // Fetch messages where current user is receiver
      final snapshot2 = await _firestore
          .collection('messages')
          .where('sender_id', isEqualTo: otherUserId)
          .where('receiver_id', isEqualTo: userId)
          .orderBy('timestamp', descending: false)
          .get();

      final allMessages = <MessageModel>[];
      allMessages.addAll(
        snapshot1.docs.map((doc) => MessageModel.fromFirestore(doc)),
      );
      allMessages.addAll(
        snapshot2.docs.map((doc) => MessageModel.fromFirestore(doc)),
      );

      // Sort by timestamp
      allMessages.sort((a, b) => a.timestamp.compareTo(b.timestamp));
      return allMessages;
    } catch (e) {
      print('Error fetching messages: $e');
      return [];
    }
  }

  // Send a message
  Future<void> sendMessage({
    required String receiverId,
    required String message,
    String? type,
  }) async {
    final userId = currentUserId;
    if (userId == null) throw Exception('User not authenticated');

    await _firestore.collection('messages').add({
      'sender_id': userId,
      'receiver_id': receiverId,
      'message': message,
      'timestamp': FieldValue.serverTimestamp(),
      'is_read': false,
      'type': type,
    });
  }
}
