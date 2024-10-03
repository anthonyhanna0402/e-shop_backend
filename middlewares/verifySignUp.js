const db = require('../model');
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = async(req, res, next) => {
  try {

    const user = await User.findOne({$or:[{name:req.body.name}, {email:req.body.email}]});

    if(user) {
      res.status(400).json({message:"failed! Username is already in use"});
      return;
    }
  } catch (error) {
    res.status(500).json({message:error.message});
  }
  next();
  };

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for(let i=0; i<req.body.roles.length; i++) {
      if(!ROLES.includes(req.body.roles[i])) {
        res.status(400).json({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
}

module.exports = verifySignUp;