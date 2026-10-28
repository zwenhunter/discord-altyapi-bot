require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits, Partials } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message]
});

module.exports = client;

require("./events/message");
require("./events/ready");
require("./events/guard");

const app = express();
app.get("/", (istek, cevap) => cevap.status(200).send("Bot aktif"));

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Web sunucusu ${port} portunda calisiyor`));

const token = (process.env.TOKEN || "").trim();

if (!token) {
  console.error("TOKEN bulunamadi. .env dosyasindaki TOKEN alanini doldurun.");
  process.exit(1);
}

client.on("error", (hata) => console.error("Client hatasi:", hata));
client.on("warn", (uyari) => console.warn("Uyari:", uyari));
process.on("unhandledRejection", (hata) => console.error("Yakalanmayan hata:", hata));

client.login(token).catch((hata) => {
  console.error("Giris basarisiz:", hata.message);
  process.exit(1);
});
