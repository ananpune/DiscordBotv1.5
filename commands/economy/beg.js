const Cooldown = require('../../schemas/Cooldown');
const UserProfile = require('../../schemas/UserProfile');

//function to get a Random number
function getRandomNumber(min, max) {
    const range = max - min + 1;
    const randomNumber = Math.floor(Math.random() * range) + min;
    return randomNumber;
}
module.exports = {
    //same idea as always, looking to only let command be used in a server
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
                return;

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
            //trying to find the userProfile for the person using command


            if (!userProfile) {
                //if no profile exists, one is made for the user
                userProfile = new UserProfile({ userId });

            }
            //balance update
            userProfile.balance += amount;
            cooldown.endsAt = Date.now() + 300000;

            await Promise.all([cooldown.save(), userProfile.save()]);
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