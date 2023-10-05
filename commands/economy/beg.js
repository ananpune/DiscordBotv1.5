const Cooldown = require('../../schemas/Cooldown');
const UserProfile = require('../../schemas/UserProfile');

function getRandomNumber(min, max) {
    const range = max - min + 1;
    const randomNumber = Math.floor(Math.random() * range) + min;
    return randomNumber;
}
module.exports = {
    run: async({ interaction }) => {
        if (!interaction.inGuild()) {
            await interaction.reply({
                content: 'You can\'t use this command in DMs!',
                ephemeral: true
            });
            return;
        }
        try {
            await interaction.deferReply();
            const commandName = 'beg';
            const userId = interaction.user.id;

            let cooldown = await Cooldown.findOne({ userId, commandName });

            if (cooldown && Date.now() < cooldown.endsAt) {
                const { default: prettyMs } = await
                import ('pretty-ms');
                await interaction.editReply(`You can beg again in ${prettyMs(cooldown.endsAt - Date.now())}`);
            }
            if (!cooldown) {
                cooldown = new Cooldown({ userId, commandName });


            }

            const chance = getRandomNumber(0, 100);
            if (chance < 40) {
                await interaction.editReply("you got nothing");

                cooldown.endsAt = Date.now() + 300000;
                await cooldown.save();
                return;
            }

            const amount = getRandomNumber(20, 100);
            let userProfile = await UserProfile.findOne({ userId }).select('userId balance');


            if (!userProfile) {
                userProfile = new UserProfile({ userId });

            }
            userProfile.balance += amount;
            cooldown.endsAt = Date.now() + 300000;

            await Promise.all([cooldown.save(), UserProfile.save]);
            await interaction.editReply(`You begged for money and got ${amount} coins`);


        } catch (error) {
            console.log(`An error occurred while executing the beg command: ${error.message}`);

        }

    },
    data: {
        name: 'beg',
        description: 'Beg for money',
    },
};