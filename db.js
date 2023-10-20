import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        await mongoose.connect('mongodb+srv://node_js:node_js@nodejs.kkclokc.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true
        });
        console.log("Database connected");
    } catch (e) {
        console.log(e.message);
    }
}
