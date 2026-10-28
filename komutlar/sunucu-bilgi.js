const { EmbedBuilder, ChannelType } = require("discord.js");

exports.run = async (client, message) => {
  const guild = message.guild;

  const botSayisi = guild.members.cache.filter((uye) => uye.user && uye.user.bot).size;
  const insanSayisi = Math.max(guild.memberCount - botSayisi, 0);
  const rolSayisi = guild.roles.cache.filter((rol) => rol.id !== guild.id).size;
  const metinKanali = guild.channels.cache.filter((kanal) => kanal.type === ChannelType.GuildText).size;
  const sesKanali = guild.channels.cache.filter((kanal) => kanal.type === ChannelType.GuildVoice).size;
  const kategoriSayisi = guild.channels.cache.filter((kanal) => kanal.type === ChannelType.GuildCategory).size;

  const dogrulamaSeviyeleri = [
    "Yok",
    "Dusuk",
    "Orta",
    "Yuksek",
    "Cok yuksek"
  ];

  const dogrulama = dogrulamaSeviyeleri[guild.verificationLevel] || "Bilinmiyor";
  const sahip = await guild.fetchOwner().catch(() => null);

  const embed = new EmbedBuilder()
    .setTitle("Sunucu Bilgileri")
    .setColor("#2b2d31")
    .setThumbnail(guild.iconURL({ size: 256 }))
    .addFields(
      { name: "Sunucu Adi", value: guild.name, inline: true },
      { name: "Sunucu ID", value: guild.id, inline: true },
      { name: "Sunucu Sahibi", value: sahip ? sahip.user.username : "Bilinmiyor", inline: true },
      { name: "Kurulus Tarihi", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
      { name: "Dogrulama Seviyesi", value: dogrulama, inline: true },
      { name: "Boost", value: `${guild.premiumSubscriptionCount || 0} takviye (seviye ${guild.premiumTier})`, inline: true },
      { name: "Uyeler", value: `${insanSayisi} insan / ${botSayisi} bot`, inline: true },
      { name: "Roller", value: `${rolSayisi}`, inline: true },
      { name: "Kanallar", value: `${metinKanali} metin, ${sesKanali} ses, ${kategoriSayisi} kategori`, inline: true }
    )
    .setFooter({ text: `Komutu kullanan: ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

  return message.channel.send({ embeds: [embed] });
};

exports.conf = {
  aliases: ["sunucubilgi", "sb", "sunucu"],
  permLevel: 0,
  kategori: "Sunucu"
};

exports.help = {
  name: "sunucu-bilgi",
  description: "Sunucu hakkinda bilgi verir.",
  usage: "sunucu-bilgi"
};
