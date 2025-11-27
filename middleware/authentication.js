const jwt = require('jsonwebtoken');

//TOKEN AUTHENTICATION
exports.authentication = (req, res, next) => {
    //henter Authorization-headeren
    const authHeader = req.headers.authorization;

    //Authorization: Bearer <TOKEN>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "Unauthorized 1"});
    }
    //fjerner Bearer fra authheader så vi efterladt med token'en
    const token = authHeader.split(" ")[1];

    try {
        //tjekker om token matcher hvis secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //så hvis de matcher får vi adgang til dens brugers id
        //lidt magisk, research :)
        req.user = { id: decoded.userId, role: decoded.role, email: decoded.email };
        next();
    } catch (error) {
        //kan fåes hvis man prøver slette sig selv, måske?
        res.status(401).json({message: "Unauthorized 2"});
    }
}

exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({message: "Unauthorized 3"});
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({message: "Forbidden, incorrect role"})
        }
        next()
    }
}