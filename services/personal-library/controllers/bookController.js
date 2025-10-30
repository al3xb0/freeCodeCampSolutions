import Book from '../models/book.js';

export async function createBook(req, res) {
  try {
    const { title } = req.body;
    if (!title) return res.status(200).send('missing required field title');
    const book = new Book({ title });
    await book.save();
    res.status(200).json({ title: book.title, _id: book._id });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
}

export async function getBooks(req, res) {
  try {
    const books = await Book.find({}, 'title _id commentcount').exec();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
}

export async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).exec();
    if (!book) return res.status(200).send('no book exists');
    res.status(200).json({ title: book.title, _id: book._id, comments: book.comments });
  } catch (err) {
    res.status(200).send('no book exists');
  }
}

export async function addComment(req, res) {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    if (!comment) return res.status(200).send('missing required field comment');
    const book = await Book.findById(id).exec();
    if (!book) return res.status(200).send('no book exists');
    book.comments.push(comment);
    book.commentcount = book.comments.length;
    await book.save();
    res.status(200).json({ title: book.title, _id: book._id, comments: book.comments });
  } catch (err) {
    res.status(200).send('no book exists');
  }
}

export async function deleteBookById(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Book.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(200).send('no book exists');
    res.status(200).send('delete successful');
  } catch (err) {
    res.status(200).send('no book exists');
  }
}

export async function deleteAllBooks(req, res) {
  try {
    await Book.deleteMany({});
    res.status(200).send('complete delete successful');
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
}
