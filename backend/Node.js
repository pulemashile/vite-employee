const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } = require('firebase/firestore');
const cors = require('cors');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAeRtl8P9PH9vcR21n5lGrvU7uYh19koqs",
    authDomain: "employee-fd325.firebaseapp.com",
    projectId: "employee-fd325",
    storageBucket: "employee-fd325.appspot.com",
    messagingSenderId: "31628521167",
    appId: "1:31628521167:web:db3fc423346ef6c68221f3",
    measurementId: "G-H3JYK9LGJ9"
};

// Initialize Firebase and Firestore
initializeApp(firebaseConfig);
const db = getFirestore();
const registrationsCollection = collection(db, 'registrations');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// Create a new employee
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

