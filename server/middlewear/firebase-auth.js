import admin from "../config/firebase-admin.js";
import User from "../modules/users/user.model.js";

/**
 * Firebase Authentication Middleware
 * 
 * This middleware:
 * 1. Reads Authorization: Bearer <Firebase_ID_Token> header
 * 2. Verifies the Firebase ID token
 * 3. Extracts uid, email, and name from the token
 * 4. Checks if MongoDB user exists with the same firebaseUid
 * 5. Auto-creates the user if they don't exist
 * 6. Attaches the MongoDB user object to req.user
 */
export const authenticateFirebase = async (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided. Please include 'Authorization: Bearer <token>' header.",
      });
    }

    // Extract the token
    const idToken = authHeader.split("Bearer ")[1];

    if (!idToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header format.",
      });
    }

    // Verify the Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error("Firebase token verification error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Firebase token.",
        error: error.message,
      });
    }

    // Extract user information from the token
    const { uid, email, name, picture } = decodedToken;

    // Check if MongoDB user exists with this firebaseUid
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Auto-create the user if they don't exist
      // Extract first_name and last_name from name if available
      let first_name = "";
      let last_name = "";
      
      if (name) {
        const nameParts = name.trim().split(" ");
        first_name = nameParts[0] || "";
        last_name = nameParts.slice(1).join(" ") || "";
      }

      // Create new user in MongoDB
      user = await User.create({
        firebaseUid: uid,
        email: email || "",
        first_name: first_name,
        last_name: last_name,
        profile_image: picture || "default.png",
        role: "user", // Default role
        status: "active", // Auto-activated since Firebase handles auth
        last_login: new Date(),
      });

      console.log(`✅ Auto-created MongoDB user for Firebase UID: ${uid}`);
    } else {
      // Update last_login for existing users
      user.last_login = new Date();
      await user.save();
    }

    // Attach the MongoDB user object to req.user
    req.user = user;
    req.firebaseUid = uid;
    req.firebaseEmail = email;

    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
      error: error.message,
    });
  }
};

/**
 * Optional: Role-based authorization middleware
 * Use after authenticateFirebase to check user roles
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      });
    }

    next();
  };
};
