import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Book from '../models/Book.js';
import { bookData } from '../data/bookData.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedBooks = async () => {
  try {
    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books');

    // Add bookId to each book
    const booksWithIds = bookData.map(book => ({
      ...book,
      bookId: uuidv4()
    }));

    // Insert new books
    await Book.insertMany(booksWithIds);
    console.log(`Successfully seeded ${booksWithIds.length} books`);
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding books:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeding function
seedBooks();
