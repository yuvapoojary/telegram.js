'use strict';

module.exports = {
  // Starting points
  BaseClient: require('./client/BaseClient'),
  Client: require('./BaseClient'),
  PollingClient: require('./client/PollingClient'),
  WebhookClient: require('./client/WebhookClient'),
  WorkerClient: require('./client/WorkerClient'),

  // Utilities
  Collection: require('./util/Collection'),
  Collector: require('./util/Collector'),
  Constants: require('./util/Constants'),
  Permissions: require('./util/Permissions'),
  Util: require('./util/Util'),

  // Managers
  BaseManager: require('./managers/BaseManager'),
  ChatManager: require('./managers/ChatManager'),
  ChatMemberManager: require('./managers/ChatMemberManager'),
  MessageManager: require('./managers/MessageManager'),
  UserManager: require('./managers/UserManager'),

  // Structures
  Base: require('./structures/Base'),
  CallbackQuery: require('./structures/CallbackQuery'),
  Chat: require('./structures/Chat'),
  ChatMember: require('./structures/ChatMember'),
  ClientUser: require('./structures/ClientUser'),
  CommandManager: require('./structures/CommandManager'),
  InlineChosenResult: require('./structures/InlineChosenResult'),
  InlineQuery: require('./structures/InlineQuery'),
  Location: require('./structures/Location'),
  Markup: require('./structures/Markup'),
  MarkupButton: require('./structures/MarkupButton'),
  Message: require('./structures/Message'),
  MessageCollector: require('./structures/MessageCollector'),
  MessageEntity: require('./structures/MessageEntity'),
  User: require('./structures/User'),

  // Media
  Animation: require('./structures/media/Animation'),
  Audio: require('./structures/media/Audio'),
  Contact: require('./structures/media/Contact'),
  Dice: require('./structures/media/Dice'),
  Document: require('./structures/media/Document'),
  File: require('./structures/media/File'),
  Photo: require('./structures/media/Photo'),
  Poll: require('./structures/media/Poll'),
  Sticker: require('./structures/media/Sticker'),
  Video: require('./structures/media/Video'),
  VideoNote: require('./structures/media/VideoNote'),
  Voice: require('./structures/media/Voice')

};