require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  const today = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 7);

  const todayFormatted = formatDate(today);
  const futureFormatted = formatDate(sevenDaysLater);

  const url = `https://www.systembolaget.se/sortiment/ol/?saljstart-fran=${todayFormatted}&saljstart-till=${futureFormatted}`
  let channel = client.channels.cache.get(process.env.CHANNEL_ID);
  channel.send('🍺 Här är den kommande veckans öl på bolaget: ' + url);
  

  // Every Sunday at 10:00 AM
  cron.schedule('0 10 * * 0', () => {
    channel = client.channels.cache.get(process.env.CHANNEL_ID);
    if (channel) {
      channel.send('🍺 Här är den kommande veckans öl på bolaget: ' + url);
    }
  });
});

client.login(process.env.DISCORD_TOKEN);

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

