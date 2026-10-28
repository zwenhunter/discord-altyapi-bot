const fs = require("fs");
const path = require("path");
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
  const sahipler = [process.env.SAHIP, ayarlar.sahip]
    .filter(Boolean)
    .map((id) => id.trim());

  if (!sahipler.includes(message.author.id)) {
    return message.channel.send("Bu komutu sadece bot sahibi kullanabilir.");
  }

  if (!args[0]) {
    return message.channel.send("Yenilenecek komut adini yaz.");
  }

  const isim = args[0].toLowerCase().replace(/\.js$/, "");
  const dosya = path.join(__dirname, `${isim}.js`);

  if (!fs.existsSync(dosya)) {
    return message.channel.send(`Komut bulunamadi: ${isim}`);
  }

  try {
    for (const mevcut of client.commands.values()) {
      if (mevcut.help.name !== isim) continue;

      for (const alias of mevcut.conf.aliases || []) {
        client.aliases.delete(alias);
      }

      client.commands.delete(mevcut.help.name);
    }

    delete require.cache[require.resolve(dosya)];

    const komut = require(dosya);

    if (!komut.help || !komut.help.name || !komut.conf) {
      return message.channel.send("Komut dosyasinda help veya conf eksik.");
    }

    client.commands.set(komut.help.name, komut);

    for (const alias of komut.conf.aliases || []) {
      client.aliases.set(alias, komut.help.name);
    }

    return message.channel.send(`Komut yenilendi: ${komut.help.name}`);
  } catch (hata) {
    console.error(`Komut yenilenemedi (${isim}):`, hata);
    return message.channel.send(`Komut yenilenemedi: ${isim}`);
  }
};

exports.conf = {
  aliases: ["komutyenile", "yenile", "reload"],
  permLevel: 0,
  kategori: "Sahip"
};

exports.help = {
  name: "komutu-yenile",
  description: "Belirtilen komutu yeniden yukler.",
  usage: "komutu-yenile <komut>"
};
