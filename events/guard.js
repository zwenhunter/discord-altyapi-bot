const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const client = require("../bot");
const ayarlar = require("../ayarlar.json");
const guard = require("../guard/ayarlar");

const eylemler = new Map([
  [AuditLogEvent.ChannelCreate, "Kanal olusturuldu"],
  [AuditLogEvent.ChannelDelete, "Kanal silindi"],
  [AuditLogEvent.RoleCreate, "Rol olusturuldu"],
  [AuditLogEvent.RoleDelete, "Rol silindi"],
  [AuditLogEvent.MemberBanAdd, "Uye yasaklandi"],
  [AuditLogEvent.MemberKick, "Uye atildi"],
  [AuditLogEvent.BotAdd, "Bot eklendi"],
  [AuditLogEvent.EmojiCreate, "Emoji olusturuldu"],
  [AuditLogEvent.EmojiDelete, "Emoji silindi"],
  [AuditLogEvent.WebhookCreate, "Webhook olusturuldu"],
  [AuditLogEvent.WebhookUpdate, "Webhook guncellendi"],
  [AuditLogEvent.WebhookDelete, "Webhook silindi"],
  [AuditLogEvent.GuildUpdate, "Sunucu guncellendi"]
]);

const islemler = new Map();
const sonCezalar = new Map();

function sahipMi(kullaniciId, guild) {
  const sahipler = [process.env.SAHIP, ayarlar.sahip]
    .filter(Boolean)
    .map((id) => id.trim());

  return kullaniciId === guild.ownerId || sahipler.includes(kullaniciId);
}

function islemSay(guildId, kullaniciId, sure) {
  const anahtar = `${guildId}:${kullaniciId}`;
  const simdi = Date.now();
  const kayitlar = (islemler.get(anahtar) || []).filter((zaman) => simdi - zaman <= sure);

  kayitlar.push(simdi);
  islemler.set(anahtar, kayitlar);

  return { anahtar, adet: kayitlar.length };
}

async function cezalandir(guild, kullanici, ayar) {
  const uye = await guild.members.fetch(kullanici.id).catch(() => null);

  if (!uye) return "Uye bulunamadi";
  if (uye.id === guild.ownerId) return "Sunucu sahibi korunuyor";

  try {
    if (ayar.ceza === "ban") {
      if (!uye.bannable) return "Ban yetkisi yetersiz";

      await uye.ban({ reason: "Guard: izinsiz islem" });
      return "Ban uygulandi";
    }

    if (ayar.ceza === "kick") {
      if (!uye.kickable) return "Atma yetkisi yetersiz";

      await uye.kick("Guard: izinsiz islem");
      return "Sunucudan atildi";
    }

    const bot = guild.members.me;

    if (!bot) return "Bot uyesi bulunamadi";
    if (uye.roles.highest.position >= bot.roles.highest.position) return "Rol yetkisi yetersiz";

    const roller = uye.roles.cache.filter((rol) => {
      return rol.id !== guild.id && !rol.managed && rol.position < bot.roles.highest.position;
    });

    if (!roller.size) return "Alinacak rol yok";

    await uye.roles.remove(roller, "Guard: izinsiz islem");
    return "Rolleri alindi";
  } catch (hata) {
    console.error("Guard ceza hatasi:", hata);
    return "Ceza uygulanamadi";
  }
}

async function logGonder(guild, ayar, veri) {
  if (!ayar.logKanal) return;

  const kanal =
    guild.channels.cache.get(ayar.logKanal) ||
    (await guild.channels.fetch(ayar.logKanal).catch(() => null));

  if (!kanal || !kanal.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setTitle("Guard Uyarisi")
    .setColor(veri.cezaSonucu ? 0xed4245 : 0xfee75c)
    .addFields(
      { name: "Eylem", value: veri.eylem, inline: true },
      { name: "Kullanici", value: `${veri.uygulayan.username || "Bilinmiyor"} (${veri.uygulayan.id})`, inline: true },
      { name: "Hedef ID", value: veri.hedefId || "Bilinmiyor", inline: true },
      { name: "Islem Sayisi", value: `${veri.adet}/${ayar.limit}`, inline: true },
      { name: "Ceza", value: veri.cezaSonucu || "Beklemede", inline: true }
    )
    .setTimestamp();

  await kanal.send({ embeds: [embed] }).catch(() => null);
}

client.on("guildAuditLogEntryCreate", async (kayit, guild) => {
  if (!kayit || !guild) return;

  const eylem = eylemler.get(kayit.action);
  if (!eylem) return;

  const ayar = guard.sunucuOku(guild.id);
  if (!ayar.acik) return;

  const uygulayan = kayit.executor;
  if (!uygulayan) return;
  if (uygulayan.id === client.user.id) return;
  if (sahipMi(uygulayan.id, guild)) return;
  if (ayar.beyazListe.includes(uygulayan.id)) return;

  if (kayit.action === AuditLogEvent.BotAdd && kayit.targetId) {
    const eklenen = await guild.members.fetch(kayit.targetId).catch(() => null);

    if (eklenen && eklenen.bannable) {
      await eklenen.ban({ reason: "Guard: izinsiz bot" }).catch(() => null);
    }
  }

  const sayim = islemSay(guild.id, uygulayan.id, ayar.sure);
  let cezaSonucu = null;

  if (sayim.adet >= ayar.limit) {
    const sonCeza = sonCezalar.get(sayim.anahtar) || 0;

    if (Date.now() - sonCeza > 30000) {
      sonCezalar.set(sayim.anahtar, Date.now());
      cezaSonucu = await cezalandir(guild, uygulayan, ayar);
      islemler.delete(sayim.anahtar);
    }
  }

  await logGonder(guild, ayar, {
    eylem,
    hedefId: kayit.targetId,
    uygulayan,
    adet: sayim.adet,
    cezaSonucu
  });
});

setInterval(() => {
  const simdi = Date.now();

  for (const [anahtar, kayitlar] of islemler) {
    const kalan = kayitlar.filter((zaman) => simdi - zaman <= 3600000);

    if (kalan.length) islemler.set(anahtar, kalan);
    else islemler.delete(anahtar);
  }

  for (const [anahtar, zaman] of sonCezalar) {
    if (simdi - zaman > 3600000) sonCezalar.delete(anahtar);
  }
}, 300000).unref();
