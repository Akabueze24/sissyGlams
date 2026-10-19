const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
       type: String,
        required: true, 
        trim: true,
        minLength: [2, 'character must be at least 2 characters'] 
      },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, 'character must be at least 2 characters']
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must be at least 8 characters'],
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true },
);

// Hash password before save (only if changed)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare plain password to hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
