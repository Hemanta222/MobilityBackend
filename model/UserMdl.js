const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "invalid email address"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (value) {
          const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return emailFormat.test(value);
        },
        message: (props) => `Invalid email address`,
      },
    },
    password: {
      type: String,
      minlength: [8, `Password must be atleast 8 character long!`],
      required: [true, "Password must be atleast 8 character long!"],
    },
  },
  { timestamps: true }
);
userSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        const error = new Error();
        error.message = "server error";
        error.httpStatusCode = 500;
        return next(error);
      }
      user.password = hash;
      next();
    });
  });
});
// userSchema.statics.matchPassword = function (inputPassword) {
//   bcrypt.compare(inputPassword, this.password).then((result) => {
//     return result;
//   });
// };
userSchema.plugin(uniqueValidator, {
  message: "{VALUE} is already registerd.",
});
const User = mongoose.model("User", userSchema);
module.exports = User;
