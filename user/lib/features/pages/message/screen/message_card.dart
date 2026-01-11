import 'package:flutter/material.dart';
import '../../../../core/services/message_service.dart';
import '../../../../core/services/user_service.dart';

class ChatScreen extends StatefulWidget {
  final String? userId;
  
  const ChatScreen({super.key, this.userId});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final MessageService _messageService = MessageService();
  final UserService _userService = UserService();
  
  String _userName = 'Loading...';
  String? _userAvatar;
  bool _isLoading = true;
  List<MessageModel> _messages = [];

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _loadMessages();
  }

  Future<void> _loadUserData() async {
    if (widget.userId == null) {
      setState(() {
        _userName = 'Unknown User';
        _isLoading = false;
      });
      return;
    }

    try {
      final user = await _userService.getUserById(widget.userId!);
      if (user != null) {
        setState(() {
          _userName = user.fullName;
          _userAvatar = user.profileImage;
          _isLoading = false;
        });
      } else {
        setState(() {
          _userName = 'Unknown User';
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading user: $e');
      setState(() {
        _userName = 'Unknown User';
        _isLoading = false;
      });
    }
  }

  Future<void> _loadMessages() async {
    if (widget.userId == null) {
      setState(() {
        _messages = [];
      });
      return;
    }

    try {
      final messages = await _messageService.fetchMessages(widget.userId!);
      setState(() {
        _messages = messages;
      });
    } catch (e) {
      print('Error loading messages: $e');
      setState(() {
        _messages = [];
      });
    }
  }

  Future<void> _sendMessage() async {
    if (_messageController.text.trim().isEmpty || widget.userId == null) return;

    try {
      await _messageService.sendMessage(
        receiverId: widget.userId!,
        message: _messageController.text.trim(),
      );
      _messageController.clear();
      _loadMessages(); // Reload messages
    } catch (e) {
      print('Error sending message: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error sending message: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,

      // 🔹 APP BAR
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: Colors.grey.shade300,
              backgroundImage: _userAvatar != null && _userAvatar!.isNotEmpty
                  ? NetworkImage(_userAvatar!)
                  : null,
              child: _userAvatar == null || _userAvatar!.isEmpty
                  ? const Icon(Icons.person, color: Colors.white, size: 18)
                  : null,
            ),
            const SizedBox(width: 10),
            Text(
              _userName,
              style: const TextStyle(
                color: Colors.black,
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),

      // 🔹 BODY
      body: Column(
        children: [
          // Messages
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _messages.isEmpty
                    ? const Center(
                        child: Text(
                          'No messages yet',
                          style: TextStyle(color: Colors.grey),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        itemCount: _messages.length,
                        itemBuilder: (context, index) {
                          final message = _messages[index];
                          final isCurrentUser = message.senderId == _messageService.currentUserId;
                          
                          return Align(
                            alignment: isCurrentUser
                                ? Alignment.centerRight
                                : Alignment.centerLeft,
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
                              ),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 14,
                                  vertical: 10,
                                ),
                                constraints: const BoxConstraints(maxWidth: 260),
                                decoration: BoxDecoration(
                                  color: isCurrentUser
                                      ? const Color(0xFF6C7CFF)
                                      : Colors.grey.shade200,
                                  borderRadius: BorderRadius.circular(18),
                                ),
                                child: Text(
                                  message.message,
                                  style: TextStyle(
                                    color: isCurrentUser
                                        ? Colors.white
                                        : Colors.black87,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
          ),

          // 🔹 MESSAGE INPUT BAR
          SafeArea(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 8,
                  ),
                ],
              ),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.camera_alt_outlined),
                    onPressed: () {},
                  ),
                  IconButton(
                    icon: const Icon(Icons.attach_file),
                    onPressed: () {},
                  ),

                  // Text field
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      decoration: InputDecoration(
                        hintText: 'Write a message',
                        hintStyle: TextStyle(color: Colors.grey.shade400),
                        filled: true,
                        fillColor: Colors.grey.shade100,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 10,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(20),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 6),

                  // Send button
                  IconButton(
                    icon: const Icon(
                      Icons.send,
                      color: Color(0xFF6C7CFF),
                    ),
                    onPressed: _sendMessage,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }
}
