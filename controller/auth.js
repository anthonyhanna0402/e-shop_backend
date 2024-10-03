const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../model');
const User = db.user;
const Role = db.role;
const secret = require('../config/constants').secret;

exports.signup = async (req, res) => {
 
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  try {

    if(req.body.roles) {
      const roles = await Role.find({name:{$in:req.body.roles}});
      user.roles = roles.map(role=>role._id);
      const savedUser = await user.save();
      res.status(201).json(savedUser);
    } else {
      const defaultRoles = await Role.findOne({name:'user'});
      user.roles = [defaultRoles._id];
      const savedUser = await user.save();
      res.status(201).json(savedUser);
    }    
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};

exports.signin = async (req, res) => {

  try {

    const user = await User
    .findOne({name: req.body.name})
    .populate('roles');

    if (!user) {
      return res.status(404).json({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user._id },
                            secret,
                            {
                              algorithm: 'HS256',
                              allowInsecureKeySizes: true,
                              expiresIn: 86400, // 24 hours
                            });

    var authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }

    req.session.token = token;

    console.log('session', req.session.token);

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      roles: authorities,
    });
    
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).json({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
