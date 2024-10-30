const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your-service-account-file.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "employee-fd325.appspot.com"
});

const db = admin.firestore();
const app = express();
app.use(express.json());

// Create a new employee
app.post('/registrations', async (req, res) => {
  const newEmployee = req.body;
  try {
    const docRef = await db.collection('employees').add(newEmployee);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).send('Error adding employee:', error);
  }
});

// Get all employees
app.get('/registrations', async (req, res) => {
  try {
    const snapshot = await db.collection('employees').get();
    const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(employees);
  } catch (error) {
    res.status(500).send('Error fetching employees:', error);
  }
});

// Update an employee
app.put('/registrations/:id', async (req, res) => {
  const employeeId = req.params.id;
  try {
    await db.collection('employees').doc(employeeId).update(req.body);
    res.send('Employee updated successfully');
  } catch (error) {
    res.status(500).send('Error updating employee:', error);
  }
});

// Delete an employee
app.delete('/registrations/:id', async (req, res) => {
  const employeeId = req.params.id;
  try {
    await db.collection('employees').doc(employeeId).delete();
    res.send('Employee deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting employee:', error);
  }
});

app.listen(8080, () => console.log('Server running on http://localhost:8080'));
