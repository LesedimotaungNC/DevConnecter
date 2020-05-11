const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    // In most cases when you use async/await wrap your logic in a try catch block
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("MongoDB Connected");

    } catch (err) {
        console.error(err.message);
        // exit the process with failure.
        process.exit(1);
    }
}

module.exports = connectDB;