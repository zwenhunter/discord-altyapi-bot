const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return ortak.hata(message, "Bu komut icin Sunucuyu Yonet yetkisi gerekli.");
  }

  const kanal = message.mentions.channels.first();

  if (!kanal) return ortak.hata(message, "Duyuru yapilacak kanali etiketle.");
  if (!kanal.isTextBased()) return ortak.hata(message, "Duyuru sadece metin kanallarina gonderilebilir.");

  const metin = args.slice(1).join(" ").slice(0, 4096);

  if (!metin) return ortak.hata(message, "Duyuru metnini yaz.");

  const embed = new EmbedBuilder()
    .setTitle("Duyuru")
    .setColor(0x2b2d31)
    .setDescription(metin)
    .setFooter({ text: `Yetkili: ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
    .setTimestamp();

  try {
    await kanal.send({ embeds: [embed] });
    return ortak.basari(message, `Duyuru ${kanal} kanalina gonderildi.`);
  } catch (hata) {
    console.error(hata);
    return ortak.hata(message, "Duyuru gonderilemedi.");
  }
};

exports.conf = {
  aliases: ["announce", "duyur"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "duyuru",
  description: "Belirtilen kanala duyuru gonderir.",
  usage: "duyuru <kanal> <mesaj>"
};
