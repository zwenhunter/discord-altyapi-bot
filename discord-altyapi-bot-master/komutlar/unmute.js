const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return ortak.hata(message, "Bu komut icin Uyeleri Zaman Asimina Ugrat yetkisi gerekli.");
  }

  const hedef = await ortak.uyeBul(message, args[0]);

  if (!hedef) return ortak.hata(message, "Gecerli bir uye etiketle veya ID yaz.");
  if (!hedef.isCommunicationDisabled()) return ortak.hata(message, "Bu uyenin aktif bir zaman asimi yok.");
  if (!hedef.moderatable) return ortak.hata(message, "Bu uyenin zaman asimini kaldiramiyorum.");

  const sebep = (args.slice(1).join(" ") || "Sebep belirtilmedi").slice(0, 500);

  try {
    await hedef.timeout(null, `${message.author.username}: ${sebep}`);

    const embed = new EmbedBuilder()
      .setTitle("Zaman Asimi Kaldirildi")
      .setColor(0x57f287)
      .addFields(
        { name: "Uye", value: `${hedef.user.username} (${hedef.id})`, inline: true },
        { name: "Yetkili", value: `${message.author.username} (${message.author.id})`, inline: true },
        { name: "Sebep", value: sebep, inline: false }
      )
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    await ortak.modLog(message.guild, embed);
  } catch (hata) {
    console.error(hata);
    return ortak.hata(message, "Zaman asimi kaldirilamadi.");
  }
};

exports.conf = {
  aliases: ["susturma-kaldir", "timeout-kaldir"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "unmute",
  description: "Uyenin zaman asimini kaldirir.",
  usage: "unmute <uye> [sebep]"
};
