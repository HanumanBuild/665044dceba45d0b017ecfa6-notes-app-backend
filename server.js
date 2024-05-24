const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Add the following lines to import the routes
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME;

mongoose.connect(`${MONGODB_URI}/${MONGODB_DBNAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Add the following lines to use the routes
app.use('/api/auth', authRoutes);
app.use('/api', notesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});