const Telegram = require('telegram.js');
const client = new Telegram.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}`);
});

client.on('message', (msg) => {
  if(msg.content === 'hii') {
    msg.reply('hello');
  };
});

client.commands.on('ping', (bot, msg, args) => {
  msg.chat.send('pong!');
});

client.login('token');