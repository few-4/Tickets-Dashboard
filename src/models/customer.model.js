import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
        default: null },
  },
  { 
    timestamps: true,
  },
);

const customerModel = mongoose.model("Customer", CustomerSchema)

export default customerModel;