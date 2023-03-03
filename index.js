require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const userRoute = require('./routes/userRouter');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles: true
}))

// Routes
app.use('/user', userRoute);

app.use('/', (req, res) => {
    res.json({msg: 'Welcome to server 2023'})
})

// Connecting to database
const URI = process.env.URI;
// @ts-ignore
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB successfully!!');
}).catch((err) => {
    console.log(err);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
