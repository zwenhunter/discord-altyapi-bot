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
      { SendMessages: false },
      { reason: `${message.author.username}: kanal kilitlendi` }
    );

    return ortak.basari(message, "Kanal mesaj gonderimine kapatildi.");
  } catch (hata) {
    console.error(hata);
    return ortak.hata(message, "Kanal kilitlenemedi.");
  }
};

exports.conf = {
  aliases: ["kilitle"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "lock",
  description: "Kanali mesaj gonderimine kapatir.",
  usage: "lock"
};
