import mongoose from "mongoose";

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: "user" | "admin" | "deliveryBoy";
  image?: string;
  location: {
    type: {
      type: StringConstructor;
      enum: string[];
      default: string;
    };
    coordinates: {
      type: NumberConstructor[];
      default: number[];
    };
  };
  socketId: string | null;
  isOnline: Boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    mobile: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "deliveryBoy"],
      default: "user",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    socketId: {
      type: String,
      default: null
    }, 
    isOnline: {
      type: Boolean,
      default: false
    }
  },

  { timestamps: true },
);

userSchema.index({ location: "2dsphere" }); // for location that given by mongoose

const User = mongoose.models.User || mongoose.model("User", userSchema); // it save in database as Users

export default User;
