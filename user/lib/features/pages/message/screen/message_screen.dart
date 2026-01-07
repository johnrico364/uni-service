import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/services/message_service.dart';
import '../../../../core/services/user_service.dart';
import 'message_card.dart';

class MessageScreen extends StatefulWidget {
  const MessageScreen({super.key});

  @override
  State<MessageScreen> createState() => _MessageScreenState();
}

class _MessageScreenState extends State<MessageScreen> {
  final TextEditingController _searchController = TextEditingController();
  final MessageService _messageService = MessageService();
  final UserService _userService = UserService();
  
  int _selectedFilter = 0; // 0 = Services, 1 = Product
  bool _isSearchingUsers = false;
  List<MessageConversation> _allConversations = [];
  List<UserModel> _allUsers = [];
  List<MessageConversation> _filteredConversations = [];
  List<UserModel> _filteredUsers = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Load conversations and users
      final conversations = await _messageService.fetchConversations();
      final users = await _userService.fetchAllUsers();

      setState(() {
        _allConversations = conversations;
        _allUsers = users;
        _filteredConversations = conversations;
        _filteredUsers = users;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _searchFunction(String query) {
    setState(() {
      if (query.isEmpty) {
        // If search is empty, show conversations
        _isSearchingUsers = false;
        _filteredConversations = _allConversations;
        _filteredUsers = [];
      } else {
        // Search through login accounts (users)
        _isSearchingUsers = true;
        final lowerQuery = query.toLowerCase();
        
        _filteredUsers = _allUsers.where((user) {
          return user.fullName.toLowerCase().contains(lowerQuery) ||
              user.email.toLowerCase().contains(lowerQuery) ||
              (user.phone != null && user.phone!.toLowerCase().contains(lowerQuery));
        }).toList();

        // Also filter conversations by user name or message
        _filteredConversations = _allConversations.where((conv) {
          final matchesName = conv.userName.toLowerCase().contains(lowerQuery);
          final matchesMessage = conv.lastMessage.toLowerCase().contains(lowerQuery);
          return matchesName || matchesMessage;
        }).toList();
      }
    });
  }

  String _getFilterType() {
    return _selectedFilter == 0 ? 'service' : 'product';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,

      // 🔹 Centered title like the image
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Message',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      body: Column(
        children: [
          // 🔍 Search bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Container(
              height: 40,
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(20),
              ),
              child: TextField(
                controller: _searchController,
                onChanged: _searchFunction,
                decoration: const InputDecoration(
                  hintText: 'Search',
                  prefixIcon: Icon(Icons.search, size: 20),
                  border: InputBorder.none,
                ),
              ),
            ),
          ),

          // 🔘 Service / Product filter buttons
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                _buildFilterChip('Services', 0),
                const SizedBox(width: 8),
                _buildFilterChip('Product', 1),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // 💬 Message list or User search results
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _isSearchingUsers && _searchController.text.isNotEmpty
                    ? _buildUserSearchResults()
                    : _buildConversationsList(),
          ),
        ],
      ),
    );
  }

  // 🔹 Custom chip widget
  Widget _buildFilterChip(String label, int index) {
    final bool isSelected = _selectedFilter == index;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedFilter = index;
          _applyFilter();
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? Colors.blue : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.blue),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.blue,
            fontSize: 12,
          ),
        ),
      ),
    );
  }

  void _applyFilter() {
    final filterType = _getFilterType();
    setState(() {
      if (_searchController.text.isEmpty) {
        _filteredConversations = _allConversations
            .where((conv) => conv.type == filterType || conv.type == null)
            .toList();
      } else {
        _searchFunction(_searchController.text);
      }
    });
  }

  Widget _buildConversationsList() {
    final filterType = _getFilterType();
    final filtered = _filteredConversations
        .where((conv) => conv.type == filterType || conv.type == null)
        .toList();

    if (filtered.isEmpty) {
      return const Center(child: Text('No messages found'));
    }

    return ListView.builder(
      itemCount: filtered.length,
      itemBuilder: (context, index) {
        final conv = filtered[index];

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          child: Row(
            children: [
              // Avatar
              CircleAvatar(
                radius: 22,
                backgroundColor: Colors.grey.shade300,
                backgroundImage: conv.userAvatar != null && conv.userAvatar!.isNotEmpty
                    ? NetworkImage(conv.userAvatar!)
                    : null,
                child: conv.userAvatar == null || conv.userAvatar!.isEmpty
                    ? const Icon(Icons.person, color: Colors.white)
                    : null,
              ),

              const SizedBox(width: 12),

              // Name & message (tappable)
              Expanded(
                child: InkWell(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => ChatScreen(userId: conv.userId),
                      ),
                    );
                  },
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        conv.userName,
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        conv.lastMessage,
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 13,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ),

              // Unread dot
              if (conv.hasUnread)
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Colors.blue,
                    shape: BoxShape.circle,
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildUserSearchResults() {
    if (_filteredUsers.isEmpty) {
      return const Center(child: Text('No users found'));
    }

    return ListView.builder(
      itemCount: _filteredUsers.length,
      itemBuilder: (context, index) {
        final user = _filteredUsers[index];

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          child: InkWell(
            onTap: () {
              // Navigate to chat with this user
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => ChatScreen(userId: user.id),
                ),
              );
            },
            child: Row(
              children: [
                // Avatar
                CircleAvatar(
                  radius: 22,
                  backgroundColor: Colors.grey.shade300,
                  backgroundImage: user.profileImage != null && user.profileImage!.isNotEmpty
                      ? NetworkImage(user.profileImage!)
                      : null,
                  child: user.profileImage == null || user.profileImage!.isEmpty
                      ? const Icon(Icons.person, color: Colors.white)
                      : null,
                ),

                const SizedBox(width: 12),

                // Name & email
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user.fullName,
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      if (user.email.isNotEmpty) ...[
                        const SizedBox(height: 2),
                        Text(
                          user.email,
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),

                // Arrow icon
                Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey.shade400),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
