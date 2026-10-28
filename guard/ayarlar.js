const fs = require("fs");
const path = require("path");

const dosya = path.join(__dirname, "..", "guard.json");

const varsayilan = {
  acik: false,
  logKanal: "",
  beyazListe: [],
  limit: 3,
  sure: 10000,
  ceza: "ban"
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

  return {
    ...varsayilan,
    ...kayit,
    beyazListe: Array.isArray(kayit.beyazListe) ? [...kayit.beyazListe] : []
  };
}

function sunucuKaydet(sunucuId, ayar) {
  const veri = dosyayiOku();

  veri.sunucular[sunucuId] = {
    ...varsayilan,
    ...ayar,
    beyazListe: Array.isArray(ayar.beyazListe) ? [...ayar.beyazListe] : []
  };

  fs.writeFileSync(dosya, JSON.stringify(veri, null, 2), "utf8");
}

module.exports = {
  varsayilan,
  sunucuOku,
  sunucuKaydet
};
