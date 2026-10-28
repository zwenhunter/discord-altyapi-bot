const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message) => {
  if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
    return ortak.hata(message, "Bu komut icin Uyeleri Yasakla yetkisi gerekli.");
  }

  const banlar = await message.guild.bans.fetch().catch(() => null);

  if (!banlar) return ortak.hata(message, "Yasakli listesi alinamadi.");
  if (!banlar.size) return ortak.bilgi(message, "Yasakli Uyeler", "Sunucuda yasakli uye yok.");

  const liste = [...banlar.values()]
    .slice(0, 50)
    .map((ban) => `${ban.user.username} (${ban.user.id})${ban.reason ? ` - ${ban.reason}` : ""}`)
    .join("\n");

  const embed = new EmbedBuilder()
    .setTitle("Yasakli Uyeler")
    .setColor(0x2b2d31)
    .setDescription(liste.slice(0, 4096))
    .setFooter({ text: `Toplam ${banlar.size} yasakli` })
    .setTimestamp();

  return message.channel.send({ embeds: [embed] });
};

exports.conf = {
  aliases: ["banliste", "ban-listesi", "yasaklilar"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "ban-list",
  description: "Yasakli uyeleri listeler.",
  usage: "ban-list"
};
