const telegram = require('./src/client/Client');

const bot = new telegram ({
  ApiURL: 'https://api.telegram.org'
});

bot.login(process.env.ttoken);

bot.fetchApplication().then(console.log);

bot.on('raw', console.log);

bot.on('debug', console.log);
bot.startPolling();