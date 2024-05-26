import mongoose from 'mongoose';
import { hashPassword } from '@/lib/auth.js';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await hashPassword(this.password);
    }
    next();
});

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;