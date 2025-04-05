import Book from "../models/Book.js";
import Favorite from "../models/Favorite.js";
import { v4 as uuidv4 } from "uuid";

export const getAllBooks = async (req, res) => {
  try {
    const userId = req.query.userId;
    const books = await Book.find();

    if (!userId) {
      return res.json(books);
    }
    const favoriteBooks = await Favorite.find({ userId });
    const favoriteBookIds = new Set(favoriteBooks.map((fav) => fav.bookId));
    console.log(favoriteBookIds);

    const booksWithFavorite = books.map((book) => ({
      ...book.toObject(),
      favorite: favoriteBookIds.has(book.bookId),
    }));

    res.json(booksWithFavorite);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

export const markAsFavorite = async (req, res) => {
  try {
    const { userId } = req.body;
    const { bookId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const existingFavorite = await Favorite.findOne({ userId, bookId });

    if (!existingFavorite) {
      await new Favorite({ userId, bookId }).save();
    }

    res.json({ message: "Book marked as favorite" });
  } catch (error) {
    res.status(500).json({ message: "Error marking favorite", error });
  }
};

export const unmarkAsFavorite = async (req, res) => {
  try {
    const { userId } = req.body;
    const { bookId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    await Favorite.findOneAndDelete({ userId, bookId });

    res.json({ message: "Book removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Error removing favorite", error });
  }
};

export const getFavoriteBooks = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Get all favorite book IDs for this user
    const favorites = await Favorite.find({ userId });
    const favoriteBookIds = favorites.map(fav => fav.bookId);

    if (favoriteBookIds.length === 0) {
      return res.json([]);
    }

    // Fetch the actual book details for these IDs
    const favoriteBooks = await Book.find({ bookId: { $in: favoriteBookIds } });

    // Add the favorite flag to each book
    const booksWithFavoriteFlag = favoriteBooks.map(book => ({
      ...book.toObject(),
      favorite: true
    }));

    res.json(booksWithFavoriteFlag);
  } catch (error) {
    console.error("Error fetching favorite books:", error);
    res.status(500).json({ message: "Error fetching favorite books", error: error.message });
  }
};

export const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      price,
      image,
      genre,
      description,
      publishedYear,
      isbn,
      rating,
      pages,
      language
    } = req.body;

    const bookId = uuidv4();
    const newBook = new Book({
      bookId,
      title,
      author,
      price,
      image,
      genre: genre || "Fiction",
      description: description || "No description available",
      publishedYear,
      isbn,
      rating: rating || 4,
      pages,
      language: language || "English",
      favorite: false,
    });

    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error });
  }
};

export const addMultipleBooks = async (req, res) => {
  try {
    const books = req.body;
    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: "Invalid book data" });
    }

    const booksWithIds = books.map((book) => ({
      bookId: uuidv4(),
      ...book,
      genre: book.genre || "Fiction",
      description: book.description || "No description available",
      rating: book.rating || 4,
      language: book.language || "English",
      favorite: false,
    }));

    const insertedBooks = await Book.insertMany(booksWithIds);
    res
      .status(201)
      .json({ message: "Books added successfully", books: insertedBooks });
  } catch (error) {
    res.status(500).json({ message: "Error adding books", error });
  }
};
