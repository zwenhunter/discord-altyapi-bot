const { PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  let hedef = message.member;
  let baslangic = 0;

  const idMi = args[0] && /^\d{17,20}$/.test(args[0].replace(/[<@!>]/g, ""));

  if (args[0] && (message.mentions.members.first() || idMi)) {
    hedef = await ortak.uyeBul(message, args[0]);

    if (!hedef) return ortak.hata(message, "Gecerli bir uye etiketle veya ID yaz.");

    baslangic = 1;
  }

  if (hedef.id !== message.author.id && !message.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
    return ortak.hata(message, "Baskasinin takma adini degistirmek icin Takma Adlari Yonet yetkisi gerekli.");
  }

  if (!hedef.manageable) return ortak.hata(message, "Bot bu uyenin takma adini degistiremiyor.");

  const yeniIsim = args.slice(baslangic).join(" ").slice(0, 32) || null;

  try {
    await hedef.setNickname(yeniIsim, `${message.author.username}: takma ad degistirildi`);

    if (!yeniIsim) {
      return ortak.basari(message, "Takma ad sifirlandi.");
    }

    return ortak.basari(message, `Takma ad ${yeniIsim} olarak degistirildi.`);
  } catch (hata) {
    console.error(hata);
    return ortak.hata(message, "Takma ad degistirilemedi.");
  }
};

exports.conf = {
  aliases: ["isim", "takma-ad", "takmaad"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "nick",
  description: "Uyenin takma adini degistirir.",
  usage: "nick [uye] [yeni isim]"
};
