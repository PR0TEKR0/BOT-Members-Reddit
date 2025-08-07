const express = require('express');
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// 🔸 Configura el servidor Express
const app = express();
app.get('/', (req, res) => res.send('Bot de Discord activo 🟢'));
app.listen(3000, () => {
  console.log('🌐 Servidor Express escuchando en el puerto 3000');
});

// 🔸 Bot de Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  updateVoiceChannelName();
  setInterval(updateVoiceChannelName, 60 * 1000); // Cada 60 segundos
});

async function updateVoiceChannelName() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || !channel.isVoiceBased()) {
      console.error('❌ El canal no es válido o no es de voz');
      return;
    }

    const memberCount = channel.members.size;
    const newName = `👽Reddit members👾 (${memberCount})`;

    await channel.setName(newName);
    console.log(`✅ Canal actualizado a: ${newName}`);
  } catch (err) {
    console.error('❌ Error al actualizar el canal:', err);
  }
}

// Manejo de eventos para errores y reconexión
client.on('error', error => {
  console.error('❌ Error del cliente Discord:', error);
});

client.on('warn', info => {
  console.warn('⚠️ Advertencia Discord:', info);
});

client.on('shardDisconnect', (event, shardId) => {
  console.warn(`⚠️ Shard ${shardId} desconectado. Intentando reconectar...`);
});

client.on('shardReconnecting', shardId => {
  console.log(`🔄 Shard ${shardId} intentando reconectar...`);
});

client.on('disconnect', event => {
  console.warn(`⚠️ Bot desconectado, código: ${event.code}. Reconectando...`);
  client.login(process.env.DISCORD_TOKEN).catch(console.error);
});

// Captura errores no manejados para evitar que el bot caiga
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Rechazo no manejado:', reason);
});

process.on('uncaughtException', error => {
  console.error('❌ Excepción no atrapada:', error);
});

client.login(process.env.DISCORD_TOKEN);