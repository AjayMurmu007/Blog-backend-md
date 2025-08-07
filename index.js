const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// console.log(process.env.MONGODB_URL);

// parse options
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({
    limit: '10mb'
}))
app.use(bodyParser.urlencoded({
    limit: '10mb', extended: true
}))
app.use(cors({
<<<<<<< HEAD
    origin: 'http://localhost:5173', // frontend URL
     
=======
    // origin: 'http://localhost:5173', // frontend URL
    origin: 'https://blog-frontend-md.vercel.app', // frontend URL
>>>>>>> 0a8cd41 (update frontend url)
    credentials: true, // allow credentials
}))
//

// all routes
const authRoutes = require('./src/routes/auth.user.route');
const blogRoutes = require('./src/routes/blog.route');
const commentRoutes = require('./src/routes/comment.route');

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);

    app.get('/', (req, res) => {
        res.send('Blogs Server is Running ..!')

    })

}

main().then(() => console.log("MongoDB Connected Successfully..!")).catch(err => console.log(err));



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
