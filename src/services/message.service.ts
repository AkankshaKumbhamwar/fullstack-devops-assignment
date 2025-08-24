import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

class MessageService {
  static async publishWelcomeMessage(userId: string) {
    const conn = await amqp.connect(RABBITMQ_URL);
    const channel = await conn.createChannel();
    const queue = 'welcome_queue';

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ userId, event: 'welcome' })));

    setTimeout(() => {
      conn.close();
    }, 500);
  }
}

export default MessageService;