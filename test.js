const telegram = require('./src/client/Client');
const Message = require('./src/structures/Message');

const bot = new telegram ({
  ApiURL: 'https://api.telegram.org'
});

bot.login(process.env.ttoken);

bot.fetchApplication().then(console.log);

bot.on('raw',(data) =>  {
  const msg = new Message(bot, data.message || data.channel_post);
  if(msg.chat.type == 'private') bot.emit('dm', msg);
});

bot.on('debug', console.log);
bot.startPolling();

bot.on('dm', (msg) => {
  msg.chat.send(msg.content, {
    reply_to_message_id: msg.id
  })
  .then(console.log).catch(console.error);
});