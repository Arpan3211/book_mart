import express from "express";
import {
  getAllBooks,
  addBook,
  addMultipleBooks,
  markAsFavorite,
  unmarkAsFavorite,
  getFavoriteBooks,
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getAllBooks);
router.post("/add", addBook);
router.post("/add-multiple", addMultipleBooks);
router.get("/favorites", getFavoriteBooks);
router.patch("/:bookId/favorite", markAsFavorite);
router.patch("/:bookId/unfavorite", unmarkAsFavorite);

export default router;
