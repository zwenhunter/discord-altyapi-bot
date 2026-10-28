const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");
const sunucu = require("../veriler/sunucu");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return ortak.hata(message, "Bu komut icin Uyeleri Zaman Asimina Ugrat yetkisi gerekli.");
  }

  const hedef = await ortak.uyeBul(message, args[0]);

  if (!hedef) return ortak.hata(message, "Gecerli bir uye etiketle veya ID yaz.");

  const sayi = sunucu.uyariTemizle(message.guild.id, hedef.id);

  const embed = new EmbedBuilder()
    .setTitle("Uyarilar Temizlendi")
    .setColor(0x57f287)
    .addFields(
      { name: "Uye", value: `${hedef.user.username} (${hedef.id})`, inline: true },
      { name: "Silinen Uyari", value: `${sayi}`, inline: true },
      { name: "Yetkili", value: `${message.author.username} (${message.author.id})`, inline: true }
    )
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
  await ortak.modLog(message.guild, embed);
};

exports.conf = {
  aliases: ["uyarı-sil", "uyari-sil", "warn-temizle"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "warn-clear",
  description: "Uyenin tum uyarilarini siler.",
  usage: "warn-clear <uye>"
};
