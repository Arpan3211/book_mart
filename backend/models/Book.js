import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  bookId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  genre: { type: String, default: "Fiction" },
  description: { type: String, default: "No description available" },
  publishedYear: { type: Number },
  isbn: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 4 },
  pages: { type: Number },
  language: { type: String, default: "English" },
  favorite: { type: Boolean, default: false },
});

export default mongoose.model("Book", BookSchema);
