const { PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
    return ortak.hata(message, "Bu komut icin Kanallari Yonet yetkisi gerekli.");
  }

  if (!message.channel.isTextBased()) {
    return ortak.hata(message, "Bu komut sadece metin kanallarinda calisir.");
  }

  try {
    await message.channel.permissionOverwrites.edit(
      message.guild.roles.everyone,
      { SendMessages: null },
      { reason: `${message.author.username}: kanal kilidi acildi` }
    );

    return ortak.basari(message, "Kanal kilidi acildi.");
  } catch (hata) {
    console.error(hata);
    return ortak.hata(message, "Kanal kilidi acilamadi.");
  }
};

exports.conf = {
  aliases: ["kilit-ac", "kilit-aç", "kilitaç"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "unlock",
  description: "Kanalin mesaj kilidini acar.",
  usage: "unlock"
};
