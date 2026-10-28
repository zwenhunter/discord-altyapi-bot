const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ortak = require("../utils/ortak");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
    return ortak.hata(message, "Bu komut icin Rolleri Yonet yetkisi gerekli.");
  }

  const hedef = await ortak.uyeBul(message, args[0]);

  if (!hedef) return ortak.hata(message, "Gecerli bir uye etiketle veya ID yaz.");

  const rol = ortak.rolBul(message, args.slice(1).join(" "));

  if (!rol) return ortak.hata(message, "Gecerli bir rol etiketle veya isim yaz.");
  if (rol.id === message.guild.id) return ortak.hata(message, "Everyone rolu alinamaz.");
  if (rol.managed) return ortak.hata(message, "Bot rollerini elle alamazsin.");
  if (!hedef.manageable) return ortak.hata(message, "Bot bu uyenin rollerini yonetemiyor.");

  if (message.author.id !== message.guild.ownerId && rol.position >= message.member.roles.highest.position) {
    return ortak.hata(message, "Bu rol senin en yuksek rolunun ustunde veya ayni seviyede.");
  }

  if (rol.position >= message.guild.members.me.roles.highest.position) {
    return ortak.hata(message, "Bu rol botun en yuksek rolunun ustunde veya ayni seviyede.");
  }

  if (!hedef.roles.cache.has(rol.id)) {
    return ortak.hata(message, "Bu uye zaten bu role sahip degil.");
  }

  try {
    await hedef.roles.remove(rol, `${message.author.username}: rol alindi`);

    const embed = new EmbedBuilder()
      .setTitle("Rol Alindi")
      .setColor(0xed4245)
      .addFields(
        { name: "Uye", value: `${hedef.user.username} (${hedef.id})`, inline: true },
        { name: "Rol", value: `${rol.name} (${rol.id})`, inline: true },
        { name: "Yetkili", value: `${message.author.username} (${message.author.id})`, inline: true }
      )
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    await ortak.modLog(message.guild, embed);
  } catch (hata) {
    console.error(hata);
    return ortak.hata(message, "Rol alinamadi.");
  }
};

exports.conf = {
  aliases: ["rol-al", "rolal"],
  permLevel: 0,
  kategori: "Moderasyon"
};

exports.help = {
  name: "role-remove",
  description: "Uyeden rol alir.",
  usage: "role-remove <uye> <rol>"
};
