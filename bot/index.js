const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Telegraf, Markup } = require('telegraf');

if (!process.env.BOT_TOKEN) {
    console.error('❌ BOT_TOKEN is missing in .env file!');
    process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// 🌌 Start Command
bot.start((ctx) => {
    const welcomeText = `🚀 <b>Siz PLS Game Club botiga xush kelibsiz!</b>\n\nBu bot orqali siz klubdagi kompyuterlarni band qilishingiz, balansingizni to'ldirishingiz va xizmatingizni boshqarishingiz mumkin.\n\nO'yinga tayyormisiz? 👇`;

    return ctx.replyWithHTML(welcomeText, Markup.inlineKeyboard([
        [Markup.button.webApp('🕹️ MINI APP-NI OCHISH', 'https://pls-taupe.vercel.app?v=v30')]
    ]));
});

// 🆘 Help Command
bot.help((ctx) => ctx.reply('Agar muammo bo\'lsa, adminga murojaat qiling: @admin_username'));

// 🚀 Launch
bot.telegram.deleteWebhook({ drop_pending_updates: true }).then(() => {
    return bot.launch();
}).then(() => {
    console.log(`✅ PLS Game Club Bot is online as @${bot.botInfo.username}`);
}).catch((err) => {
    console.error('❌ Bot error:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
