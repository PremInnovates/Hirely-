
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    businessName: {
      type: String,
      trim: true,
      default: '',
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      default: '',
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ['BUSINESS_OWNER', 'FREELANCER', 'ADMIN'],
      default: 'BUSINESS_OWNER',
    },

    profileImage: {
      type: String,
      default: '',
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: '',
    },

    location: {
      type: String,
      trim: true,
      default: '',
    },

    website: {
      type: String,
      trim: true,
      default: '',
    },

    // Freelancer profile fields
    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    hourlyRate: {
      type: Number,
      min: 0,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash the password when it is new or changed.
userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with the stored hash.
userSchema.methods.matchPassword = async function matchPassword(
  enteredPassword
) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
