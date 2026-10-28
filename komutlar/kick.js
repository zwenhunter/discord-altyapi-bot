const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
    return ortak.hata(message, "Bu komut icin Uyeleri At yetkisi gerekli.");
  }

  const hedef = await ortak.uyeBul(message, args[0]);

  if (!hedef) return ortak.hata(message, "Gecerli bir uye etiketle veya ID yaz.");
  if (hedef.id === message.author.id) return ortak.hata(message, "Kendini atamazsin.");
  if (hedef.id === message.guild.ownerId) return ortak.hata(message, "Sunucu sahibi atilamaz.");
  if (!ortak.ustunMu(message, hedef)) return ortak.hata(message, "Bu uyenin rolu senin rolunden yuksek veya esit.");
  if (!hedef.kickable) return ortak.hata(message, "Bu uyeyi atamiyorum. Rol sirasini kontrol et.");

  const sebep = (args.slice(1).join(" ") || "Sebep belirtilmedi").slice(0, 500);

  try {
    await hedef.kick(`${message.author.username}: ${sebep}`);

    const embed = new EmbedBuilder()
      .setTitle("Uye Atildi")
      .setColor(0xed4245)
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
    return ortak.hata(message, "Uye atilamadi.");
  }
};

exports.conf = {
  aliases: ["at"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "kick",
  description: "Uyeyi sunucudan atar.",
  usage: "kick <uye> [sebep]"
};
