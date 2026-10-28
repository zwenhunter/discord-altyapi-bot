const fs = require("fs");
const path = require("path");

const dosya = path.join(__dirname, "sunucular.json");

const varsayilan = {
  modLog: "",
  uyarilar: {}
};

function dosyayiOku() {
  try {
    const veri = JSON.parse(fs.readFileSync(dosya, "utf8"));

    if (!veri.sunucular || typeof veri.sunucular !== "object") {
      veri.sunucular = {};
    }

    return veri;
  } catch {
    return { sunucular: {} };
  }
}

function sunucuOku(sunucuId) {
  const veri = dosyayiOku();
  const kayit = veri.sunucular[sunucuId] || {};
  const uyarilar =
    kayit.uyarilar && typeof kayit.uyarilar === "object" && !Array.isArray(kayit.uyarilar)
      ? JSON.parse(JSON.stringify(kayit.uyarilar))
      : {};

  return { ...varsayilan, ...kayit, uyarilar };
}

function sunucuKaydet(sunucuId, ayar) {
  const veri = dosyayiOku();
  const uyarilar =
    ayar.uyarilar && typeof ayar.uyarilar === "object" && !Array.isArray(ayar.uyarilar)
      ? ayar.uyarilar
      : {};

  veri.sunucular[sunucuId] = { ...varsayilan, ...ayar, uyarilar };
  fs.writeFileSync(dosya, JSON.stringify(veri, null, 2), "utf8");
}

function uyariEkle(sunucuId, kullaniciId, uyari) {
  const ayar = sunucuOku(sunucuId);
  const liste = Array.isArray(ayar.uyarilar[kullaniciId]) ? ayar.uyarilar[kullaniciId] : [];

  liste.push(uyari);
  ayar.uyarilar[kullaniciId] = liste;
  sunucuKaydet(sunucuId, ayar);

  return liste;
}

function uyariListele(sunucuId, kullaniciId) {
  const ayar = sunucuOku(sunucuId);

  return Array.isArray(ayar.uyarilar[kullaniciId]) ? ayar.uyarilar[kullaniciId] : [];
}

function uyariTemizle(sunucuId, kullaniciId) {
  const ayar = sunucuOku(sunucuId);
  const sayi = Array.isArray(ayar.uyarilar[kullaniciId]) ? ayar.uyarilar[kullaniciId].length : 0;

  delete ayar.uyarilar[kullaniciId];
  sunucuKaydet(sunucuId, ayar);

  return sayi;
}

module.exports = {
  varsayilan,
  sunucuOku,
  sunucuKaydet,
  uyariEkle,
  uyariListele,
  uyariTemizle
};
