const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{ type:String , required :true},
    lastName:{type:String,},
    email:{type:String,required:true,unique:true},
    password:{ type:String,required:true , minLength:6 },
    dateOfBirth:{type:Date,},

});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User' , userSchema);
