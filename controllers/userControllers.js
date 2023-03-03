const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CLIENT_URL }= process.env;
const sendMail = require('./sendMail');

function emailValidate(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function createAccessToken(payload){
  // @ts-ignore
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '5m'})
}
function createActivatedToken(payload){
  // @ts-ignore
  return jwt.sign(payload, process.env.ACTIVATED_TOKEN_SECRET, {expiresIn: '5m'})
}

function createRefreshToken(payload){
  // @ts-ignore
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}  


const userControllers = {
  register: async (req, res) => {
    try {
      const {
        lastName, 
        firstName,
        userName, 
        email,
        password,
        confirmPassword
      } = req.body;
      if (!lastName || !firstName || !userName || !email || !password || !confirmPassword){
        return res.status(400).json({msg: 'Please fill in all fields'})
      }
      if(!emailValidate(email)){
        return res.status(400).json({msg: 'Invalid email'});
      }
      User.findOne({email})
      .then(user => { 
        if(user) return res.status(400).json({msg: 'The email already exists'});
      })
      if(password.length < 6){
        return res.status(400).json({msg: 'Password must be at least 6 characters'});
      }
      if(password !== confirmPassword){
        return res.status(400).json({msg: 'Password and confirm password do not match'});
      }
      const passwordHashed = await bcrypt.hash(password, 12); 
      const newUser = {
        lastName,
        firstName,
        userName,
        email,
        password: passwordHashed,
        confirmPassword: passwordHashed
      };
      const activateToken = createActivatedToken(newUser);

      const url = `${CLIENT_URL}/user/activate/${activateToken}`;

      sendMail(email, url, 'Verify your email address');
      
      res.json({msg: 'Register Success! Please activate your email to start.'});
    } catch (err){
      return res.status(500).json({msg: err.message})
    }
  }

}

module.exports = userControllers;