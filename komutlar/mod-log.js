const { PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");
const sunucu = require("../veriler/sunucu");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return ortak.hata(message, "Bu komut icin Sunucuyu Yonet yetkisi gerekli.");
  }

  const ayar = sunucu.sunucuOku(message.guild.id);
  const secim = (args[0] || "").toLowerCase();

  if (secim === "kapat") {
    ayar.modLog = "";
    sunucu.sunucuKaydet(message.guild.id, ayar);

    return ortak.basari(message, "Moderasyon log kanali kapatildi.");
  }

  const kanal = message.mentions.channels.first();

  if (!kanal) return ortak.hata(message, "Bir kanal etiketle veya kapat yaz.");
  if (!kanal.isTextBased()) return ortak.hata(message, "Log kanali metin kanali olmali.");

  ayar.modLog = kanal.id;
  sunucu.sunucuKaydet(message.guild.id, ayar);

  return ortak.basari(message, `Moderasyon log kanali ${kanal} olarak ayarlandi.`);
};

exports.conf = {
  aliases: ["modlog", "log-kanal"],
  permLevel: 0,
  kategori: "Sunucu"
};

exports.help = {
  name: "mod-log",
  description: "Moderasyon log kanalini ayarlar.",
  usage: "mod-log <kanal>"
};
