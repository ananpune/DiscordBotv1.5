const { ApplicationCommandOptionType } = require("discord.js");
const UserProfile = require('../../schemas/UserProfile');

module.exports = {

    run: async({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "You can't use this command in DMs!",
                ephemeral: true
            });
            return;
        }

        const targetUserId = interaction.options.getUser('target-user') || interaction.user.id;

        await interaction.deferReply();
        try {

            let userProfile = await UserProfile.findOne({ userId: targetUserId });

            if (!userProfile) {
                userProfile = new UserProfile({ userId: targetUserId });
            }
            interaction.editReply(
                targetUserId === interaction.user.id ? `Your balance is ${userProfile.balance}` : `The balance of <@${targetUserId}> is ${userProfile.balance}`
            );
        } catch (error) {
            console.log(`Error Handling /balance: ${error}`);

        }
    },


    data: {
        name: 'balance',
        description: 'Get your balance!',

    },


};