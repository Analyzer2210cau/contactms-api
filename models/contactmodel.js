import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  postedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"

  }
});

const ConactModel = mongoose.model("contact", contactSchema);

export default ConactModel;
