const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');



const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

// Connect to MongoDB using async/await
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useCreateIndex: true
    });

    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
}

connectToMongoDB();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
