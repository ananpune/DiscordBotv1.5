module.exports = {
    data: {
        name: 'hello',
        description: 'Replies with Howdy Partner!',

    },
    run: ({ interaction }) => {
        interaction.reply('Howdy Partner!');

    },


};