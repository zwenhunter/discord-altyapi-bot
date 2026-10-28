const { PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
    return ortak.hata(message, "Bu komut icin Kanallari Yonet yetkisi gerekli.");
  }

  if (!message.channel.isTextBased()) {
    return ortak.hata(message, "Bu komut sadece metin kanallarinda calisir.");
  }

  const saniye = parseInt(args[0], 10);

  if (Number.isNaN(saniye) || saniye < 0 || saniye > 21600) {
    return ortak.hata(message, "Yavas mod suresi 0 ile 21600 saniye arasinda olmali.");
  }

  try {
    await message.channel.setRateLimitPerUser(saniye, `${message.author.username}`);

    if (saniye === 0) {
      return ortak.basari(message, "Yavas mod kapatildi.");
    }

    return ortak.basari(message, `Yavas mod ${saniye} saniye olarak ayarlandi.`);
  } catch (hata) {
    console.error(hata);
    return ortak.hata(message, "Yavas mod ayarlanamadi.");
  }
};

exports.conf = {
  aliases: ["yavaş-mod", "yavas-mod", "slow"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "slowmode",
  description: "Kanalin yavas mod suresini ayarlar.",
  usage: "slowmode <saniye>"
};
