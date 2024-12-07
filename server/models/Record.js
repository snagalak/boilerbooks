import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
  book_ISBN: { type: Number },
  user_name: { type: String}, 
  title: { type: String},
  price: { type: Number },
  genre_name: { type: String, index: true }, 
  condition: { type: String },
  date_listed: { 
    type: String, 
    default: () => {
      const today = new Date();
      return today.toISOString().split("T")[0]; 
    }
  },
  author_name: { type: String, index: true}, 
  rating: { type: Number }
});

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
});

const userSchema = new mongoose.Schema({
  name: { type: String},
  email: { type: String },
  phone: { type: Number }, 
});

const authorSchema = new mongoose.Schema({
  name: { type: String},
  email: { type: String },
  phone: { type: Number }, 
});

export const Genre = mongoose.model("Genre", genreSchema);
export const User = mongoose.model("User", userSchema);
export const Author = mongoose.model("Author", authorSchema);
export const BookList = mongoose.model("BookList", ListSchema);
