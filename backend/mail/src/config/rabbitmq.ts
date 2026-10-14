import amqp from 'amqplib';
   

let channel : amqp.Channel | null = null;

export const connectRabbitMQ = async()=>{
    try{
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST || 'localhost',
            port: parseInt(process.env.RABBITMQ_PORT   || '5672'),
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD 
        });
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
        return {connection, channel};
    }catch(error){
        console.error('Error connecting to RabbitMQ:', error);
        process.exit(1);
    }
}

  