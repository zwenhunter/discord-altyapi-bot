const { EmbedBuilder } = require("discord.js");
const ayarlar = require("../ayarlar.json");
const guard = require("../guard/ayarlar");

const kullanim = [
  "guard",
  "guard ac",
  "guard kapat",
  "guard log #kanal",
  "guard limit 3",
  "guard sure 30",
  "guard ceza ban",
  "guard beyazliste ekle @uye",
  "guard beyazliste cikar @uye",
  "guard beyazliste liste"
].join("\n");

function sahipMi(message) {
  const sahipler = [process.env.SAHIP, ayarlar.sahip]
    .filter(Boolean)
    .map((id) => id.trim());

  return message.author.id === message.guild.ownerId || sahipler.includes(message.author.id);
}

function hedefAl(message, arguman) {
  const etiket = message.mentions.users.first();

  if (etiket) return etiket.id;
  if (/^\d{17,20}$/.test(arguman || "")) return arguman;

  return null;
}

function durumEmbed(veri) {
  return new EmbedBuilder()
    .setTitle("Guard Durumu")
    .setColor(veri.acik ? 0x57f287 : 0xed4245)
    .addFields(
      { name: "Durum", value: veri.acik ? "Acik" : "Kapali", inline: true },
      { name: "Log Kanalı", value: veri.logKanal ? `<#${veri.logKanal}>` : "Ayarlanmadi", inline: true },
      { name: "Limit", value: `${veri.limit} islem`, inline: true },
      { name: "Sure", value: `${Math.round(veri.sure / 1000)} saniye`, inline: true },
      { name: "Ceza", value: veri.ceza, inline: true },
      { name: "Beyaz Liste", value: veri.beyazListe.length ? veri.beyazListe.join(", ") : "Bos", inline: false }
    )
    .setFooter({ text: "Guard sistemi" });
}

exports.run = async (client, message, args) => {
  if (!sahipMi(message)) {
    return message.channel.send("Bu komutu sadece bot veya sunucu sahibi kullanabilir.");
  }

  const veri = guard.sunucuOku(message.guild.id);
  const altKomut = (args[0] || "").toLowerCase();

  if (!altKomut) {
    return message.channel.send({ embeds: [durumEmbed(veri)] });
  }

  if (altKomut === "ac" || altKomut === "aç") {
    veri.acik = true;
    guard.sunucuKaydet(message.guild.id, veri);
    return message.channel.send("Guard sistemi acildi.");
  }

  if (altKomut === "kapat") {
    veri.acik = false;
    guard.sunucuKaydet(message.guild.id, veri);
    return message.channel.send("Guard sistemi kapatildi.");
  }

  if (altKomut === "log") {
    const kanal = message.mentions.channels.first();

    if (!kanal) {
      return message.channel.send("Guard log kanalini etiketle.");
    }

    veri.logKanal = kanal.id;
    guard.sunucuKaydet(message.guild.id, veri);
    return message.channel.send(`Guard log kanali ${kanal} olarak ayarlandi.`);
  }

  if (altKomut === "limit") {
    const limit = parseInt(args[1], 10);

    if (Number.isNaN(limit) || limit < 1 || limit > 50) {
      return message.channel.send("Limit 1 ile 50 arasinda bir sayi olmali.");
    }

    veri.limit = limit;
    guard.sunucuKaydet(message.guild.id, veri);
    return message.channel.send(`Guard limiti ${limit} olarak ayarlandi.`);
  }

  if (altKomut === "sure" || altKomut === "süre") {
    const sure = parseInt(args[1], 10);

    if (Number.isNaN(sure) || sure < 5 || sure > 3600) {
      return message.channel.send("Sure 5 ile 3600 saniye arasinda olmali.");
    }

    veri.sure = sure * 1000;
    guard.sunucuKaydet(message.guild.id, veri);
    return message.channel.send(`Guard suresi ${sure} saniye olarak ayarlandi.`);
  }

  if (altKomut === "ceza") {
    const ceza = (args[1] || "").toLowerCase();

    if (!["ban", "kick", "rol"].includes(ceza)) {
      return message.channel.send("Ceza tipi ban, kick veya rol olmali.");
    }

    veri.ceza = ceza;
    guard.sunucuKaydet(message.guild.id, veri);
    return message.channel.send(`Guard cezasi ${ceza} olarak ayarlandi.`);
  }

  if (altKomut === "beyazliste" || altKomut === "wl") {
    const islem = (args[1] || "").toLowerCase();

    if (islem === "liste") {
      const liste = veri.beyazListe.length
        ? veri.beyazListe.map((id) => `<@${id}>`).join("\n")
        : "Beyaz liste bos.";

      const embed = new EmbedBuilder()
        .setTitle("Guard Beyaz Liste")
        .setColor("#2b2d31")
        .setDescription(liste);

      return message.channel.send({ embeds: [embed] });
    }

    if (islem === "ekle" || islem === "cikar") {
      const hedef = hedefAl(message, args[2]);

      if (!hedef) {
        return message.channel.send("Bir kullanici etiketle veya ID yaz.");
      }

      if (islem === "ekle") {
        const kullanici = await client.users.fetch(hedef).catch(() => null);

        if (!kullanici) {
          return message.channel.send("Kullanici bulunamadi.");
        }

        if (veri.beyazListe.includes(hedef)) {
          return message.channel.send("Bu kullanici zaten beyaz listede.");
        }

        veri.beyazListe.push(hedef);
        guard.sunucuKaydet(message.guild.id, veri);
        return message.channel.send(`${kullanici.username} beyaz listeye eklendi.`);
      }

      if (!veri.beyazListe.includes(hedef)) {
        return message.channel.send("Bu kullanici beyaz listede degil.");
      }

      veri.beyazListe = veri.beyazListe.filter((id) => id !== hedef);
      guard.sunucuKaydet(message.guild.id, veri);
      return message.channel.send(`<@${hedef}> beyaz listeden cikarildi.`);
    }
  }

  return message.channel.send(`Gecersiz komut.\n\n${kullanim}`);
};

exports.conf = {
  aliases: ["kalkan", "koruma"],
  permLevel: 0,
  kategori: "Guard"
};

exports.help = {
  name: "guard",
  description: "Sunucu koruma sistemini yonetir.",
  usage: "guard"
};
