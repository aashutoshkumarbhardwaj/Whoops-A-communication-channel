const {Schema, model} = require('mongoose');
const {createHmac, randomBytes} = require('crypto');

const userSchema = new Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
        
    },
    password:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String,
        required:false
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'

    },

},
    {timestamps:true}

);

userSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified('password')) return next();

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.statics.matchPassword = async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) return false;

    const salt = user.salt;
    const hashedPassword = createHmac('sha256', salt)
    .update(password)
    .digest('hex');

    return user.doc && user.password === hashedPassword;
};

const User = model('User', userSchema);

module.exports = User;