const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const superAdminSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

superAdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

superAdminSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);
module.exports = SuperAdmin;
