# Neler Değişti, Neler Değişmedi

Bu dosya projenin GitHub üzerinde paylaşılması için hazırlanmıştır. Aşağıda yapılan değişiklikler, korunan bölümler ve yayın öncesi kontrol listesi bulunur.

## Özet

- Eski altyapıdaki token, intent, event ve komut yükleme hataları düzeltildi.
- Bot mesajlarındaki emojiler kaldırıldı.
- Hiçbir JavaScript dosyasında yorum satırı bırakılmadı.
- Sunucuya özel çalışan, varsayılan olarak kapalı bir guard sistemi eklendi.
- Moderasyon ve yardımcı komutlarla birlikte toplam komut sayısı 30'a çıkarıldı.
- Kullanılmayan ve riskli npm paketleri temizlendi.

## Değişen Dosyalar

| Dosya | Yapılan Değişiklik |
| --- | --- |
| `bot.js` | `dotenv` eklendi. Token artık `.env` üzerinden okunuyor. Gereksiz ayrıcalıklı `GuildPresences` intent'i kaldırıldı. Web sunucusu için `PORT` varsayılanı ve hata yakalama eklendi. |
| `events/message.js` | Prefix ve mention prefix desteği eklendi. Komut çözümleme ve hata yakalama güvenli hale getirildi. |
| `events/ready.js` | Her komut için ayrı ready dinleyicisi oluşturulması engellendi. Komutlar bir kez yükleniyor ve `clientReady` kullanılıyor. |
| `komutlar/yardım.js` | Emoji kaldırıldı. Kategoriler artık komut dosyalarından dinamik oluşuyor. |
| `komutlar/sunucu-bilgi.js` | Ölü bölge ve doğrulama kodu temizlendi. Güncel kanal, rol, üye ve doğrulama bilgileri eklendi. |
| `komutlar/komutu-yenile.js` | Hardcoded owner ID kaldırıldı. Dosya ve komut adı uyuşmazlığı düzeltildi. Alias güncelleme ve hata yönetimi eklendi. |
| `ayarlar.json` | Token kaldırıldı. Prefix `!`, sahip alanı boş ve durum metni güncel olacak şekilde düzenlendi. |
| `package.json` | Kullanılmayan paketler kaldırıldı. `dotenv` eklendi. Node sürümü `>=18` yapıldı. |
| `package-lock.json` | Güncel bağımlılıklara göre yeniden oluşturuldu. |
| `.gitignore` | `node_modules`, `.env` ve `npm-debug.log` dışarıda bırakıldı. |
| `.env` | Yerel yapılandırma dosyası oluşturuldu. GitHub'a yüklenmemeli. |

## Yeni Eklenen Dosyalar

### Guard Sistemi

| Dosya | Görevi |
| --- | --- |
| `events/guard.js` | Audit log olaylarını dinler ve ihlallerde ceza uygular. |
| `guard/ayarlar.js` | Sunucu bazlı guard ayarlarını okur ve yazar. |
| `guard.json` | Guard ayarlarının tutulduğu veri dosyası. |
| `komutlar/guard.js` | Guard açma, kapatma, log, limit, süre, ceza ve beyaz liste komutları. |

Guard varsayılan olarak kapalıdır. Kanal, rol, emoji, webhook, ban, kick, bot ekleme ve sunucu güncelleme olaylarını izler. Ban, kick veya rol alma cezası uygulayabilir.

### Ortak Yardımcılar ve Veri Katmanı

| Dosya | Görevi |
| --- | --- |
| `utils/ortak.js` | Embed, hata mesajı, üye/rol bulma, süre çözme ve mod-log yardımcıları. |
| `veriler/sunucu.js` | Sunucu ayarları ve uyarı verilerini okuma/yazma. |
| `veriler/sunucular.json` | Mod-log ve uyarı verilerinin tutulduğu dosya. |

### Yeni Komutlar

Toplam 27 yeni komut eklendi:

- Moderasyon: `ban`, `kick`, `mute`, `unmute`, `warn`, `warns`, `warn-clear`, `clear`, `slowmode`, `lock`, `unlock`, `role-add`, `role-remove`, `nick`, `ban-list`, `unban`, `duyuru`, `mod-log`
- Genel: `user-info`, `role-info`, `channel-info`, `ping`, `bot-info`, `avatar`
- Eğlence: `zar`, `yazitura`
- Guard: `guard`

Mevcut `yardım`, `sunucu-bilgi` ve `komutu-yenile` komutları korundu ve düzeltildi. Toplam komut sayısı 30'dur.

## Kaldırılanlar

- `ayarlar.json` içindeki bot tokenı kaldırıldı.
- `bot.js` içindeki gereksiz `GuildPresences` intent'i kaldırıldı.
- Tüm bot mesajlarındaki emojiler kaldırıldı.
- Kullanılmayan npm paketleri kaldırıldı: `fs`, `http`, `chalk`, `figlet`, `moment`, `ascii-table`, `@discordjs/builders`.
- Hardcoded bot sahibi ID'si kaldırıldı.
- `yardım` komutundaki sabit kategori ve emoji kullanımı kaldırıldı.

## Değişmeyenler

- `README.md` değişmedi. İçindeki token ve eski kurulum anlatımı güncel değildir; güncel kurulum için bu dosyayı kullanın.
- `LICENSE.md` değişmedi.
- `SECURITY.md` değişmedi.
- `başlat.bat` değişmedi. Dosya hâlâ `node bot.js` çalıştırıyor.
- Prefix ile çalışan komut yapısı korundu.
- `events` ve `komutlar` klasör düzeni korundu.
- JSON tabanlı ayar ve veri kullanımı korundu.
- Express web sunucusu korundu; port artık `.env` üzerinden değiştirilebilir.
- Mevcut komut isimleri korundu; komutların davranışları iyileştirildi.
- Slash komut altyapısı eklenmedi; bot prefix komutlarıyla çalışmaya devam ediyor.

## Kurulum

1. Bağımlılıkları kurun:

```powershell
npm install
```

2. Proje kökünde `.env` dosyası oluşturun:

```env
TOKEN=bot_tokeniniz
PORT=3000
SAHIP=discord_kullanici_idniz
```

3. Discord Developer Portal üzerinden botun `Message Content Intent` ayarını açın.

4. Botu şu izinlerle davet edin:

- View Audit Log
- Ban Members
- Kick Members
- Moderate Members
- Manage Roles
- Manage Channels
- Manage Messages
- Send Messages
- Embed Links
- Read Message History

5. Botu başlatın:

```powershell
npm start
```

`SAHIP` alanı boş bırakılırsa `komutu-yenile` komutu çalışmaz. Guard komutunu sunucu sahibi veya bot sahibi kullanabilir.

## Guard Kullanımı

```text
!guard
!guard ac
!guard kapat
!guard log #guard-log
!guard limit 5
!guard sure 30
!guard ceza ban
!guard ceza kick
!guard ceza rol
!guard beyazliste ekle @kullanici
!guard beyazliste cikar @kullanici
!guard beyazliste liste
```

Guard'ın kendi botunu yok saydığını, diğer güvenilir botları ise beyaz listeye eklemeniz gerektiğini unutmayın.

## GitHub'a Yüklemeden Önce

- `.env` dosyasını yüklemeyin.
- `node_modules` klasörünü yüklemeyin.
- `package-lock.json` dosyasını yükleyin.
- `guard.json` ve `veriler/sunucular.json` dosyalarını boş haliyle yükleyin.
- `ayarlar.json` içinde token olmadığını kontrol edin.
- Token daha önce GitHub'a yüklendiyse Discord Developer Portal'dan iptal edip yeni token oluşturun.
- README dosyası eski olduğu için kurulum bölümünü bu dosyadaki bilgilerle güncelleyebilirsiniz.

## Test Durumu

- 37 JavaScript dosyası `node --check` ile kontrol edildi.
- 30 komut ve 68 alias yüklendi; isim çakışması yok.
- Yardım, moderasyon ve guard komutları mock mesajlarla test edildi.
- Guard ayar yazma/okuma ve veri izolasyonu test edildi.
- Tüm dosyalarda yorum ve emoji taraması yapıldı; sonuç temiz.
- Geçersiz tokenla başlangıç testi beklendiği gibi hata verdi. Gerçek Discord bağlantısı için geçerli token gerekiyor.
