exports.run = async (client, message) => {
  const sonuc = Math.floor(Math.random() * 6) + 1;

  return message.channel.send(`Zar sonucu: ${sonuc}`);
};

exports.conf = {
  aliases: ["dice"],
  permLevel: 0,
  kategori: "Eğlence"
};

exports.help = {
  name: "zar",
  description: "Rastgele zar atar.",
  usage: "zar"
};
