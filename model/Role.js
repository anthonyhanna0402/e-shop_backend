const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  name:{
    type:String
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  },
  status: {
    type:Boolean,
    default:true
  }
});

module.exports = Role = mongoose.model('roles', RoleSchema);