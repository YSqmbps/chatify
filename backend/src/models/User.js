import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: '',
    }
},{
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段,作用是记录文档创建时间和更新时间
});

const User = mongoose.model('User', userSchema);

export default User;
