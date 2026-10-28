exports.run = async (client, message) => {
  const sonuc = Math.random() < 0.5 ? "Yazi" : "Tura";

  return message.channel.send(`Para sonucu: ${sonuc}`);
};

exports.conf = {
  aliases: ["yazı-tura", "yazi-tura", "coinflip"],
  permLevel: 0,
  kategori: "Eğlence"
};

exports.help = {
  name: "yazitura",
  description: "Yazi tura atar.",
  usage: "yazitura"
};
