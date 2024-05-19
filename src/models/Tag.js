import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

TagSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const TagModel = mongoose.models.Tag || mongoose.model('Tag', TagSchema);

export default TagModel;
