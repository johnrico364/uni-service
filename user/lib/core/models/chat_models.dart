// User model for chat
class ChatUser {
  final String uid;
  final String name;
  final String email;
  final String? profileImage;

  ChatUser({
    required this.uid,
    required this.name,
    required this.email,
    this.profileImage,
  });

  // Convert to Map for Firestore
  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'name': name,
      'email': email,
      'profileImage': profileImage,
    };
  }

  // Create from Firestore document
  factory ChatUser.fromMap(Map<String, dynamic> map) {
    return ChatUser(
      uid: map['uid'] ?? '',
      name: map['name'] ?? '',
      email: map['email'] ?? '',
      profileImage: map['profileImage'],
    );
  }
}

// Message model
class ChatMessage {
  final String id;
  final String senderUid;
  final String senderName;
  final String senderImage;
  final String message;
  final DateTime timestamp;
  final String type; // 'text', 'image', etc.

  ChatMessage({
    required this.id,
    required this.senderUid,
    required this.senderName,
    required this.senderImage,
    required this.message,
    required this.timestamp,
    this.type = 'text',
  });

  // Convert to Map for Firestore
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'senderUid': senderUid,
      'senderName': senderName,
      'senderImage': senderImage,
      'message': message,
      'timestamp': timestamp,
      'type': type,
    };
  }

  // Create from Firestore document
  factory ChatMessage.fromMap(Map<String, dynamic> map) {
    return ChatMessage(
      id: map['id'] ?? '',
      senderUid: map['senderUid'] ?? '',
      senderName: map['senderName'] ?? '',
      senderImage: map['senderImage'] ?? '',
      message: map['message'] ?? '',
      timestamp: (map['timestamp'] as dynamic)?.toDate() ?? DateTime.now(),
      type: map['type'] ?? 'text',
    );
  }
}

// Conversation model
class Conversation {
  final String id;
  final String participant1Uid;
  final String participant1Name;
  final String participant1Image;
  final String participant2Uid;
  final String participant2Name;
  final String participant2Image;
  final String lastMessage;
  final DateTime lastMessageTime;
  final int unreadCount;

  Conversation({
    required this.id,
    required this.participant1Uid,
    required this.participant1Name,
    required this.participant1Image,
    required this.participant2Uid,
    required this.participant2Name,
    required this.participant2Image,
    required this.lastMessage,
    required this.lastMessageTime,
    this.unreadCount = 0,
  });

  // Convert to Map for Firestore
  Map<String, dynamic> toMap() {
    return {
      'participant1Uid': participant1Uid,
      'participant1Name': participant1Name,
      'participant1Image': participant1Image,
      'participant2Uid': participant2Uid,
      'participant2Name': participant2Name,
      'participant2Image': participant2Image,
      'lastMessage': lastMessage,
      'lastMessageTime': lastMessageTime,
      'unreadCount': unreadCount,
    };
  }

  // Create from Firestore document
  factory Conversation.fromMap(String id, Map<String, dynamic> map) {
    return Conversation(
      id: id,
      participant1Uid: map['participant1Uid'] ?? '',
      participant1Name: map['participant1Name'] ?? '',
      participant1Image: map['participant1Image'] ?? '',
      participant2Uid: map['participant2Uid'] ?? '',
      participant2Name: map['participant2Name'] ?? '',
      participant2Image: map['participant2Image'] ?? '',
      lastMessage: map['lastMessage'] ?? '',
      lastMessageTime: (map['lastMessageTime'] as dynamic)?.toDate() ?? DateTime.now(),
      unreadCount: map['unreadCount'] ?? 0,
    );
  }
}
