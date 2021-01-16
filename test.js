const telegram = require('./src/client/Client');
const Message = require('./src/structures/Message');

const bot = new telegram ({
  ApiURL: 'https://api.telegram.org'
});

bot.login(process.env.ttoken);

bot.fetchApplication().then(console.log);

bot.on('raw',(data) =>  {
  console.log(new Message(bot, data.message));
});

bot.on('debug', console.log);
bot.startPolling();