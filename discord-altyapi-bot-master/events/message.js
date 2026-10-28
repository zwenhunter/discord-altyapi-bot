const ayarlar = require("../ayarlar.json");
const client = require("../bot");

const prefix = ayarlar.prefix;

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (!message.content) return;
  if (!client.commands || !client.aliases) return;

  const etiket = `<@${client.user.id}>`;
  const etiketNick = `<@!${client.user.id}>`;

  let kirpilan;

  if (prefix && message.content.startsWith(prefix)) {
    kirpilan = prefix;
  } else if (message.content.startsWith(etiket)) {
    kirpilan = etiket;
  } else if (message.content.startsWith(etiketNick)) {
    kirpilan = etiketNick;
  } else {
    return;
  }

  const parcalar = message.content.slice(kirpilan.length).trim().split(/\s+/);
  const komutAdi = (parcalar.shift() || "").toLowerCase();

  if (!komutAdi) return;

  const komut = client.commands.get(komutAdi) || client.commands.get(client.aliases.get(komutAdi));

  if (!komut) return;

  try {
    await komut.run(client, message, parcalar);
  } catch (hata) {
    console.error(`Komut hatasi (${komutAdi}):`, hata);
    message.channel.send("Komut calistirilirken bir hata olustu.").catch(() => null);
  }
});
