const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
    return ortak.hata(message, "Bu komut icin Uyeleri Yasakla yetkisi gerekli.");
  }

  const id = (args[0] || "").replace(/[<@!>]/g, "");

  if (!/^\d{17,20}$/.test(id)) {
    return ortak.hata(message, "Gecerli bir kullanici ID yaz.");
  }

  const ban = await message.guild.bans.fetch(id).catch(() => null);

  if (!ban) return ortak.hata(message, "Bu kullanici sunucuda yasakli degil.");

  const sebep = (args.slice(1).join(" ") || "Sebep belirtilmedi").slice(0, 500);

  try {
    await message.guild.members.unban(id, `${message.author.username}: ${sebep}`);

    const embed = new EmbedBuilder()
      .setTitle("Yasak Kaldirildi")
      .setColor(0x57f287)
      .addFields(
        { name: "Kullanici", value: `${ban.user.username} (${id})`, inline: true },
        { name: "Yetkili", value: `${message.author.username} (${message.author.id})`, inline: true },
        { name: "Sebep", value: sebep, inline: false }
      )
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    await ortak.modLog(message.guild, embed);
  } catch (hata) {
    console.error(hata);
    return ortak.hata(message, "Yasak kaldirilamadi.");
  }
};

exports.conf = {
  aliases: ["ban-kaldir", "yasak-kaldir"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "unban",
  description: "Yasakli uyenin yasagini kaldirir.",
  usage: "unban <kullanici id> [sebep]"
};
