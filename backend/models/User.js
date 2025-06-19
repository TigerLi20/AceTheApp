import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String }, // Add this line
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  collegeDocs: { type: Map, of: String },
});

export default mongoose.model("User", userSchema);