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
  },

  activateEmail: async (req, res) => {
    try {
        const {activation_token} = req.body
        // @ts-ignore
        const user = jwt.verify(activation_token, process.env.ACTIVATED_TOKEN_SECRET)

        const {
          lastName,
          firstName,
          userName,
          email,
          password,
          confirmPassword
        } = user

        const check = await User.findOne({email})
        if(check) {
          return res.status(400).json({msg:"This email already exists."})
        }else {
          const newUser = new User({
            lastName,
            firstName,
            userName,
            email,
            password,
            confirmPassword
          })
          await newUser.save()
          res.json({msg: "Account has been activated!"})
        }
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  },
  
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // check emaik
      const user = await User.findOne({email});
      if(!user) return res.status(400).json({msg: 'This email does not exist.'});

      // check password
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) return res.status(400).json({msg: 'Password is incorrect.'});
      const refresh_token = createRefreshToken({id: user._id});
      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7*24*60*60*1000 // 7 days
      })
      res.json({msg: 'Login success!'});
      
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },

  getAccessToken : (req, res) => {
    try {
      const refresh_token = req.cookies.refreshtoken;
      if(!refresh_token) return res.status(400).json({msg: 'Please login now!'});
      // @ts-ignore
      jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(400).json({msg: 'Please login now!'});
        // @ts-ignore
        const access_token = createAccessToken({id: user.id});
        res.json({access_token});
      })
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },

  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({email});
      if(!user) return res.status(400).json({msg: 'This email does not exist.'});

      const access_token = createAccessToken({id: user._id});
      const url = `${CLIENT_URL}/user/reset/${access_token}`;

      sendMail(email, url, 'Reset your password');
      res.json({msg: 'Re-send the password, please check your email.'});
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;

      const passwordHashed = await bcrypt.hash(password, 12); 

      await User.findOneAndUpdate({_id: req.user.id}, {
        password: passwordHashed,
        confirmPassword: passwordHashed
      });
      res.json({msg: 'Password successfully changed!'});
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },

  getUserInformation: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password').select('-confirmPassword');

      res.json(user);
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },

  getUserAllInformation: async (req, res) => {
    try {
      const users = await User.find().select('-password').select('-confirmPassword');
      
      res.json(users);
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', {path: '/user/refresh_token'});
      return res.json({msg: 'Logged out'}); 
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },
  
  updateUsers: async (req, res) => {
    try {
      const { lastName, firstName, userName, avatar }  = req.body;
      await User.findOneAndUpdate({_id: req.user.id}, {
        lastName,
        firstName,
        userName,
        avatar,
      });

      res.json({msg: 'Updated sucessfully!'});
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },

  updateUserRole: async (req, res) => {
    try { 
      const { role }  = req.body;
      await User.findOneAndUpdate({_id: req.params.id}, { role });

      res.json({msg: 'Updated role successfully!'});
    }catch (error){
      return res.status(500).json({msg: error.message})
    }
  },

  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({msg: 'Deleted a user successfully!'});
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  }
}

module.exports = userControllers;