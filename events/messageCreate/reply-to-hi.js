module.exports = (message) => {
    if (message.author.bot) return;
    if (message.content === "Hello") {
        message.reply("Chiyoda!");
    }
    if (message.content === "Bye") {
        message.reply("Mido-suji?");

    }
};