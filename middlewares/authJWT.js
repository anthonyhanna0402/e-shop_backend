const jwt = require('jsonwebtoken');
const db = require('../model');

const User = db.user;
const Role = db.role;

const secret = require('../config/constants').secret;

verifyToken = (req, res, next) => {
  
  let token = req.session.token;

  if(!token) {
    return res.status(403).json({message:"no token provided!"});
  }

  jwt.verify(token, 
      secret, (err, decoded)=> {
        if(err) {
          return res.status(401).send({
            message:"unauthorized!",
          });
        }
        req.userId = decoded.id;
        
        next();
      }
  );
};

const isAdmin = async (req, res, next) => {
  try {
    console.log('req.userId', req.userId);
    const user = await User.findById(req.userId);

    console.log('user', user);
    if(!user) {
      res.status(404).json({message:"user not found"});
      return;
    }

    const userRoles = await Role.find({_id:user.roles});
    
    if(!userRoles) {
      res.status(500).json({message:"no authorize"});
      return;
    }

    for(let i=0;i<userRoles.length;i++) {
      if(userRoles[i].name==="admin") {
        next();
      }
    }

    res.status(403).json({message:"require admin role!"});

  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}

const isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if(!user) {
      res.status(404).json({message:"user not found"});
      return;
    }
    const userRoles = await Role.find({_id:user.roles});

    if(!userRoles) {
      res.status(500).json({message:"no authorize"});
      return;
    }

    for(let i=0;i<userRoles.length;i++) {
      if(userRoles[i].name==="moderator") {
        next();
      }
    }

    res.status(403).json({message:"require moderator role!"});

  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}

const authJWT = {
  verifyToken,
  isAdmin,
  isModerator,
}

module.exports = authJWT;