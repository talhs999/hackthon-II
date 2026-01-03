"""Simple AI agent for processing chat messages and invoking tools.

For now, this is a rule-based agent that maps intents to tools.
Can be extended to use OpenAI Agents SDK later.
"""

import re
from typing import Any, Dict, Optional, Tuple
from mcp_tools import get_tool_function


class SimpleAgent:
    """Rule-based AI agent for task management."""

    def __init__(self):
        """Initialize the agent."""
        self.intent_patterns = {
            "add": [
                r"(?:remember|remind|add|create|new|save|note|make)",
                r"(?:task|todo|remember)",
            ],
            "list": [
                r"(?:show|list|what|get|give me|my)",
                r"(?:tasks|todos|do|need)",
            ],
            "complete": [
                r"(?:done|complete|finish|mark|check|tick)",
                r"(?:task|todo)",
            ],
            "update": [
                r"(?:change|update|edit|modify|rename)",
                r"(?:to|as|into)",
            ],
            "delete": [
                r"(?:delete|remove|cancel|forget)",
                r"(?:task|todo)",
            ],
        }

    def detect_intent(self, message: str) -> Tuple[str, str]:
        """Detect user intent from message.

        Args:
            message: User message

        Returns:
            Tuple of (intent, tool_name)
        """
        message_lower = message.lower()

        # Check each intent pattern
        for intent, patterns in self.intent_patterns.items():
            if all(re.search(p, message_lower) for p in patterns):
                return intent, self._intent_to_tool(intent)

        return "unknown", None

    def _intent_to_tool(self, intent: str) -> str:
        """Map intent to MCP tool name.

        Args:
            intent: Intent name

        Returns:
            Tool name
        """
        mapping = {
            "add": "add_task",
            "list": "list_tasks",
            "complete": "complete_task",
            "update": "update_task",
            "delete": "delete_task",
        }
        return mapping.get(intent)

    def extract_task_info(self, message: str) -> Dict[str, Any]:
        """Extract task information from message.

        Args:
            message: User message

        Returns:
            Dict with extracted info (title, description, etc.)
        """
        # Simple extraction - can be enhanced
        info = {"raw_message": message}

        # Try to extract title (everything after action words)
        for action in ["remember", "add", "create", "save"]:
            if action in message.lower():
                parts = re.split(action, message, flags=re.IGNORECASE)
                if len(parts) > 1:
                    info["title"] = parts[1].strip()
                    break

        return info

    def process_message(
        self, message: str, user_id: str
    ) -> Tuple[str, Optional[str], Optional[str]]:
        """Process user message and invoke appropriate tool.

        Args:
            message: User message
            user_id: User ID

        Returns:
            Tuple of (response, tool_used, action_taken)
        """
        # Detect intent
        intent, tool_name = self.detect_intent(message)

        if not tool_name:
            return (
                "I can help you manage your tasks! You can ask me to:\n"
                "• Add a task: 'Remember to buy milk'\n"
                "• List tasks: 'What do I need to do?'\n"
                "• Complete: 'Done with groceries'\n"
                "• Update: 'Change groceries to vegetables'\n"
                "• Delete: 'Remove that task'",
                None,
                None,
            )

        # Get tool function
        tool_func = get_tool_function(tool_name)
        if not tool_func:
            return f"Tool {tool_name} not available", None, None

        # Invoke tool based on type
        try:
            if tool_name == "add_task":
                # Extract title and description
                title = None
                description = None

                # Simple extraction
                words = message.split()
                for i, word in enumerate(words):
                    if word.lower() in ["remember", "add", "create", "save"]:
                        title = " ".join(words[i + 1 :])
                        break

                if not title:
                    title = message

                result = tool_func(user_id, title[:200], description)

                if result["success"]:
                    return (
                        f"✅ Created task: '{result['task']['title']}'",
                        tool_name,
                        f"Created task: {result['task']['title']}",
                    )
                else:
                    return f"❌ Error: {result['error']}", tool_name, None

            elif tool_name == "list_tasks":
                result = tool_func(user_id, "all")

                if result["success"]:
                    tasks = result["tasks"]
                    if not tasks:
                        return "You have no tasks yet!", tool_name, "Listed tasks"
                    else:
                        summary = result["summary"]
                        task_list = "\n".join(
                            [f"{i + 1}. {t['title']}" for i, t in enumerate(tasks)]
                        )
                        return (
                            f"You have {summary['total']} tasks:\n{task_list}",
                            tool_name,
                            f"Listed {summary['total']} tasks",
                        )
                else:
                    return f"Error: {result['error']}", tool_name, None

            elif tool_name == "complete_task":
                # Try to extract task reference
                # For now, complete the first pending task
                list_result = get_tool_function("list_tasks")(user_id, "pending")

                if (
                    list_result["success"]
                    and list_result["tasks"]
                ):
                    task = list_result["tasks"][0]
                    result = tool_func(user_id, task["id"], True)

                    if result["success"]:
                        return (
                            f"✅ Marked '{result['task']['title']}' as complete!",
                            tool_name,
                            f"Completed: {result['task']['title']}",
                        )
                    else:
                        return f"Error: {result['error']}", tool_name, None
                else:
                    return "No pending tasks to complete!", tool_name, None

            elif tool_name == "update_task":
                # Extract task reference and new info
                # For now, update the first task
                list_result = get_tool_function("list_tasks")(user_id, "all")

                if list_result["success"] and list_result["tasks"]:
                    task = list_result["tasks"][0]
                    # Extract new title from message
                    new_title = None
                    if "to" in message.lower():
                        parts = message.lower().split("to", 1)
                        if len(parts) > 1:
                            new_title = parts[1].strip()[:200]

                    if new_title:
                        result = tool_func(user_id, task["id"], new_title)

                        if result["success"]:
                            return (
                                f"✅ Updated task to '{result['task']['title']}'",
                                tool_name,
                                f"Updated: {result['task']['title']}",
                            )
                        else:
                            return f"Error: {result['error']}", tool_name, None
                    else:
                        return "I need a new title. What should the task be?", tool_name, None
                else:
                    return "No tasks to update!", tool_name, None

            elif tool_name == "delete_task":
                # Get tasks and delete first one
                list_result = get_tool_function("list_tasks")(user_id, "all")

                if list_result["success"] and list_result["tasks"]:
                    task = list_result["tasks"][0]
                    result = tool_func(user_id, task["id"])

                    if result["success"]:
                        return (
                            f"✅ {result['message']}",
                            tool_name,
                            result["message"],
                        )
                    else:
                        return f"Error: {result['error']}", tool_name, None
                else:
                    return "No tasks to delete!", tool_name, None

        except Exception as e:
            return f"Error: {str(e)}", tool_name, None

        return "Unexpected error", None, None


# Create global agent instance
agent = SimpleAgent()


def process_chat_message(
    message: str, user_id: str
) -> Tuple[str, Optional[str], Optional[str]]:
    """Process a chat message using the agent.

    Args:
        message: User message
        user_id: User ID

    Returns:
        Tuple of (response, tool_used, action_taken)
    """
    return agent.process_message(message, user_id)
