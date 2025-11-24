const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    const token = jwt.sign(
        {userId: user._id, role: user.role, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES}
    );
      return token;
};

exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error("Invalid or expired token")
    }
};