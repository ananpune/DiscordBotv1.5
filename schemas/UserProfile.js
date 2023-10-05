const { Schema, model } = require('mongoose');

//essentially a Class that holds a UserProfile and connects us to our MongoDB
const UserProfileSchema = new Schema({

        userId: {
            type: String,
            required: true
        },
        balance: {
            type: Number,
            default: 0
        },

        lastDailyCollected: {
            type: Date,
            default: 0
        },


        // guildId: {
        //     type: String,
        //     required: true
        // }
    }, { timestamps: true }

);
//exporting the model so we can use it in other files
module.exports = model('UserProfile', UserProfileSchema);