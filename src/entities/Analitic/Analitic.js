import mongoose from 'mongoose';

const { Schema } = mongoose;

const analiticSchema = new Schema(
    {
        id: { type: Number, unique: true, required: true, default: 0 },
        username: { type: String, unique: true, required: true },
        days: [{
            date: { type: String, required: false },
            events: [
                {
                    nameItem: { type: String, required: false },
                    count: { type: String, required: false },
                    type: { type: String, required: false }
                }
            ]
        }]
    }
)

analiticSchema.pre('save', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    if (user.isNew) {
        AnaliticModel.findOne().sort('-id').exec(function (err, lastUser) {
            if (err) return next(err);
            user.id = lastUser ? lastUser.id + 1 : 1;
            next();
        })
    } else {
        next()
    }
})

const AnaliticModel = mongoose.models.Analitic || mongoose.model('Analitic', analiticSchema);
export default AnaliticModel;