const telegram = require('./src/client/Client');
const Message = require('./src/structures/Message');

const bot = new telegram({
  ApiURL: 'https://api.telegram.org'
});

bot.login(process.env.ttoken);

bot.fetchApplication().then(console.log);

bot.on('raw', async (data) => {
  console.log(JSON.stringify(data, null, 4));
  const msg = new Message(bot, data.message || data.channel_post);
  msg.member = await msg.member.fetch();
  if (msg.content == 'leave') msg.chat.leave()
});

bot.on('debug', console.log);

bot.startPolling();

bot.commands.on('ping', (client, msg, args) => {
  msg.reply('pong!');
});

bot.commands.on('photo', (c, msg, args) => {
  msg.chat.setPhoto('https://cdn.discordapp.com/attachments/766031887297806376/802235318173564948/Slide27.JPG');
});