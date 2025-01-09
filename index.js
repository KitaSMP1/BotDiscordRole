const { Client, GatewayIntentBits, REST, Routes, PermissionsBitField } = require('discord.js');

// Replace with your bot token, application ID, and guild ID
const BOT_TOKEN = '';
const APP_ID = '1326882649519951923';
const GUILD_ID = '1324748151021768775';

// Replace with your channel ID and role ID
const ALLOWED_CHANNEL_ID = '1326881054006579222';
const ROLE_ID = '1326800374509604874';

// Create client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

// Register the slash command
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
    try {
        console.log('Registering slash command...');

        await rest.put(
            Routes.applicationGuildCommands(APP_ID, GUILD_ID),
            {
                body: [
                    {
                        name: 'anick',
                        description: 'Change your display name and get a role',
                        options: [
                            {
                                name: 'nickname',
                                type: 3, // String type
                                description: 'The nickname to set',
                                required: true,
                            },
                        ],
                    },
                ],
            }
        );

        console.log('Slash command registered successfully.');
    } catch (error) {
        console.error('Error registering slash command:', error);
    }
})();

// Listen for the bot being ready
client.once('ready', () => {
    console.log(`${client.user.tag} is now online!`);
});

// Handle slash command interactions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options, channelId, member, guild } = interaction;

    if (commandName === 'anick') {
        // Check if command is used in the allowed channel
        if (channelId !== ALLOWED_CHANNEL_ID) {
            return interaction.reply({
                content: `This command can only be used in <#${ALLOWED_CHANNEL_ID}>.`,
                ephemeral: true,
            });
        }

        const nickname = options.getString('nickname');

        try {
            // Change the member's nickname
            await member.setNickname(nickname);

            // Assign the role to the member
            const role = guild.roles.cache.get(ROLE_ID);
            if (!role) {
                return interaction.reply({
                    content: 'The specified role does not exist!',
                    ephemeral: true,
                });
            }

            await member.roles.add(role);

            // Respond to the interaction
            await interaction.reply({
                content: `Your nickname has been updated to **${nickname}**, and the role has been assigned!`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error updating nickname or assigning role:', error);
            await interaction.reply({
                content: 'There was an error while executing this command.',
                ephemeral: true,
            });
        }
    }
});

client.once('ready', () => {
    console.log(`${client.user.tag} is now online!`);

    // Set bot activity to "Watching 24/7 Bot Server"
    client.user.setActivity('24/7 Bot Server', { type: 'WATCHING' });

    // Tambahkan status rotasi jika diperlukan
    const statuses = [
        '24/7 Bot Server',
        'UFO Corporation',
        'Product Updates'
    ];
    
    let i = 0;
    setInterval(() => {
        client.user.setActivity(statuses[i], { type: 'WATCHING' });
        i = (i + 1) % statuses.length;
    }, 10000); // Ganti status setiap 10 detik
});

// Log in to Discord
client.login(BOT_TOKEN);
