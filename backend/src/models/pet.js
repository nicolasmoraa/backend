// models/Pet.js
import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  age: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Pet = mongoose.model("Pet", petSchema);
export default Pet;
