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

bot.commands.on('eval', async (c, msg, args) => {
  let evaled = await eval(args.join(' '));
  if(typeof evaled == 'string') {
    evaled = util.inspect(evaled);
  };
  
  msg.chat.send('```' + evaled + '```');
  
});