const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
    return ortak.hata(message, "Bu komut icin Uyeleri Yasakla yetkisi gerekli.");
  }

  const uye = await ortak.uyeBul(message, args[0]);
  const kullanici = uye
    ? uye.user
    : message.mentions.users.first() || (await ortak.kullaniciBul(client, args[0]));

  if (!kullanici) return ortak.hata(message, "Gecerli bir kullanici etiketle veya ID yaz.");
  if (kullanici.id === message.author.id) return ortak.hata(message, "Kendini yasaklayamazsin.");
  if (kullanici.id === message.guild.ownerId) return ortak.hata(message, "Sunucu sahibi yasaklanamaz.");

  if (uye) {
    if (!ortak.ustunMu(message, uye)) return ortak.hata(message, "Bu uyenin rolu senin rolunden yuksek veya esit.");
    if (!uye.bannable) return ortak.hata(message, "Bu uyeyi yasaklayamiyorum. Rol sirasini kontrol et.");
  }

  const sebep = (args.slice(1).join(" ") || "Sebep belirtilmedi").slice(0, 500);

  try {
    if (uye) {
      await uye.ban({ reason: `${message.author.username}: ${sebep}` });
    } else {
      await message.guild.bans.create(kullanici.id, { reason: `${message.author.username}: ${sebep}` });
    }

    const embed = new EmbedBuilder()
      .setTitle("Uye Yasaklandi")
      .setColor(0xed4245)
      .addFields(
        { name: "Uye", value: `${kullanici.username} (${kullanici.id})`, inline: true },
        { name: "Yetkili", value: `${message.author.username} (${message.author.id})`, inline: true },
        { name: "Sebep", value: sebep, inline: false }
      )
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    await ortak.modLog(message.guild, embed);
  } catch (hata) {
    console.error(hata);
    return ortak.hata(message, "Uye yasaklanamadi.");
  }
};

exports.conf = {
  aliases: ["yasakla"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "ban",
  description: "Uyeyi sunucudan yasaklar.",
  usage: "ban <uye> [sebep]"
};
