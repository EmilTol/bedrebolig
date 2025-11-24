const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bedreboligDB';
        await mongoose.connect(uri, {
            autoIndex: true,
        });
        console.log(' MongoDB forbundet succesfuldt');
    } catch (error) {
        console.error(' MongoDB forbindelsesfejl:', error);
        process.exit(1);
    }
};

module.exports = {connectDB};