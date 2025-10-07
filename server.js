const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files like index.html
app.use(express.static(__dirname));

// MongoDB Atlas connection
const mongoURI = 'mongodb+srv://bhargavkolluru2005_db_user:Swathi1@cluster0.vzysljb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema and model
const studentSchema = new mongoose.Schema({
  name: String,
  rollno: String,
  gender: String,
  skills: [String]
});

const Student = mongoose.model('Student', studentSchema);

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  try {
    const { name, rollno, gender, skills } = req.body;
    const student = new Student({
      name,
      rollno,
      gender,
      skills: skills.split(',').map(s => s.trim())
    });
    await student.save();
    res.json({ message: 'Student data saved successfully!' });
  } catch (err) {
    console.error('Error during saving student data:', err);
    res.status(500).json({ message: 'Error saving data', error: err });
  }
});

// View all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
});

// Start server
app.listen(3000, () => console.log('Server running at http://localhost:3000'));
