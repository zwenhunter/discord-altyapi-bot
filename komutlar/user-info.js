const { EmbedBuilder } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  let uye = message.member;

  if (args[0]) {
    uye = await ortak.uyeBul(message, args[0]);

    if (!uye) return ortak.hata(message, "Gecerli bir uye etiketle veya ID yaz.");
  }

  const kullanici = uye.user;

  const embed = new EmbedBuilder()
    .setTitle("Kullanici Bilgisi")
    .setColor(0x2b2d31)
    .setThumbnail(kullanici.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: "Kullanici", value: kullanici.username, inline: true },
      { name: "ID", value: kullanici.id, inline: true },
      { name: "Bot", value: kullanici.bot ? "Evet" : "Hayir", inline: true },
      { name: "Hesap Olusturma", value: `<t:${Math.floor(kullanici.createdTimestamp / 1000)}:F>`, inline: true },
      {
        name: "Sunucuya Katilma",
        value: uye.joinedTimestamp ? `<t:${Math.floor(uye.joinedTimestamp / 1000)}:F>` : "Bilinmiyor",
        inline: true
      },
      { name: "En Yuksek Rol", value: `${uye.roles.highest}`, inline: true }
    )
    .setTimestamp();

  const roller = uye.roles.cache
    .filter((rol) => rol.id !== message.guild.id)
    .map((rol) => rol.name)
    .join(", ");

  if (roller) {
    embed.addFields({ name: "Roller", value: roller.slice(0, 1024), inline: false });
  }

  return message.channel.send({ embeds: [embed] });
};

exports.conf = {
  aliases: ["kullanıcı-bilgi", "kullanici-bilgi", "kb"],
  permLevel: 0,
  kategori: "Genel"
};

exports.help = {
  name: "user-info",
  description: "Kullanici hakkinda bilgi verir.",
  usage: "user-info [uye]"
};
