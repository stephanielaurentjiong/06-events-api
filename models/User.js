const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //import secure password hashing library
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ], //use to validate that a field's value conforms to a specific regular expression (regex); ensures valid email format
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 10,
  },
});

// Hash the password before saving the user
UserSchema.pre("save", async function () {
  //pre-save hook; a Mongoose middlewae that runs before saving a user into DB
  const salt = await bcrypt.genSalt(10); //generate random string for the unique password before hashing; 10 is determining how many times the hashing alog. will be executed
  this.password = await bcrypt.hash(this.password, salt); //hash the "password" using salt generated
});

UserSchema.methods.getName = function () {
  return this.name;
};

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    //The sign method takes a payload, a secret key, and options to create the token.
    { userId: this._id, name: this.name }, //This is the payload that will be embedded in the JWT.
    //Embeds the user's unique ID (_id) from the MongoDB document into the JWT.
    //Embeds the user's name from the document into the JWT
    //The payload hv information to identify the user when the token is decoded.
    process.env.JWT_SECRET, //The secret key to sign JWT; ensures that the token can't be tampered
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password); //use to compare a plaintext password (candidatePassword) with a hashed password (this.password)
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
