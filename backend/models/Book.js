import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  bookId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  favorite: { type: Boolean, default: false },
});

export default mongoose.model("Book", BookSchema);
