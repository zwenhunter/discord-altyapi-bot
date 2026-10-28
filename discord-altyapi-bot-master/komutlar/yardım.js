const { EmbedBuilder } = require("discord.js");
const ayarlar = require("../ayarlar.json");

const kategoriAliaslari = {
  genel: "Genel",
  general: "Genel",
  eglence: "Eğlence",
  "eğlence": "Eğlence",
  fun: "Eğlence",
  moderasyon: "Moderasyon",
  moderation: "Moderasyon",
  sunucu: "Sunucu",
  server: "Sunucu",
  sahip: "Sahip",
  owner: "Sahip",
  guard: "Guard",
  koruma: "Guard",
  kalkan: "Guard"
};

exports.run = async (client, message, args) => {
  const prefix = ayarlar.prefix;

  const kategoriler = [...new Set(
    client.commands
      .map((komut) => komut.conf.kategori)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, "tr"));

  if (args[0]) {
    const istenen = kategoriAliaslari[args[0].toLowerCase()] || args[0];

    if (kategoriler.some((kategori) => kategori.toLowerCase() === istenen.toLowerCase())) {
      const komutlar = client.commands.filter((komut) => komut.conf.kategori === istenen);
      const liste = komutlar
        .map((komut) => `- ${prefix}${komut.help.name}: ${komut.help.description}`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setTitle(`${istenen} Komutlari`)
        .setColor("#2b2d31")
        .setDescription(liste || "Bu kategoride komut bulunmuyor.")
        .setFooter({ text: `Komutu kullanan: ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

      return message.channel.send({ embeds: [embed] });
    }
  }

  const embed = new EmbedBuilder()
    .setTitle("Yardim Menusu")
    .setColor("#2b2d31")
    .setDescription(`Kategori komutlari icin: ${prefix}yardim <kategori>`)
    .addFields(
      kategoriler.map((kategori) => ({
        name: kategori,
        value: `${client.commands.filter((komut) => komut.conf.kategori === kategori).size} komut`,
        inline: true
      }))
    )
    .setFooter({ text: `Komutu kullanan: ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

  return message.channel.send({ embeds: [embed] });
};

exports.conf = {
  aliases: ["help", "cmds", "komutlar", "y"],
  permLevel: 0,
  kategori: "Genel"
};

exports.help = {
  name: "yardım",
  description: "Komutlar hakkinda bilgi verir.",
  usage: "yardım <kategori>"
};
