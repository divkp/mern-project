import mongoose from "mongoose";

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
   required: false,
  },
  categories: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdate: {
    type: Date,
   },
});

const post=mongoose.model('post',schema);

export default post;