const { ApplicationCommandOptionType } = require("discord.js");
const UserProfile = require('../../schemas/UserProfile');

module.exports = {

    run: async({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'You can only use this command in a server.',
                ephemeral: true

            });
            return;
        }
        const amount = interaction.options.getNumber('amount');

        //min bet

        if (amount < 10) {
            interaction.reply({
                content: 'You must gamble at least 10 coins.',

            });
            return;
        }
        //if userprofile found or not found
        let userProfile = await UserProfile.findOne({
            userId: interaction.user.id,
        });

        if (!userProfile) {
            userProfile = new UserProfile({
                userId: interaction.user.id,
            });
        }
        if (amount > userProfile.balance) {
            interaction.reply("You don't have enough coins to gamble that much!");
            return;
        }

        // 50/50 chance to win

        const didWin = Math.random() > 0.5;
        if (!didWin) {
            userProfile.balance -= amount;


            interaction.reply("☠️☠️☠️ARRRRGHHH you lost mateyyy, say bye to your coins!☠️☠️☠️");
            await userProfile.save();
            return;
        }

        const amountWon = Number(amount * (Math.random() + 0.60).toFixed(0));

        userProfile.balance += amountWon;
        await userProfile.save();

        interaction.reply(`🎉🎉🎉You won ${amountWon} coins!🎉🎉🎉`);
        return;


    },
    //command data and usage
    data: {
        name: 'gamble',
        description: 'Gamble your money away',
        options: [{
            name: 'amount',
            description: 'How much money you want to gamble',
            type: ApplicationCommandOptionType.Number,
            required: true
        }]

    }


}