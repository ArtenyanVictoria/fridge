import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        id: { type: Number, unique: true, required: true, default: 0 },
        name: { type: String, required: true },
        password: { type: String, required: true }
    },
    {
        timestamps: true,
    }
)

userSchema.pre('save', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    if (user.isNew) {
        UserModel.findOne().sort('-id').exec(function (err, lastUser) {
            if (err) return next(err);
            user.id = lastUser ? lastUser.id + 1 : 1;
            next();
        })
    } else {
        next()
    }
})

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export default UserModel;