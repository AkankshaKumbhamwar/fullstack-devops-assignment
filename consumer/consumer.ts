import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

async function startConsumer() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  const queue = 'welcome_queue';

  await channel.assertQueue(queue, { durable: false });

  channel.consume(queue, msg => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      console.log(`Welcome Email Event for user ${content.userId}`);
      channel.ack(msg);
    }
  });

  console.log('Consumer waiting for messages...');
}

startConsumer().catch(console.error);