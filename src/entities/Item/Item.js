import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemSchema = new Schema(
    {
        id: { type: Number, unique: true, required: true, default: 0 },
        name: { type: String, required: true },
        type: { type: String, required: true },
        manufactureDate: { type: String, required: true },
        expirationDate: { type: String, required: true },
        amount: { type: String, required: true },
        nutrition: { type: String, required: true },
        measureType: { type: String, required: true },
        allergens: { type: String }
    },
    {
        timestamps: true,
    }
)

itemSchema.pre('save', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const item = this;
    if (item.isNew) {
        ItemModel.findOne().sort('-id').exec(function (err, lastItem) {
            if (err) return next(err);
            item.id = lastItem ? lastItem.id + 1 : 1;
            next();
        })
    } else {
        next()
    }
})

const ItemModel = mongoose.models.Item || mongoose.model('Item', itemSchema);
export default ItemModel;