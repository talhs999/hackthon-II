"""
Kafka Event Service for Todo Application
Handles event publishing and consumption for task operations
"""

import json
import asyncio
from typing import Callable, Optional
from datetime import datetime
from kafka import KafkaProducer, KafkaConsumer
from kafka.errors import KafkaError
import logging

logger = logging.getLogger(__name__)


class KafkaService:
    """Service for publishing and consuming Kafka events"""

    def __init__(
        self,
        bootstrap_servers: str = "localhost:9092",
        group_id: str = "todo-service"
    ):
        self.bootstrap_servers = bootstrap_servers.split(",")
        self.group_id = group_id
        self.producer = None
        self.consumers = {}

    def connect_producer(self):
        """Initialize Kafka producer"""
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=self.bootstrap_servers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                acks='all',
                retries=3
            )
            logger.info("✅ Kafka Producer connected")
        except Exception as e:
            logger.error(f"❌ Failed to connect Kafka Producer: {e}")
            raise

    def disconnect_producer(self):
        """Close Kafka producer"""
        if self.producer:
            self.producer.flush()
            self.producer.close()
            logger.info("Kafka Producer disconnected")

    def publish_event(
        self,
        topic: str,
        event_data: dict,
        key: Optional[str] = None
    ) -> bool:
        """
        Publish event to Kafka topic
        
        Args:
            topic: Kafka topic name
            event_data: Event data dictionary
            key: Optional partition key
            
        Returns:
            bool: True if published successfully
        """
        if not self.producer:
            self.connect_producer()

        try:
            future = self.producer.send(
                topic,
                value=event_data,
                key=key.encode('utf-8') if key else None
            )
            # Wait for confirmation (timeout 10 seconds)
            record_metadata = future.get(timeout=10)
            logger.info(f"✅ Event published to {topic} (partition: {record_metadata.partition})")
            return True
        except KafkaError as e:
            logger.error(f"❌ Error publishing to Kafka: {e}")
            return False

    async def publish_task_event(
        self,
        event_type: str,
        task_id: int,
        user_id: str,
        task_data: Optional[dict] = None
    ):
        """Publish task event to Kafka"""
        event = {
            "event_type": event_type,
            "task_id": task_id,
            "user_id": user_id,
            "task_data": task_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        return self.publish_event("task-events", event, key=str(task_id))

    async def publish_reminder_event(
        self,
        task_id: int,
        task_title: str,
        user_id: str,
        remind_at: datetime
    ):
        """Publish reminder event to Kafka"""
        event = {
            "task_id": task_id,
            "task_title": task_title,
            "user_id": user_id,
            "remind_at": remind_at.isoformat(),
            "timestamp": datetime.utcnow().isoformat()
        }
        return self.publish_event("reminders", event, key=str(task_id))

    def subscribe_to_topic(
        self,
        topic: str,
        callback: Callable,
        group_id: Optional[str] = None
    ):
        """Subscribe to Kafka topic"""
        consumer_group = group_id or self.group_id
        
        try:
            consumer = KafkaConsumer(
                topic,
                bootstrap_servers=self.bootstrap_servers,
                group_id=consumer_group,
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='earliest',
                enable_auto_commit=True
            )
            self.consumers[topic] = consumer
            logger.info(f"✅ Subscribed to topic: {topic}")
            return consumer
        except Exception as e:
            logger.error(f"❌ Error subscribing to topic {topic}: {e}")
            raise

    def consume_messages(self, topic: str, callback: Callable):
        """Consume messages from topic"""
        consumer = self.consumers.get(topic)
        if not consumer:
            consumer = self.subscribe_to_topic(topic, callback)

        try:
            for message in consumer:
                try:
                    callback(message.value)
                except Exception as e:
                    logger.error(f"❌ Error processing message: {e}")
        except Exception as e:
            logger.error(f"❌ Error consuming messages: {e}")

    def disconnect_consumer(self, topic: str):
        """Close Kafka consumer for topic"""
        if topic in self.consumers:
            self.consumers[topic].close()
            del self.consumers[topic]
            logger.info(f"Disconnected from topic: {topic}")


# Global Kafka service instance
kafka_service = KafkaService()


# Event handlers
async def handle_task_event(event: dict):
    """Handle task event from Kafka"""
    logger.info(f"Processing task event: {event['event_type']}")
    # Event processing logic will be implemented


async def handle_reminder_event(event: dict):
    """Handle reminder event from Kafka"""
    logger.info(f"Processing reminder event for task {event.get('task_id')}")
    # Reminder processing logic will be implemented
