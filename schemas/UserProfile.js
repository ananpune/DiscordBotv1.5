const { Schema, model } = require('mongoose');


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

module.exports = model('UserProfile', UserProfileSchema);