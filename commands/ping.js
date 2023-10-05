module.exports = {
    data: {
        name: 'ping',
        description: 'Replies with Pong!',

    },
    run: ({ interaction }) => {
        //return ping of bot

        interaction.reply("My ping is:" + Math.round(interaction.client.ws.ping) + "ms");

    }
};