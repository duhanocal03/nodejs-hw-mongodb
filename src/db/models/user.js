const { Schema, model } = require('mongoose');

const usersSchema = new Schema({
    name: { type: String, required: true },
    email: {
  type: String,
  required: true,
  unique: true,
  match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
},
    password: { type: String, required: true },
    
},
    { timestamps: true }
);

const Users = model('Users', usersSchema);

module.exports = Users;