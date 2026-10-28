const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");
const sunucu = require("../veriler/sunucu");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return ortak.hata(message, "Bu komut icin Uyeleri Zaman Asimina Ugrat yetkisi gerekli.");
  }

  const hedef = await ortak.uyeBul(message, args[0]);

  if (!hedef) return ortak.hata(message, "Gecerli bir uye etiketle veya ID yaz.");
  if (hedef.id === message.guild.ownerId) return ortak.hata(message, "Sunucu sahibine uyari verilemez.");

  const sebep = (args.slice(1).join(" ") || "Sebep belirtilmedi").slice(0, 500);

  const uyari = {
    sebep,
    yetkili: `${message.author.username} (${message.author.id})`,
    tarih: Date.now()
  };

  const liste = sunucu.uyariEkle(message.guild.id, hedef.id, uyari);

  const embed = new EmbedBuilder()
    .setTitle("Uyari Verildi")
    .setColor(0xfee75c)
    .addFields(
      { name: "Uye", value: `${hedef.user.username} (${hedef.id})`, inline: true },
      { name: "Yetkili", value: `${message.author.username} (${message.author.id})`, inline: true },
      { name: "Uyari Sayisi", value: `${liste.length}`, inline: true },
      { name: "Sebep", value: sebep, inline: false }
    )
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
  await ortak.modLog(message.guild, embed);
};

exports.conf = {
  aliases: ["uyar", "uyarı"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "warn",
  description: "Uyeye uyari verir.",
  usage: "warn <uye> [sebep]"
};
