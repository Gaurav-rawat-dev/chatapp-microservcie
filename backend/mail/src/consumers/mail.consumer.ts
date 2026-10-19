import amqp from 'amqplib';
import type {ConsumeMessage } from 'amqplib';
import { connectRabbitMQ } from "../config/rabbitmq.js"
import {sendOtpEmail} from "../services/mail-service.js";






interface SendOtpEvent {
    email: string;
    otp: string;
}

const QUEUE = "sendotp";

export const startSendotpConsumer = async (): Promise<void> => {
    const { channel } = await connectRabbitMQ();

    await channel.assertQueue(QUEUE, {
        durable: true,
    });

    // Process one unacknowledged message at a time.
    channel.prefetch(1);
console.log(`Mail consumer connected to RabbitMQ and ready to consume from queue: ${QUEUE}`);
    await channel.consume(
        QUEUE,
        async (msg: ConsumeMessage | null) => {
            if (!msg) {
                return;
            }

            try {
                const data: SendOtpEvent = JSON.parse(
                    msg.content.toString("utf8")
                );

                if (
                    typeof data.email !== "string" ||
                    typeof data.otp !== "string" ||
                    !data.email.trim() ||
                    !data.otp.trim()
                ) {
                    throw new Error("Invalid OTP event payload");
                }

                console.log(`OTP email event received for ${data.email}`);

                // Call the separate mail service.
                await sendOtpEmail({
                    email: data.email,
                    otp: data.otp,
                });

                // Acknowledge only after email sending succeeds.
                channel.ack(msg);

                console.log(`OTP email processed for ${data.email}`);
            } catch (error) {
                console.error("OTP email processing failed:", error);

                // Do not endlessly requeue a failing message.
                // Configure a DLQ/retry policy before production use.
                channel.nack(msg, false, false);
            }
        },
        {
            noAck: false,
        }
    );

    console.log(`Mail consumer listening on queue: ${QUEUE}`);

};

