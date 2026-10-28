const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");
const sunucu = require("../veriler/sunucu");

exports.run = async (client, message, args) => {
  let hedef = message.member;

  if (args[0]) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return ortak.hata(message, "Baska bir uyenin uyarilarini gormek icin yetkin yok.");
    }

    hedef = await ortak.uyeBul(message, args[0]);

    if (!hedef) return ortak.hata(message, "Gecerli bir uye etiketle veya ID yaz.");
  }

  const uyarilar = sunucu.uyariListele(message.guild.id, hedef.id);

  if (!uyarilar.length) {
    return ortak.bilgi(message, "Uyarilar", `${hedef.user.username} icin kayitli uyari yok.`);
  }

  const liste = uyarilar
    .slice(-10)
    .map((uyari, index) => {
      return `${index + 1}. ${uyari.sebep} - ${uyari.yetkili} - <t:${Math.floor(uyari.tarih / 1000)}:f>`;
    })
    .join("\n");

  const embed = new EmbedBuilder()
    .setTitle(`${hedef.user.username} Uyarilari`)
    .setColor(0x2b2d31)
    .setDescription(liste.slice(0, 4096))
    .setFooter({ text: `Toplam ${uyarilar.length} uyari` })
    .setTimestamp();

  return message.channel.send({ embeds: [embed] });
};

exports.conf = {
  aliases: ["uyarılar", "uyarilar", "warnings"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "warns",
  description: "Uyenin uyarilarini listeler.",
  usage: "warns [uye]"
};
