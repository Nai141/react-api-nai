const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const response = await axios.get(`${process.env.PORT}/contacts`);

const app = express();
app.use(express.json());
app.use(cors());  // กำหนดให้ใช้งาน CORS สำหรับการเข้าถึงจากแหล่งต่างๆ

const PORT = process.env.PORT || 5000;  // ใช้ PORT จาก .env ถ้ามี, ไม่งั้นใช้ 5000

// เชื่อมต่อกับ MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))  // ถ้าเชื่อมต่อสำเร็จ
  .catch(err => console.log('MongoDB connection error:', err));  // ถ้าเชื่อมต่อผิดพลาด

// สร้าง Schema สำหรับ Contact
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

// สร้าง Model จาก Schema
const Contact = mongoose.model('Contact', contactSchema);

// Endpoint: Get all contacts
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching contacts: ' + err });
  }
});

// Endpoint: Add a new contact
app.post('/contacts', async (req, res) => {
  const newContact = new Contact(req.body);
  try {
    await newContact.save();
    res.json(newContact);  // ส่งข้อมูลที่เพิ่มไปกลับ
  } catch (err) {
    res.status(400).json({ error: 'Error adding contact: ' + err });
  }
});

// Endpoint: Delete a contact by ID
app.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting contact: ' + err });
  }
});

// เปิดเซิร์ฟเวอร์ที่ PORT ที่กำหนด
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
