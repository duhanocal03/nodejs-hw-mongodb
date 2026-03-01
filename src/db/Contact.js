const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    userId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, default: null },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model(
  'Contact',
  contactSchema,
  'contacts'
);