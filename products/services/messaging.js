const amqp = require('amqplib');

let channel = null;

async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672');
    channel = await connection.createChannel();
    console.log('[Messaging] Connected to RabbitMQ');
    return channel;
  } catch (err) {
    console.error('[Messaging] Failed to connect to RabbitMQ:', err);
    throw err;
  }
}

async function publishMessage(queue, message) {
  if (!channel) throw new Error('Channel not initialized');
  const messageBuffer = Buffer.from(JSON.stringify(message));
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, messageBuffer, { persistent: true });
  console.log('[Messaging] Published message to', queue, ':', message);
}

async function subscribeToQueue(queue, callback) {
  if (!channel) throw new Error('Channel not initialized');
  await channel.assertQueue(queue, { durable: true });
  await channel.consume(queue, async (msg) => {
    if (msg) {
      try {
        const content = JSON.parse(msg.content.toString());
        console.log('[Messaging] Received message from', queue, ':', content);
        await callback(content);
        channel.ack(msg);
      } catch (err) {
        console.error('[Messaging] Error processing message:', err);
        channel.nack(msg, false, true);
      }
    }
  });
}

module.exports = {
  connectToRabbitMQ,
  publishMessage,
  subscribeToQueue,
  getChannel: () => channel
};
