const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateJwtToken(user) {
    return jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(req, res, next){
    const autorizationHeader = req.header('authorization');;
    if (!!autorizationHeader){
        // split at the place
        const bearerArray = autorizationHeader.split(' ');
        // get token from array
        let token = bearerArray[1];
        // set the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if(!!decoded)
                req.token = decoded;
            next();
          } catch(err) {
            res.sendStatus(403);
          }
    }else {
        res.sendStatus(403);
    }
}


module.exports = {
    generateJwtToken,
    verifyToken
}