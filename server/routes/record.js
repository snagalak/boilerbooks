import express from "express";
import { BookList } from "../models/Record.js";
import { Genre } from "../models/Record.js";
import { User } from "../models/Record.js";
import { Author } from "../models/Record.js";
import db from "../database/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const results = await BookList.find();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving books");
  }
});

router.get("/genres", async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).send(genres);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving genres");
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving genres");
  }
});

router.get("/authors", async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).send(authors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving genres");
  }
});

router.get("/check", async (req, res) => {
  try {
    const authorId = req.query.author_id;
    const genreName = req.query.genre_name;

    const collection = db.collection("booklists");

    const filter = {};
    if (authorId) {
      filter.author_name = authorId;
    }
    if (genreName) {
      filter.genre_name = genreName;
    }

    const results = await collection.find(filter).toArray();

    if (results.length === 0) {
      return res.status(404).send("No books found for the given criteria");
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Error retrieving books:", err);
    res.status(500).send("Error retrieving books");
  }
});

router.get("/avgprice", async (req, res) => {
  try {
    const authorId = req.query.author_id;
    if (!authorId) {
      return res.status(400).send("Author ID is required");
    }

    const collection = db.collection("booklists");
    const results = await collection
      .aggregate([
        { $match: { author_name: authorId } },
        {
          $group: {
            _id: "$author_name",
            avgPrice: { $avg: "$price" },
          },
        },
      ])
      .toArray();

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found for the given author." });
    }
    res.status(200).json({
      author_id: authorId,
      avgPrice: results[0].avgPrice,
    });
  } catch (err) {
    console.error("Error retrieving average price:", err);
    res.status(500).send("Error retrieving average price");
  }
});

router.get("/rating", async (req, res) => {
  try {
    const authorId = req.query.author_id;
    if (!authorId) {
      return res.status(400).json({ error: "Author ID is required" });
    }

    const collection = db.collection("booklists");
    const results = await collection
      .aggregate([
        { $match: { author_name: authorId } },
        {
          $group: {
            _id: "$author_name",
            avgRating: { $avg: "$rating" },
          },
        },
      ])
      .toArray();

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found for the given author." });
    }

    res.status(200).json({
      author_id: authorId,
      avgRating: results[0].avgRating,
    });
  } catch (err) {
    console.error("Error retrieving average rating:", err);
    res.status(500).json({ error: "Error retrieving average rating" });
  }
});

router.get("/commongenre", async (req, res) => {
  try {
    const authorId = req.query.author_id;
    if (!authorId) {
      return res.status(400).send("Author ID is required");
    }

    const collection = db.collection("booklists");
    const results = await collection
      .aggregate([
        { $match: { author_name: authorId } },
        { $unwind: "$genre_name" },
        {
          $group: {
            _id: "$genre_name",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found for the given author." });
    }
    const maxCount = results[0].count;
    const mostCommonGenres = results.filter(
      (genre) => genre.count === maxCount
    );

    res.status(200).json({
      author_id: authorId,
      mostCommonGenres: mostCommonGenres.map((genre) => genre._id),
    });
  } catch (err) {
    console.error("Error retrieving common genre:", err);
    res.status(500).send("Error retrieving common genre");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await BookList.findById(req.params.id);

    if (!result) {
      return res.status(404).send("Book not found");
    }

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving book");
  }
});

// This section will help you create a new book.
router.post("/", async (req, res) => {
  try {
    const newBook = new BookList({
      book_ISBN: req.body.book_ISBN,
      user_name: req.body.user_name,
      title: req.body.title,
      price: req.body.price,
      genre_name: req.body.genre_name,
      condition: req.body.condition,
      author_name: req.body.author_name,
      rating: req.body.rating,
    });

    const result = await newBook.save();
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding book");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updates = {
      book_ISBN: req.body.book_ISBN,
      user_name: req.body.user_name,
      title: req.body.title,
      price: req.body.price,
      genre_name: req.body.genre_name,
      condition: req.body.condition,
      author_name: req.body.author_name,
      publisher_name: req.body.publisher_name,
      rating: req.body.rating,
    };

    const result = await BookList.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return res.status(404).send("Book not found");
    }

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating book");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await BookList.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).send("Book not found");
    }

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting book");
  }
});

export default router;
