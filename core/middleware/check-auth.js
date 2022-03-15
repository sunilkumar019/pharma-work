const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "secret");
        
        req.repId = decoded.repId;
        req.is_owner = decoded.is_owner;
        req.franchiseeId = decoded.franchiseeId;

        next();
    } catch (error) {
        if(error.name = "TokenExpiredError")
        return  res.status(401).json({
            message: 'Your Session has been Expired!'
        });
        else
        return res.status(401).json({
            message: 'Authentication Failed'
        });
    }
};