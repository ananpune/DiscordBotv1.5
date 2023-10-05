const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const weather = require('weather-js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get the weather for a location')

        .addStringOption(option => option.setName('location').setDescription('The location to get the weather for').setRequired(true))
        .addStringOption(option => option.setName('unit').setDescription('The unit to get the weather in').setRequired(true).addChoices({ name: 'Celsius', value: 'C' }, { name: 'Fahrenheit', value: 'F' })),
    run: async({ interaction }) => {
        const { options } = interaction;
        const location = options.getString('location');
        const degree = options.getString('unit');

        await interaction.reply({ content: `Gathering weather data...` });

        await weather.find({ search: `${location}`, degreeType: `${degree}` }, async function(err, result) {
            setTimeout(() => {
                if (err) {
                    console.log(err);
                    return interaction.editReply({ content: `${err} | There was an error fetching the weather data for ${location}` });
                } else {
                    if (result.length == 0) {
                        return interaction.editReply({ content: `There was an error fetching the weather data for ${location}` });
                    } else {
                        const temp = result[0].current.temperature;
                        const type = result[0].current.skytext;
                        const name = result[0].location.name;
                        const feel = result[0].current.feelslike;
                        const icon = result[0].current.imageUrl;
                        const wind = result[0].current.winddisplay;
                        const day = result[0].current.day;
                        const alert = result[0].location.alert || 'None';

                        const embed = new EmbedBuilder()
                            .setColor("Aqua")
                            .setTitle(`Current Weather for ${name}`)
                            .addFields({ name: 'Temperature', value: `${temp}` })
                            .addFields({ name: 'Feels Like', value: `${feel}` })
                            .addFields({ name: 'Wind', value: `${wind}` })
                            .addFields({ name: 'Day', value: `${day}` })
                            .addFields({ name: 'Alert', value: `${alert}` })
                            .addFields({ name: 'Type', value: `${type}` })

                        .setThumbnail(`${icon}`);

                        interaction.editReply({ content: ``, embeds: [embed] });

                    }
                }
            }, 2000);



        });
    }
};