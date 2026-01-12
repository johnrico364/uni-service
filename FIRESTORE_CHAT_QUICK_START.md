# Firebase Firestore Chat - Quick Integration Guide

## 🎯 What You Get

A **production-ready real-time chat system** with:
- ✅ Real-time message streaming
- ✅ Conversation management
- ✅ User profiles
- ✅ Search & filter
- ✅ Unread badges
- ✅ Automatic timestamps
- ✅ Message bubbles (sender/receiver)

## 📁 Files Created

### Core Files
```
lib/core/
├── models/
│   └── chat_models.dart                    # ChatUser, ChatMessage, Conversation
└── services/
    └── firestore_chat_service.dart         # All Firestore operations
```

### UI Files
```
lib/features/pages/message/screen/
├── message_screen_firestore.dart           # Conversation list (NEW)
├── chat_screen.dart                        # Real-time chat (UPDATED)
└── message_card.dart                       # (old version)
```

### Documentation
```
FIRESTORE_CHAT_SETUP.md                     # Complete setup guide
```

## 🚀 Quick Start (5 Steps)

### Step 1: Enable Firestore
1. Open [Firebase Console](https://console.firebase.google.com)
2. Go to **Firestore Database**
3. Click **Create Database**
4. Choose **Test mode** and your region
5. Click **Enable**

### Step 2: Update pubspec.yaml
```yaml
dependencies:
  cloud_firestore: ^6.1.1
  firebase_auth: ^6.1.3
  intl: ^0.19.0
```

Run: `flutter pub get`

### Step 3: Replace Message Screen
In your bottom navigation or routing, update to use the Firestore version:

**Before:**
```dart
import 'lib/features/pages/message/screen/message_screen.dart';

// In BottomNavigator
const MessageScreen(),  // Static version
```

**After:**
```dart
import 'lib/features/pages/message/screen/message_screen_firestore.dart';

// In BottomNavigator
const MessageScreen(),  // Real-time Firestore version
```

### Step 4: Check Firebase Auth
Ensure you have Firebase Auth configured (you already have this):
```dart
// main.dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}
```

### Step 5: Test
1. Sign in as User A
2. Go to Messages tab
3. Create a conversation (tap on a user)
4. Send a message
5. Sign out and sign in as User B
6. See User A's message in real-time! 🎉

## 📊 Database Structure

```
Firestore Collections:

conversations/
  └── alice_bob/  (document ID: participant1_uid_participant2_uid)
      ├── participant1Uid: "alice_uid"
      ├── participant1Name: "Alice"
      ├── lastMessage: "Hi Bob!"
      ├── lastMessageTime: 2025-01-06T...
      └── messages/  (subcollection)
          ├── msg_1/
          │   ├── senderUid: "bob_uid"
          │   ├── message: "Hi Bob!"
          │   └── timestamp: 2025-01-06T...
          └── msg_2/
              ├── senderUid: "bob_uid"
              ├── message: "How are you?"
              └── timestamp: 2025-01-06T...

users/
  ├── alice_uid/
  │   ├── uid: "alice_uid"
  │   ├── name: "Alice"
  │   ├── email: "alice@example.com"
  │   └── profileImage: "url"
  └── bob_uid/
      ├── uid: "bob_uid"
      ├── name: "Bob"
      ├── email: "bob@example.com"
      └── profileImage: "url"
```

## 🔄 How It Works

### Sending a Message
```
User types message in TextField
           ↓
User taps Send button
           ↓
_sendMessage() called
           ↓
Message written to Firestore:
  /conversations/{convId}/messages/{msgId}
           ↓
Conversation's lastMessage updated
           ↓
StreamBuilder listens to messages collection
           ↓
New message appears in real-time! ✨
```

### Receiving a Message
```
Firebase Firestore sends real-time update
           ↓
Stream listener in ChatScreen receives it
           ↓
StreamBuilder rebuilds
           ↓
New message added to ListView
           ↓
Automatically scrolls to latest
```

## 🎨 Features Breakdown

### 1. Message List (message_screen_firestore.dart)
- Displays all conversations
- Real-time updates
- Search by participant name
- Filter unread messages
- Shows last message preview
- Unread message badges

### 2. Chat Screen (chat_screen.dart)
- Real-time message display
- Auto-scroll to latest
- Message bubbles (blue for sender, gray for receiver)
- Timestamp for each message
- Loading indicator on send
- Error handling

### 3. Firestore Service (firestore_chat_service.dart)
Methods available:
```dart
// Get conversations
getConversationsStream() → Stream<List<Conversation>>

// Get messages
getMessagesStream(conversationId) → Stream<List<ChatMessage>>

// Send message
sendMessage(conversationId, message) → Future<void>

// Create conversation
getOrCreateConversation(otherUser) → Future<Conversation>

// More operations...
deleteMessage()
searchUsers()
markConversationAsRead()
```

## 🛡️ Security Rules (Test Mode)

Currently using test mode (everyone can read/write):

**For Production, update Firestore rules to:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /conversations/{conversationId} {
      allow read, write: if request.auth.uid == resource.data.participant1Uid 
                         || request.auth.uid == resource.data.participant2Uid;
      match /messages/{messageId} {
        allow read, write: if request.auth.uid == resource.data.senderUid;
      }
    }
  }
}
```

(See FIRESTORE_CHAT_SETUP.md for complete rules)

## 🐛 Troubleshooting

### Messages Not Appearing
```
✓ Check Firestore is enabled
✓ Check users are authenticated
✓ Check conversation ID is correct
✓ Check messages subcollection exists
```

### Permission Denied Error
```
✓ Update Firestore Security Rules
✓ Ensure user is logged in
✓ Check user UID matches
```

### Images Not Loading
```
✓ Use valid image URLs
✓ Check CORS if using external images
✓ Use Firebase Storage for images (optional)
```

### Slow Performance
```
✓ Limit messages with .limit(50)
✓ Create Firestore indexes
✓ Use pagination for older messages
```

## 📚 Key Classes

### ChatUser
```dart
ChatUser(
  uid: 'user_id',
  name: 'John Doe',
  email: 'john@example.com',
  profileImage: 'url_to_image', // optional
)
```

### ChatMessage
```dart
ChatMessage(
  id: 'msg_id',
  senderUid: 'uid',
  senderName: 'John',
  message: 'Hello!',
  timestamp: DateTime.now(),
  type: 'text', // 'text', 'image', etc.
)
```

### Conversation
```dart
Conversation(
  id: 'participant1_participant2',
  participant1Uid: 'uid1',
  participant2Uid: 'uid2',
  participant2Name: 'Bob',
  lastMessage: 'Hi there!',
  lastMessageTime: DateTime.now(),
  unreadCount: 3,
)
```

## 🔗 Integration Example

```dart
// In your screen
final chatService = FirestoreChatService();

// Get all conversations (real-time)
StreamBuilder<List<Conversation>>(
  stream: chatService.getConversationsStream(),
  builder: (context, snapshot) {
    if (!snapshot.hasData) return Loading();
    
    final conversations = snapshot.data!;
    return ListView.builder(
      itemCount: conversations.length,
      itemBuilder: (context, index) {
        final conv = conversations[index];
        return ConversationTile(conversation: conv);
      },
    );
  },
)

// Get messages in a conversation (real-time)
StreamBuilder<List<ChatMessage>>(
  stream: chatService.getMessagesStream(conversationId),
  builder: (context, snapshot) {
    if (!snapshot.hasData) return Loading();
    
    final messages = snapshot.data!;
    return ListView.builder(
      itemCount: messages.length,
      itemBuilder: (context, index) {
        final msg = messages[index];
        return MessageBubble(message: msg);
      },
    );
  },
)

// Send a message
await chatService.sendMessage(
  conversationId: 'conv_id',
  message: 'Hello!',
);
```

## ✅ Checklist

- [ ] Firestore enabled in Firebase Console
- [ ] pubspec.yaml updated with `intl: ^0.19.0`
- [ ] `flutter pub get` run
- [ ] Message screen updated to use `message_screen_firestore.dart`
- [ ] Two test accounts created
- [ ] Successfully sent test message
- [ ] Message appears in real-time on other account
- [ ] Firestore Security Rules updated (for production)

## 🎓 Next Steps

1. **Test the chat system** - Send messages between two accounts
2. **Add images to messages** - Extend ChatMessage.type
3. **Add typing indicators** - Show "User is typing..."
4. **Add message reactions** - Like/emoji reactions
5. **Add voice messages** - Record and send audio
6. **Deploy to production** - Update security rules first!

## 📞 Support

For detailed information, see **FIRESTORE_CHAT_SETUP.md**

Issues?
- Check Firestore console for data
- Verify users are authenticated
- Check browser console for errors
- Review security rules permissions

## 🚀 You're All Set!

Your chat system is now:
- ✅ Connected to Firebase Firestore
- ✅ Real-time synced across devices
- ✅ Persistent (data saved in cloud)
- ✅ Scalable (no local storage limit)
- ✅ Secure (with proper auth rules)

Start chatting! 💬
