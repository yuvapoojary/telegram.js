const telegram = require('./src/client/Client');
const Message = require('./src/structures/Message');
console.log(typeof Message);
const bot = new telegram ({
  ApiURL: 'https://api.telegram.org'
});

bot.login(process.env.ttoken);

bot.fetchApplication().then(console.log);

bot.on('raw',(data) =>  {
  const msg = new Message(bot, data.message || data.channel_post);
  console.log(!msg.chat && data);
  if(msg.chat.type == 'private') bot.emit('dm', msg);
});

bot.on('debug', console.log);
bot.startPolling();

bot.on('dm', (msg) => {
  msg.reply(msg.content)
  .then(() => msg.delete()).catch(console.error);
});