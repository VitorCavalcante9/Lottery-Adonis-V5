/* eslint-disable prettier/prettier */
import { Kafka, Message, Producer as KafkaProducer } from 'kafkajs';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface IProduceProps {
  topic: string;
  messages: Message[];
}

export default class Producer {
  private producer: KafkaProducer;

  constructor() {
    const kafka = new Kafka({
      brokers: ['kafka:29092'],
    });

    this.producer = kafka.producer();
  }

  public async produce({ topic, messages }: IProduceProps) {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages,
    });
    await this.producer.disconnect();
  }
}
