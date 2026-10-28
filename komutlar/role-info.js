const { EmbedBuilder } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  const rol = ortak.rolBul(message, args.join(" "));

  if (!rol) return ortak.hata(message, "Gecerli bir rol etiketle veya isim yaz.");

  const embed = new EmbedBuilder()
    .setTitle("Rol Bilgisi")
    .setColor(rol.hexColor)
    .addFields(
      { name: "Rol", value: rol.name, inline: true },
      { name: "ID", value: rol.id, inline: true },
      { name: "Renk", value: rol.hexColor, inline: true },
      { name: "Pozisyon", value: `${rol.position}`, inline: true },
      { name: "Uye Sayisi", value: `${rol.members.size}`, inline: true },
      { name: "Yetki Sayisi", value: `${rol.permissions.toArray().length}`, inline: true },
      { name: "Ayri Gosterim", value: rol.hoist ? "Evet" : "Hayir", inline: true },
      { name: "Etiketlenebilir", value: rol.mentionable ? "Evet" : "Hayir", inline: true },
      { name: "Bot Rolu", value: rol.managed ? "Evet" : "Hayir", inline: true },
      { name: "Olusturulma", value: `<t:${Math.floor(rol.createdTimestamp / 1000)}:F>`, inline: false }
    )
    .setTimestamp();

  return message.channel.send({ embeds: [embed] });
};

exports.conf = {
  aliases: ["rol-bilgi", "rolbilgi"],
  permLevel: 0,
  kategori: "Genel"
};

exports.help = {
  name: "role-info",
  description: "Rol hakkinda bilgi verir.",
  usage: "role-info <rol>"
};
