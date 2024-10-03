const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductionSchema = new Schema({

  name:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  quantity:{
    type:Number,
    required:true
  },
  instock:{
    type:Boolean,
    default:true
  },
  created_at:{
    type:Date,
    default:Date.now
  },
  status:{
    type:Boolean,
    default:true
  }
})

module.exports = Production = mongoose.model('productions', ProductionSchema);