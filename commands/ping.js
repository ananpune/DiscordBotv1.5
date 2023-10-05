module.exports = {
    data: {
        name: 'ping',
        description: 'Replies with Pong!',

    },
    run: ({ interaction }) => {
        interaction.reply('Pong!');
    }
};