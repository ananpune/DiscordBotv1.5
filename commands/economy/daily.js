const UserProfile = require('../../schemas/UserProfile');

const dailyVal = 500;

module.exports = {

    run: async({ interaction }) => {

        //ensures that the command is being used in a guild
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "You can't use this command in DMs!",
                ephemeral: true
            });
            return;
        }

        try {
            await interaction.deferReply();

            let userProfile = await UserProfile.findOne({
                userId: interaction.member.id
            });

            if (userProfile) {
                //saving the lastDailyCollected to use later
                const lastDailyCollected = userProfile.lastDailyCollected.toDateString();
                const currentDate = new Date().toDateString();

                if (lastDailyCollected === currentDate) {
                    //sets limit to 1 per day
                    interaction.editReply("Come back tomorrow to collect your daily reward!");
                    return;
                }
            } else {
                userProfile = new UserProfile({
                    userId: interaction.member.id,

                });

            }
            //updates balance and starts next day timer
            userProfile.balance += dailyVal;
            userProfile.lastDailyCollected = new Date();

            await userProfile.save();

            interaction.editReply(`You have collected your daily reward of ${dailyVal} coins! \n New Balance : ${userProfile.balance}`);

        } catch (error) {
            //basic error handling
            console.log(`Error Handling /daily: ${error}`);

        }

    },
    // daily command name and desctription
    data: {
        name: 'daily',
        description: 'Get your daily reward!',
    },


}