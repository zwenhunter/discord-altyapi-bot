const { EmbedBuilder } = require("discord.js");

exports.run = async (client, message) => {
  const embed = new EmbedBuilder()
    .setTitle("Ping")
    .setColor(0x2b2d31)
    .setDescription("Olculuyor...");

  const baslangic = Date.now();
  const mesaj = await message.channel.send({ embeds: [embed] });
  const gecikme = Date.now() - baslangic;

  embed
    .setDescription("Gecikme degerleri")
    .addFields(
      { name: "WebSocket", value: `${Math.round(client.ws.ping)} ms`, inline: true },
      { name: "Mesaj", value: `${gecikme} ms`, inline: true }
    );

  return mesaj.edit({ embeds: [embed] });
};

exports.conf = {
  aliases: ["gecikme"],
  permLevel: 0,
  kategori: "Genel"
};

exports.help = {
  name: "ping",
  description: "Bot gecikmesini gosterir.",
  usage: "ping"
};
