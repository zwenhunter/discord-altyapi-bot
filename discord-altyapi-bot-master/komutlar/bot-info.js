const { EmbedBuilder, version } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message) => {
  const bellek = Math.round(process.memoryUsage().rss / 1024 / 1024);

  const embed = new EmbedBuilder()
    .setTitle("Bot Bilgisi")
    .setColor(0x2b2d31)
    .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: "Sunucular", value: `${client.guilds.cache.size}`, inline: true },
      { name: "Kullanicilar", value: `${client.users.cache.size}`, inline: true },
      { name: "Kanallar", value: `${client.channels.cache.size}`, inline: true },
      { name: "Uptime", value: ortak.sureYaz(client.uptime), inline: true },
      { name: "Bellek", value: `${bellek} MB`, inline: true },
      { name: "Ping", value: `${Math.round(client.ws.ping)} ms`, inline: true },
      { name: "Discord.js", value: version, inline: true },
      { name: "Node.js", value: process.version, inline: true }
    )
    .setTimestamp();

  return message.channel.send({ embeds: [embed] });
};

exports.conf = {
  aliases: ["bot-bilgi", "istatistik"],
  permLevel: 0,
  kategori: "Genel"
};

exports.help = {
  name: "bot-info",
  description: "Bot hakkinda bilgi verir.",
  usage: "bot-info"
};
