// Initialize MongoDB with reference data
// This script runs automatically when the MongoDB container starts for the first time

// Switch to the application database
db = db.getSiblingDB('myapp');

// Create users collection with initial data
db.createCollection('users');

db.users.insertMany([
  {
    _id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date('2026-01-15'),
    role: 'admin'
  },
  {
    _id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    createdAt: new Date('2026-02-10'),
    role: 'user'
  },
  {
    _id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    createdAt: new Date('2026-02-20'),
    role: 'user'
  }
]);

// Create index on email for faster lookups
db.users.createIndex({ email: 1 }, { unique: true });

console.log('MongoDB initialization complete: Users collection created with 3 sample documents');
