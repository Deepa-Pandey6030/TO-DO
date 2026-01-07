import jwt from "jsonwebtoken";

/**
 * Middleware to protect routes
 * Checks JWT token and attaches userId to request
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach userId to request
    req.userId = decoded.userId;

    // 5. Continue to next middleware / controller
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      message: "Not authorized, token invalid",
    });
  }
};

export default authMiddleware;
