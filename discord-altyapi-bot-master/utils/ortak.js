const { EmbedBuilder } = require("discord.js");
const ayarlar = require("../ayarlar.json");
const sunucu = require("../veriler/sunucu");

const renkler = {
  basari: 0x57f287,
  hata: 0xed4245,
  bilgi: 0x2b2d31
};

function embed(renk, baslik, aciklama) {
  return new EmbedBuilder()
    .setTitle(baslik)
    .setColor(renk)
    .setDescription(aciklama)
    .setTimestamp();
}

async function hata(message, aciklama) {
  return message.channel.send({ embeds: [embed(renkler.hata, "Hata", aciklama)] }).catch(() => null);
}

async function basari(message, aciklama) {
  return message.channel.send({ embeds: [embed(renkler.basari, "Basarili", aciklama)] }).catch(() => null);
}

async function bilgi(message, baslik, aciklama) {
  return message.channel.send({ embeds: [embed(renkler.bilgi, baslik, aciklama)] }).catch(() => null);
}

function sahipMi(message) {
  const sahipler = [process.env.SAHIP, ayarlar.sahip]
    .filter(Boolean)
    .map((id) => id.trim());

  return message.author.id === message.guild.ownerId || sahipler.includes(message.author.id);
}

function ustunMu(message, hedef) {
  if (message.author.id === message.guild.ownerId) return true;

  return message.member.roles.highest.position > hedef.roles.highest.position;
}

async function uyeBul(message, arguman) {
  if (!arguman) return null;

  const etiket = message.mentions.members.first();
  if (etiket) return etiket;

  const id = arguman.replace(/[<@!>]/g, "");
  if (!/^\d{17,20}$/.test(id)) return null;

  return message.guild.members.fetch(id).catch(() => null);
}

async function kullaniciBul(client, arguman) {
  if (!arguman) return null;

  const id = arguman.replace(/[<@!>]/g, "");
  if (!/^\d{17,20}$/.test(id)) return null;

  return client.users.fetch(id).catch(() => null);
}

function rolBul(message, arguman) {
  if (!arguman) return null;

  const etiket = message.mentions.roles.first();
  if (etiket) return etiket;

  const id = arguman.replace(/[<@&>]/g, "");
  const idIle = message.guild.roles.cache.get(id);
  if (idIle) return idIle;

  const isim = arguman.toLocaleLowerCase("tr");

  return message.guild.roles.cache.find((rol) => rol.name.toLocaleLowerCase("tr") === isim) || null;
}

function sureCoz(metin) {
  if (!metin) return null;

  const eslesme = /^(\d+)([a-zçğıöşü]*)$/.exec(metin.toLocaleLowerCase("tr"));
  if (!eslesme) return null;

  const sayi = parseInt(eslesme[1], 10);
  const birim = eslesme[2] || "dk";

  const carpanlar = {
    s: 1000,
    sn: 1000,
    saniye: 1000,
    m: 60000,
    dk: 60000,
    dakika: 60000,
    h: 3600000,
    sa: 3600000,
    saat: 3600000,
    d: 86400000,
    g: 86400000,
    gun: 86400000,
    w: 604800000,
    hafta: 604800000
  };

  const carpan = carpanlar[birim];
  if (!carpan) return null;

  return sayi * carpan;
}

function sureYaz(ms) {
  if (!ms || ms < 1000) return "0 saniye";

  const birimler = [
    ["gun", 86400000],
    ["saat", 3600000],
    ["dakika", 60000],
    ["saniye", 1000]
  ];

  const parcalar = [];
  let kalan = ms;

  for (const [ad, deger] of birimler) {
    const miktar = Math.floor(kalan / deger);

    if (!miktar) continue;

    parcalar.push(`${miktar} ${ad}`);
    kalan -= miktar * deger;
  }

  return parcalar.join(" ");
}

async function modLog(guild, logEmbed) {
  const ayar = sunucu.sunucuOku(guild.id);

  if (!ayar.modLog) return;

  const kanal =
    guild.channels.cache.get(ayar.modLog) ||
    (await guild.channels.fetch(ayar.modLog).catch(() => null));

  if (!kanal || !kanal.isTextBased()) return;

  await kanal.send({ embeds: [logEmbed] }).catch(() => null);
}

module.exports = {
  renkler,
  embed,
  hata,
  basari,
  bilgi,
  sahipMi,
  ustunMu,
  uyeBul,
  kullaniciBul,
  rolBul,
  sureCoz,
  sureYaz,
  modLog
};
