const telegram = require('./src/client/Client');
const Message = require('./src/structures/Message');

const bot = new telegram ({
  ApiURL: 'https://api.telegram.org'
});

bot.login(process.env.ttoken);

bot.fetchApplication().then(console.log);

bot.on('raw', async(data) =>  {
  const msg = new Message(bot, data.message || data.channel_post);
  msg.member = await msg.member.fetch();
  console.log(JSON.stringify(data, null, 4));
  if(msg.content == 'leave') msg.chat.leave()
});

bot.on('debug', console.log);
bot.startPolling();

bot.on('dm', (msg) => {
});