const { EmbedBuilder } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  const arguman = (args[0] || "").toLowerCase();

  if (arguman === "sunucu" || arguman === "server") {
    const ikon = message.guild.iconURL({ size: 1024 });

    if (!ikon) return ortak.hata(message, "Sunucunun ikonu yok.");

    const embed = new EmbedBuilder()
      .setTitle(`${message.guild.name} Sunucu Ikonu`)
      .setColor(0x2b2d31)
      .setImage(ikon);

    return message.channel.send({ embeds: [embed] });
  }

  let kullanici = message.author;

  if (args[0]) {
    kullanici = message.mentions.users.first() || (await ortak.kullaniciBul(client, args[0]));

    if (!kullanici) return ortak.hata(message, "Gecerli bir kullanici etiketle veya ID yaz.");
  }

  const embed = new EmbedBuilder()
    .setTitle(`${kullanici.username} Avatar`)
    .setColor(0x2b2d31)
    .setImage(kullanici.displayAvatarURL({ size: 1024 }));

  return message.channel.send({ embeds: [embed] });
};

exports.conf = {
  aliases: ["pp", "profil-resmi"],
  permLevel: 0,
  kategori: "Genel"
};

exports.help = {
  name: "avatar",
  description: "Kullanicinin avatarini gosterir.",
  usage: "avatar [uye]"
};
