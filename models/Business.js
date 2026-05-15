import { Schema, model } from 'mongoose';

const BusinessSchema = new Schema({
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    currency: { type: String, default: 'USD' },
}, { timestamps: true });

export default model('Business', BusinessSchema);
