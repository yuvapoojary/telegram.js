const telegram = require('./src/client/Client');
const Message = require('./src/structures/Message');
const Markup = require('./src/structures/Markup');
const util = require('util');

const bot = new telegram();

bot.login(process.env.ttoken);


bot.setupWebhook('/gg', 8443, '0.0.0.0', {
  key: './private.key',
  cert: './server.crt'
});

bot.setWebhook('https://66.42.32.72:8443/gg', './server.crt');

bot.on('message', console.log);

bot.commands.on('eval', async (c, msg, args) => {
  let evaled = await eval(args.join(' '));
  if (typeof evaled !== 'string') {
    evaled = util.inspect(evaled);
  };
  msg.chat.send('```js\n' + evaled + '```', { mode: 'MarkdownV2' });
});