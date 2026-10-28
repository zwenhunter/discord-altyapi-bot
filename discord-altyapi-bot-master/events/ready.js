const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const client = require("../bot");
const ayarlar = require("../ayarlar.json");

client.commands = new Collection();
client.aliases = new Collection();

const klasor = path.join(__dirname, "..", "komutlar");
const dosyalar = fs.existsSync(klasor)
  ? fs.readdirSync(klasor).filter((dosya) => dosya.endsWith(".js"))
  : [];

for (const dosya of dosyalar) {
  try {
    const komut = require(path.join(klasor, dosya));

    if (!komut.help || !komut.help.name || !komut.conf) {
      console.warn(`Eksik komut dosyasi: ${dosya}`);
      continue;
    }

    client.commands.set(komut.help.name, komut);

    for (const alias of komut.conf.aliases || []) {
      client.aliases.set(alias, komut.help.name);
    }
  } catch (hata) {
    console.error(`Komut yuklenemedi (${dosya}):`, hata);
  }
}

client.once("clientReady", () => {
  client.user.setPresence({
    activities: [{ name: ayarlar.durum || "sunucuyu koruyorum" }],
    status: "online"
  });

  console.log("_________________________________________");
  console.log(`Kullanici Ismi     : ${client.user.username}`);
  console.log(`Sunucular          : ${client.guilds.cache.size}`);
  console.log(`Kullanicilar       : ${client.users.cache.size}`);
  console.log(`Prefix             : ${ayarlar.prefix}`);
  console.log(`Toplam Komut       : ${client.commands.size}`);
  console.log("Durum              : Bot cevrimici");
  console.log("_________________________________________");
});
