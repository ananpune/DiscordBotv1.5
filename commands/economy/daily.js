const UserProfile = require('../../schemas/UserProfile');

const dailyVal = 500;

module.exports = {

    run: async({ interaction }) => {
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
                const lastDailyCollected = userProfile.lastDailyCollected.toDateString();
                const currentDate = new Date().toDateString();

                if (lastDailyCollected === currentDate) {
                    interaction.editReply("Come back tomorrow to collect your daily reward!");
                    return;
                }
            } else {
                userProfile = new UserProfile({
                    userId: interaction.member.id,

                });

            }
            userProfile.balance += dailyVal;
            userProfile.lastDailyCollected = new Date();

            await userProfile.save();

            interaction.editReply(`You have collected your daily reward of ${dailyVal} coins! \n New Balance : ${userProfile.balance}`);

        } catch (error) {
            console.log(`Error Handling /daily: ${error}`);

        }

    },

    data: {
        name: 'daily',
        description: 'Get your daily reward!',
    },


}