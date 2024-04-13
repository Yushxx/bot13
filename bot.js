const TelegramBot = require('node-telegram-bot-api');
const random = require('lodash/random');
const schedule = require('node-schedule');
const http = require('http');

// Remplacez 'YOUR_BOT_TOKEN' par le token de votre bot Telegram
const bot = new TelegramBot('6821721723:AAEQNab-FFMc-2u3VDOcn3PlJeWAu48vCAM', { polling: true });

// Fonction pour générer une séquence de jeu
function generateGameSequence() {
  const emojis = ['✴️', '🟦'];
  const rows = 5;
  const cols = 5;
  let sequence = '';
  let totalEvilCount = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const isEvilEmoji = Math.random() < 0.2 && totalEvilCount < 5;
      if (isEvilEmoji) {
        totalEvilCount++;
        sequence += '✴️';
      } else {
        sequence += '🟦';
      }
    }
    sequence += '\n';
  }

  // Si le nombre total de 🟦 est inférieur à 4, ajoutez des 👿 supplémentaires à la fin
  while (totalEvilCount < 4) {
    sequence = sequence.replace('🟦', '✴️');
    totalEvilCount++;
  }

  return sequence;
}

// Remplace la fonction generate_sequence par generateGameSequence
function generate_sequence() {
  return generateGameSequence();
}

// Modèle de séquence
const sequenceTemplate = `
🔔 CONFIRMED ENTRY!
💣 Mines : 3
🔐 Tentative: 3
⏰ valide : 5 minutes
`;

// Fonction pour envoyer une séquence dans le canal
function sendSequenceToChannel(chatId) {
  const sequenceMessage = `
${sequenceTemplate}
${generate_sequence()}


🚨 Fonction uniquement sur le cette platform ci-dessous!
👇👇👇
[S'inscrire](https://bit.ly/3NJ4vy0)

[🔹️GUIDE](https://telegra.ph/Tuto-mine-04-13)
`;

  // Options du clavier inline
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: 'Ouvrire le jeu mine', url: 'https://1wnurc.com/casino/play/1play_1play_mines' },

        { text: 'TUTORIEL MINE', url: 'http://t.me/Minetutobot' },
        
      ]
    ]
  };

  const options = {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
    reply_markup: inlineKeyboard
  };

  // Envoi du message dans le canal
  bot.sendMessage(chatId, sequenceMessage, options);
}

// Planification des envois de séquences
const scheduledTimes = '*/10 8-23 * * *';

schedule.scheduleJob(scheduledTimes, () => {
  sendSequenceToChannel('@xbetmine'); // Remplacez par l'identifiant de votre canal
});

// Gérer la commande /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: 'Voir la pomme', callback_data: 'voir_la_pomme' },
        { text: 'Test', callback_data: 'test_message' } // Bouton de test
      ]
    ]
  };
  const replyMarkup = { reply_markup: inlineKeyboard };

  bot.sendMessage(chatId, 'Cliquez sur "Voir la pomme" pour générer les séquences :', replyMarkup);
});

// Gérer le clic sur le bouton "Voir la pomme" ou "Test"
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (query.data === 'voir_la_pomme') {
    sendSequenceToChannel(chatId);
  } else if (query.data === 'test_message') {
    sendSequenceToChannel('@xbetmine'); // Envoi de séquence au canal
  }
});

// Code keep_alive pour éviter que le bot ne s'endorme
http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080);
