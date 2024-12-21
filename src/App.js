import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');  // แสดงข้อความการทำงาน

  // Fetch contacts from the backend
  const fetchContacts = async () => {
    try {
      const response = await axios.get('https://my-express-app-five.vercel.app/contacts');
      setContacts(response.data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  // เรียกใช้ฟังก์ชันเมื่อ component ติดตั้ง
  useEffect(() => {
    fetchContacts();  // ดึงข้อมูล contacts เมื่อเพจโหลด
  }, []);

  // Add a new contact
  const addContact = async () => {
    if (!newContact.name || !newContact.email) {
      setMessage("Please enter both name and email.");  // แจ้งเตือนหากข้อมูลไม่ครบ
      return;
    }

    try {
      const response = await axios.post('https://my-express-app-five.vercel.app/contacts', newContact);
      setContacts([...contacts, response.data]);  // เพิ่ม contact ใหม่ลงในรายชื่อ
      setNewContact({ name: '', email: '' });  // รีเซ็ตฟอร์ม
      setMessage("Contact added successfully!");  // แสดงข้อความเมื่อเพิ่มข้อมูลสำเร็จ
    } catch (err) {
      console.error('Error adding contact:', err);
      setMessage("Error adding contact!");  // แสดงข้อความหากเกิดข้อผิดพลาด
    }
  };

  // Delete a contact by ID
  const deleteContact = async (id) => {
    try {
      await axios.delete(`https://my-express-app-five.vercel.app/contacts/${id}`);
      setContacts(contacts.filter(contact => contact._id !== id));  // ลบ contact ออกจากรายชื่อ
      setMessage("Contact deleted successfully!");  // แสดงข้อความเมื่อทำการลบสำเร็จ
    } catch (err) {
      console.error('Error deleting contact:', err);
      setMessage("Error deleting contact!");  // แสดงข้อความหากเกิดข้อผิดพลาด
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Contact List</h1>

      {/* ฟอร์มสำหรับเพิ่มข้อมูล */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Name"
          value={newContact.name}
          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          style={{ padding: '10px', margin: '5px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={newContact.email}
          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
          style={{ padding: '10px', margin: '5px' }}
        />
        <button
          onClick={addContact}
          style={{
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Add Contact
        </button>
      </div>

      {/* ข้อความจากการทำงาน */}
      {message && <p style={{ color: 'red', fontWeight: 'bold' }}>{message}</p>}

      {/* แสดงรายการ contacts */}
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {contacts.map(contact => (
          <li key={contact._id} style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '18px' }}>
              {contact.name} - {contact.email}
            </span>
            <button
              onClick={() => deleteContact(contact._id)}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                marginLeft: '10px',
                padding: '5px 10px'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
