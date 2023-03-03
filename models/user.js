const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
      type: String,
      required: [true, 'Please enter your first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please enter your last name'],
      trim: true
    },
    userName: {
      type: String,
      required: [true, 'Please enter your user name'],
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      trim: true,
      unique: true  
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please enter your password'],
    },
    role: {
      type: String,
      default: 0 // 0 = user, 1 = admin
    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dweitfbey/image/upload/v1677823912/avatar/profile-pic_f0kjzj.jpg"
    }
})

module.exports  = mongoose.model('User', userSchema);