const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.query['x-access-token'] || req.headers['x-access-token']
        if(!token)  res.status(403).send({success: false, message: "No token Provided"});
        const decoded = jwt.verify(token, "secret");
        
        let adminData = {
            Id:decoded.Id,
            Name:decoded.Name,
            Phone:decoded.Phone,
            Email:decoded.Email,
            Company:decoded.Company,
            Profile_pic:decoded.Profile_pic
        }
        req.adminData = adminData;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed',
            Error: error
        });
    }
};