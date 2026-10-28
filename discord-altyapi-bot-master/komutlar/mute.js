const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return ortak.hata(message, "Bu komut icin Uyeleri Zaman Asimina Ugrat yetkisi gerekli.");
  }

  const hedef = await ortak.uyeBul(message, args[0]);

  if (!hedef) return ortak.hata(message, "Gecerli bir uye etiketle veya ID yaz.");
  if (hedef.id === message.author.id) return ortak.hata(message, "Kendine zaman asimi uygulayamazsin.");
  if (hedef.id === message.guild.ownerId) return ortak.hata(message, "Sunucu sahibine zaman asimi uygulanamaz.");
  if (!ortak.ustunMu(message, hedef)) return ortak.hata(message, "Bu uyenin rolu senin rolunden yuksek veya esit.");
  if (!hedef.moderatable) return ortak.hata(message, "Bu uyeye zaman asimi uygulayamiyorum.");

  let sure = ortak.sureCoz(args[1]);
  let sebepBaslangici = 2;

  if (!sure) {
    sure = 10 * 60000;
    sebepBaslangici = 1;
  }

  if (sure < 5000) return ortak.hata(message, "Sure en az 5 saniye olmali.");
  if (sure > 28 * 86400000) return ortak.hata(message, "Sure en fazla 28 gun olmali.");

  const sebep = (args.slice(sebepBaslangici).join(" ") || "Sebep belirtilmedi").slice(0, 500);

  try {
    await hedef.timeout(sure, `${message.author.username}: ${sebep}`);

    const embed = new EmbedBuilder()
      .setTitle("Zaman Asimi Uygulandi")
      .setColor(0xed4245)
      .addFields(
        { name: "Uye", value: `${hedef.user.username} (${hedef.id})`, inline: true },
        { name: "Yetkili", value: `${message.author.username} (${message.author.id})`, inline: true },
        { name: "Sure", value: ortak.sureYaz(sure), inline: true },
        { name: "Sebep", value: sebep, inline: false }
      )
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    await ortak.modLog(message.guild, embed);
  } catch (hata) {
    console.error(hata);
    return ortak.hata(message, "Zaman asimi uygulanamadi.");
  }
};

exports.conf = {
  aliases: ["sustur", "timeout"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "mute",
  description: "Uyeye gecici zaman asimi uygular.",
  usage: "mute <uye> [sure] [sebep]"
};
