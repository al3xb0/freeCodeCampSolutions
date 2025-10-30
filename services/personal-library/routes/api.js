import express from 'express';
import {
  createBook,
  getBooks,
  getBookById,
  addComment,
  deleteBookById,
  deleteAllBooks
} from '../controllers/bookController.js';

const router = express.Router();

router.route('/books')
  .post(createBook)
  .get(getBooks)
  .delete(deleteAllBooks);

router.route('/books/:id')
  .get(getBookById)
  .post(addComment)
  .delete(deleteBookById);

export default router;
