const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const DB_URI_COMPOSER = "mongodb://127.0.0.1:27017/book_shelf";
const DB_URL_REMOTE = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pu4qt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(DB_URI_COMPOSER, options)
  .then(() => {
    console.log("Connected to Database...");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("hello from redux-book-shelf backend");
});

app.post("/addToReadingList", (req, res) => {
  const db = mongoose.connection.db;
  const { id, title, author, coverImageUrl, pageCount, publisher, synopsis } =
    req.body;
  const book = {
    id,
    title,
    author,
    coverImageUrl,
    pageCount,
    publisher,
    synopsis,
  };
  db.collection("readingList")
    .insertOne(book)
    .then(() => {
      res.send("Book added to reading list");
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/books", (req, res) => {
  const db = mongoose.connection.db;
  db.collection("readingList")
    .find()
    .toArray()
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.delete("/deleteBook/:id", (req, res) => {
  const db = mongoose.connection.db;
  const { id } = req.params;
  db.collection("readingList")
    .deleteOne({ _id: id })
    .then(() => {
      res.send("Book is deleted");
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Server is running on port 5000")
);
