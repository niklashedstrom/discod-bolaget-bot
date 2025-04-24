require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

async function main() {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  await client.login(process.env.DISCORD_TOKEN);

  client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const todayFormatted = formatDate(today);
    const futureFormatted = formatDate(sevenDaysLater);

    const url = `https://www.systembolaget.se/sortiment/ol/?saljstart-fran=${todayFormatted}&saljstart-till=${futureFormatted}`;
    
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (!channel) {
      console.error('Channel not found');
      process.exit(1);
    }

    await channel.send('🍺 Här är den kommande veckans öl på bolaget: ' + url);
    console.log('Message sent!');

    client.destroy();
    process.exit(0); // Ensure a clean exit
  });
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

main().catch(err => {
  console.error('Error in main:', err);
  process.exit(1);
});
