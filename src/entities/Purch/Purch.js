import mongoose from 'mongoose';

const { Schema } = mongoose;

const purchSchema = new Schema(
    {
        id: { type: Number, unique: true, required: true, default: 0 },
        username: { type: String, required: true },
        name: { type: String, required: true },
        amount: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

purchSchema.pre('save', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const item = this;
    if (item.isNew) {
        PurchModel.findOne().sort('-id').exec(function (err, lastItem) {
            if (err) return next(err);
            item.id = lastItem ? lastItem.id + 1 : 1;
            next();
        })
    } else {
        next()
    }
})

const PurchModel = mongoose.models.Purch || mongoose.model('Purch', purchSchema);
export default PurchModel;