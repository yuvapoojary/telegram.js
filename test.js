const telegram = require('./src/client/Client');

const bot = new telegram ({
  ApiURL: 'https://api.telegram.com'
});

bot.login(process.env.ttoken);

bot.fetchApplication().then(console.log);