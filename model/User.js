const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type:String
  },
  password: {
    type:String
  },
  roles: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"roles"
  }],
  createdAt: { 
    type: Date, 
    default: Date.now
  },
  status: {
    type:Boolean,
    default:true
  }
});

module.exports = User = mongoose.model('users', UserSchema);