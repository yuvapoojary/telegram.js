const telegram = require('./src/client/Client');
const Message = require('./src/structures/Message');

const bot = new telegram ({
  ApiURL: 'https://api.telegram.org'
});

bot.login(process.env.ttoken);

bot.fetchApplication().then(console.log);

bot.on('raw',(data) =>  {
  const msg = new Message(bot, data.message);
  if(msg.chat.type == 'private') bot.emit('dm', msg);
});

bot.on('debug', console.log);
bot.startPolling();

bot.on('dm', (msg) => {
  console.log(msg);
  msg.chat.send('Hello testing it')
});