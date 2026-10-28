const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return ortak.hata(message, "Bu komut icin Mesajlari Yonet yetkisi gerekli.");
  }

  const sayi = parseInt(args[0], 10);

  if (Number.isNaN(sayi) || sayi < 1 || sayi > 100) {
    return ortak.hata(message, "Silinecek mesaj sayisi 1 ile 100 arasinda olmali.");
  }

  let hedef = null;

  if (args[1]) {
    hedef = await ortak.uyeBul(message, args[1]);

    if (!hedef) return ortak.hata(message, "Gecerli bir uye etiketle veya ID yaz.");
  }

  const mesajlar = await message.channel.messages.fetch({ limit: 100 }).catch(() => null);

  if (!mesajlar) return ortak.hata(message, "Mesajlar alinamadi.");

  const silinecek = mesajlar
    .filter((mesaj) => !mesaj.pinned && (!hedef || mesaj.author.id === hedef.id))
    .first(sayi);

  if (!silinecek.length) {
    return ortak.hata(message, "Silinecek uygun mesaj bulunamadi.");
  }

  const silindi = await message.channel.bulkDelete(silinecek, true).catch(() => null);

  if (!silindi) {
    return ortak.hata(message, "Mesajlar silinemedi. 14 gunden eski mesajlar silinemez.");
  }

  const embed = new EmbedBuilder()
    .setTitle("Mesajlar Silindi")
    .setColor(0x57f287)
    .setDescription(`${silindi.size} mesaj silindi.`)
    .setTimestamp();

  const bilgi = await message.channel.send({ embeds: [embed] });

  setTimeout(() => bilgi.delete().catch(() => null), 3000);
};

exports.conf = {
  aliases: ["sil", "temizle", "purge"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "clear",
  description: "Kanaldan toplu mesaj siler.",
  usage: "clear <sayi> [uye]"
};
