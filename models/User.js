// models/User.js
import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'finance_staff'], default: 'admin' },
    businesses: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
}, { timestamps: true });

// Password hash before saving
UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
});

// Compare password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await compare(enteredPassword, this.password);
}

export default model('User', UserSchema);
