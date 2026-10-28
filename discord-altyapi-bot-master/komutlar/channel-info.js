const { EmbedBuilder, ChannelType } = require("discord.js");
const ortak = require("../utils/ortak");

const turler = {
  [ChannelType.GuildText]: "Metin",
  [ChannelType.GuildVoice]: "Ses",
  [ChannelType.GuildCategory]: "Kategori",
  [ChannelType.GuildAnnouncement]: "Duyuru",
  [ChannelType.GuildStageVoice]: "Sahne",
  [ChannelType.GuildForum]: "Forum",
  [ChannelType.PublicThread]: "Genel Thread",
  [ChannelType.PrivateThread]: "Ozel Thread",
  [ChannelType.AnnouncementThread]: "Duyuru Thread"
};

exports.run = async (client, message, args) => {
  let kanal = message.mentions.channels.first() || message.channel;

  if (args[0] && !message.mentions.channels.first()) {
    const id = args[0].replace(/[<#>]/g, "");
    kanal = message.guild.channels.cache.get(id) || kanal;
  }

  const embed = new EmbedBuilder()
    .setTitle("Kanal Bilgisi")
    .setColor(0x2b2d31)
    .addFields(
      { name: "Kanal", value: kanal.name, inline: true },
      { name: "ID", value: kanal.id, inline: true },
      { name: "Tur", value: turler[kanal.type] || "Bilinmiyor", inline: true },
      { name: "Kategori", value: kanal.parent ? kanal.parent.name : "Yok", inline: true },
      {
        name: "Yavas Mod",
        value: kanal.isTextBased() ? `${kanal.rateLimitPerUser || 0} saniye` : "Uygulanmaz",
        inline: true
      },
      { name: "NSFW", value: kanal.nsfw ? "Evet" : "Hayir", inline: true },
      { name: "Olusturulma", value: `<t:${Math.floor(kanal.createdTimestamp / 1000)}:F>`, inline: false },
      { name: "Konu", value: kanal.topic ? kanal.topic.slice(0, 1024) : "Yok", inline: false }
    )
    .setTimestamp();

  return message.channel.send({ embeds: [embed] });
};

exports.conf = {
  aliases: ["kanal-bilgi", "kanalbilgi"],
  permLevel: 0,
  kategori: "Genel"
};

exports.help = {
  name: "channel-info",
  description: "Kanal hakkinda bilgi verir.",
  usage: "channel-info [kanal]"
};
