//this libaray is used to decrypt password.
const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

//define Schema.
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

//this function will be executed before saving a user instance to the database.
userSchema.pre("save", function (next) {
  //this line belong to all the properties of userSchema to instance user variable.
  const user = this;
  
  if (!user.isModified("password")) return;
  //salt is like a screte key for 16-bytes, 128-bits
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  //replace the original password to the hash paswd.
  this.password = hashedPassword;

  next();
});

//this is mongooes virtual function. use to match password correct or not!
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
     //To find the user using email in the Database.
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;
   //Make hashed to user singin time.
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedHash)
      throw new Error("Incorrect Password");

    const token = createTokenForUser(user);
    return token;
  }
);

//Make model user in userSchema base.
const User = model("user", userSchema);

module.exports = User;
