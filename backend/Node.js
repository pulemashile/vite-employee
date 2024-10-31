const express = require('express');
const path = require('path');
const { initializeApp } = require('firebase/app');
const {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} = require('firebase/firestore');
const cors = require('cors');

// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: "AIzaSyAeRtl8P9PH9vcR21n5lGrvU7uYh19koqs",
    authDomain: "employee-fd325.firebaseapp.com",
    projectId: "employee-fd325",
    storageBucket: "employee-fd325.appspot.com",
    messagingSenderId: "31628521167",
    appId: "1:31628521167:web:db3fc423346ef6c68221f3",
    measurementId: "G-H3JYK9LGJ9"
};
initializeApp(firebaseConfig);
const db = getFirestore();
const registrationsCollection = collection(db, 'registrations');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Add an employee
app.post('/registrations', async (req, res) => {
    try {
        const docRef = await addDoc(registrationsCollection, req.body);
        res.status(201).json({ id: docRef.id, ...req.body });
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).send("Error adding document");
    }
});

// Get all employees
app.get('/registrations', async (req, res) => {
    try {
        const snapshot = await getDocs(registrationsCollection);
        const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(employees);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send("Error fetching documents");
    }
});

// Get a single employee by ID
app.get('/registrations/:id', async (req, res) => {
    try {
        const docRef = doc(db, 'registrations', req.params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            res.json({ id: docSnap.id, ...docSnap.data() });
        } else {
            res.status(404).send("Employee not found");
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        res.status(500).send("Error fetching document");
    }
});

// Update an employee by ID
app.put('/registrations/:id', async (req, res) => {
    try {
        const docRef = doc(db, 'registrations', req.params.id);
        await updateDoc(docRef, req.body);
        res.send("Employee updated successfully");
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).send("Error updating document");
    }
});

// Delete an employee by ID
app.delete('/registrations/:id', async (req, res) => {
    try {
        const docRef = doc(db, 'registrations', req.params.id);
        await deleteDoc(docRef);
        res.send("Employee deleted successfully");
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).send("Error deleting document");
    }
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
