import mongoose from 'mongoose';



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('connected Successfully');
    } catch (err) {
        console.log(err);
    }
}


export default connectDB;

