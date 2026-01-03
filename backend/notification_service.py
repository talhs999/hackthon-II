"""
Notification Service Microservice
Handles sending reminders and notifications to users
"""

import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for sending notifications"""

    def __init__(
        self,
        smtp_server: str = "smtp.gmail.com",
        smtp_port: int = 587,
        sender_email: Optional[str] = None,
        sender_password: Optional[str] = None
    ):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.sender_email = sender_email
        self.sender_password = sender_password

    async def send_reminder_email(
        self,
        recipient_email: str,
        task_title: str,
        due_at: datetime,
        task_id: int
    ) -> bool:
        """Send task reminder email"""
        try:
            subject = f"Task Reminder: {task_title}"
            body = f"""
            <html>
                <body>
                    <h2>Task Reminder</h2>
                    <p>Your task <strong>{task_title}</strong> is due on:</p>
                    <p><strong>{due_at.strftime('%Y-%m-%d %H:%M')}</strong></p>
                    <p>
                        <a href="https://todo-app.local/tasks/{task_id}">
                            View Task
                        </a>
                    </p>
                    <hr>
                    <p>From: Todo Chatbot App</p>
                </body>
            </html>
            """

            if self.sender_email and self.sender_password:
                # Send actual email
                await self._send_smtp_email(
                    recipient_email,
                    subject,
                    body
                )
            else:
                # Log notification for testing
                logger.info(f"📧 [NOTIFICATION] Email to {recipient_email}: {subject}")

            return True
        except Exception as e:
            logger.error(f"❌ Error sending reminder email: {e}")
            return False

    async def send_push_notification(
        self,
        user_id: str,
        task_title: str,
        notification_type: str = "reminder"
    ) -> bool:
        """Send push notification"""
        try:
            logger.info(f"🔔 [PUSH] {notification_type} for {user_id}: {task_title}")
            # Push notification implementation (Firebase, etc.)
            return True
        except Exception as e:
            logger.error(f"❌ Error sending push notification: {e}")
            return False

    async def send_in_app_notification(
        self,
        user_id: str,
        message: str,
        task_id: Optional[int] = None,
        notification_type: str = "info"
    ) -> bool:
        """Send in-app notification"""
        try:
            notification = {
                "user_id": user_id,
                "message": message,
                "task_id": task_id,
                "type": notification_type,
                "timestamp": datetime.utcnow().isoformat()
            }
            logger.info(f"💬 [IN-APP] {user_id}: {message}")
            # Store in database or cache
            return True
        except Exception as e:
            logger.error(f"❌ Error sending in-app notification: {e}")
            return False

    async def _send_smtp_email(
        self,
        recipient_email: str,
        subject: str,
        body: str
    ):
        """Send email via SMTP"""
        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.sender_email
            message["To"] = recipient_email

            part = MIMEText(body, "html")
            message.attach(part)

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.sendmail(
                    self.sender_email,
                    recipient_email,
                    message.as_string()
                )
            logger.info(f"✅ Email sent to {recipient_email}")
        except Exception as e:
            logger.error(f"❌ SMTP error: {e}")
            raise


# Global notification service
notification_service = NotificationService()
