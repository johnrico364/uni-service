import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:convert';

/// API Service with Firebase Authentication
/// 
/// This service automatically includes Firebase ID tokens in API requests
/// and handles authentication errors.
class ApiService {
  // Update this with your backend URL
  static const String baseUrl = 'http://localhost:5000/api';
  // For production, use: static const String baseUrl = 'https://your-api-domain.com/api';

  /// Get Firebase ID Token for the current user
  static Future<String?> getIdToken() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) return null;
      
      // Force token refresh to ensure it's valid
      final token = await user.getIdToken(true);
      return token;
    } catch (e) {
      print('Error getting ID token: $e');
      return null;
    }
  }

  /// Get headers with Firebase authentication token
  static Future<Map<String, String>> getHeaders({bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      final token = await getIdToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  /// GET request
  static Future<http.Response> get(
    String endpoint, {
    Map<String, String>? queryParams,
    bool requireAuth = true,
  }) async {
    try {
      var uri = Uri.parse('$baseUrl$endpoint');
      if (queryParams != null && queryParams.isNotEmpty) {
        uri = uri.replace(queryParameters: queryParams);
      }

      final headers = await getHeaders(includeAuth: requireAuth);
      final response = await http.get(uri, headers: headers).timeout(
        const Duration(seconds: 30),
      );

      return response;
    } catch (e) {
      throw Exception('GET request failed: $e');
    }
  }

  /// POST request
  static Future<http.Response> post(
    String endpoint, {
    Map<String, dynamic>? body,
    bool requireAuth = true,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final headers = await getHeaders(includeAuth: requireAuth);
      
      final response = await http.post(
        uri,
        headers: headers,
        body: body != null ? jsonEncode(body) : null,
      ).timeout(const Duration(seconds: 30));

      return response;
    } catch (e) {
      throw Exception('POST request failed: $e');
    }
  }

  /// PATCH request
  static Future<http.Response> patch(
    String endpoint, {
    Map<String, dynamic>? body,
    bool requireAuth = true,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final headers = await getHeaders(includeAuth: requireAuth);
      
      final response = await http.patch(
        uri,
        headers: headers,
        body: body != null ? jsonEncode(body) : null,
      ).timeout(const Duration(seconds: 30));

      return response;
    } catch (e) {
      throw Exception('PATCH request failed: $e');
    }
  }

  /// PUT request
  static Future<http.Response> put(
    String endpoint, {
    Map<String, dynamic>? body,
    bool requireAuth = true,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final headers = await getHeaders(includeAuth: requireAuth);
      
      final response = await http.put(
        uri,
        headers: headers,
        body: body != null ? jsonEncode(body) : null,
      ).timeout(const Duration(seconds: 30));

      return response;
    } catch (e) {
      throw Exception('PUT request failed: $e');
    }
  }

  /// DELETE request
  static Future<http.Response> delete(
    String endpoint, {
    bool requireAuth = true,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final headers = await getHeaders(includeAuth: requireAuth);
      
      final response = await http.delete(
        uri,
        headers: headers,
      ).timeout(const Duration(seconds: 30));

      return response;
    } catch (e) {
      throw Exception('DELETE request failed: $e');
    }
  }

  /// Handle API response and parse JSON
  static Map<String, dynamic> handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      try {
        final jsonData = jsonDecode(response.body);
        return jsonData as Map<String, dynamic>;
      } catch (e) {
        throw Exception('Failed to parse response: $e');
      }
    } else if (response.statusCode == 401) {
      throw Exception('Authentication failed. Please log in again.');
    } else if (response.statusCode == 403) {
      throw Exception('Access denied. You don\'t have permission.');
    } else {
      try {
        final errorData = jsonDecode(response.body);
        final message = errorData['message'] ?? 'Request failed';
        throw Exception(message);
      } catch (e) {
        throw Exception('Request failed with status ${response.statusCode}');
      }
    }
  }
}
