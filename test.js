const telegram = require('./src/client/Client');
const Message = require('./src/structures/Message');
const Markup = require('./src/structures/Markup');
const util = require('util');

const bot = new telegram({
  ApiURL: 'https://api.telegram.org'
});

bot.login(process.env.ttoken);

bot.fetchApplication().then(console.log);

bot.on('debug', console.log);


bot.setupWebhook('/gg', 8443, '0.0.0.0', {
  key: './private.key',
  cert: './server.crt'
});

bot.startPolling() 

bot.on('message', console.log);

bot.commands.on('ping', (client, msg, args) => {
  msg.chat.send('https://crustplay.com', {
    markup: {
      inline_keyboard: [[{
        text: 'Done',
        callback_data: '12345'
      }, {
        text: 'Done2',
        callback_data: '5'
      }], [{
        text: 'om',
        callback_data: '66'
      }]]
    },
    embedLinks: false
  });
  msg.chat.sendLocation(12.000, 71.555);

});


bot.commands.on('eval', async (c, msg, args) => {
  let evaled = await eval(args.join(' '));
  if (typeof evaled !== 'string') {
    evaled = util.inspect(evaled);
  };

  msg.chat.send('```js\n' + evaled + '```', { mode: 'MarkdownV2' });

});


bot.on('callbackQuery', (data) => {
  data.send('Hello', {
    show_alert: true
  });
});

bot.on('inlineQuery', (data) => {
  data.send([1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => ({
    type: 'article',
    id: data.id + id,
    title: 'Test',
    input_message_content: {
      message_text: 'This is an paragraph'
    }
  })));
});

bot.on('inlineQueryResult', (data) => {
  console.log(data);
});


bot.commands.on('await', (c, msg) => {
  const collector = msg.chat.createMessageCollector((m) => m.author.id == msg.author.id, {
    max: 3
  });
  collector.on('collect', (data) => {
    console.log(data);
  });
  collector.on('end', console.log);
});

bot.on('chatMemberAdd', (...args) => console.log(...args));
bot.on('chatMemberRemove', (...args) => console.log(...args));
bot.on('chatCreate', (...args) => console.log(...args));
bot.on('chatDelete', (...args) => console.log(args));