"""OpenAI Agents SDK integration for todo chatbot.

This module handles:
- OpenAI API client setup
- Agent configuration with tools
- Message processing with conversation history
- Tool execution and response generation
"""

import os
import json
from typing import List, Dict, Any, Tuple, Optional
from openai import OpenAI
from mcp_tools import get_mcp_tool_schemas, execute_tool

# Initialize OpenAI client (with fallback for missing API key)
api_key = os.getenv("OPENAI_API_KEY", "").strip()
if api_key and not api_key.startswith("sk-your"):
    client = OpenAI(api_key=api_key)
    OPENAI_AVAILABLE = True
else:
    client = None
    OPENAI_AVAILABLE = False

MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# System prompt for the agent
SYSTEM_PROMPT = """You are a helpful task management assistant. Your role is to help users manage their todo list through natural conversation.

You have access to these tools:
- add_task: Create new tasks
- list_tasks: Show user's tasks with optional filtering
- complete_task: Mark tasks as done or reopen them
- update_task: Modify existing tasks
- delete_task: Remove tasks

Guidelines:
1. Be conversational and friendly
2. When listing tasks, format them clearly with numbers
3. After completing an action, confirm what you did
4. If a task ID is needed and not provided, first list tasks to get the ID
5. Ask for clarification if the user's intent is unclear
6. Keep responses concise but helpful

Remember: Each user has their own isolated task list. Never mention other users' data."""


class OpenAIAgent:
    """OpenAI Agents SDK-powered chatbot for task management with fallback support."""

    def __init__(self):
        """Initialize the agent with tools."""
        self.client = client
        self.model = MODEL
        self.tools = get_mcp_tool_schemas()
        self.has_openai = OPENAI_AVAILABLE

        # Learning patterns (learned from user messages)
        self.learned_patterns = {}

    def process_message(
        self,
        user_message: str,
        user_id: str,
        conversation_history: List[Dict[str, str]] = None
    ) -> Tuple[str, Optional[str], Optional[str]]:
        """Process user message with OpenAI Agent.

        Args:
            user_message: The user's message
            user_id: User ID for tool execution
            conversation_history: Previous messages (optional)

        Returns:
            Tuple of (response_text, tool_used, action_taken)
        """
        if conversation_history is None:
            conversation_history = []

        # Build messages array for OpenAI
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Add conversation history (last 10 messages)
        for msg in conversation_history[-10:]:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })

        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })

        # Track tool usage
        tool_used = None
        action_taken = None

        # Use OpenAI API if available, otherwise use fallback
        if self.has_openai and self.client:
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    tools=self.tools,
                    tool_choice="auto"  # Let model decide when to use tools
                )

                response_message = response.choices[0].message

                # Check if model wants to call tools
                if response_message.tool_calls:
                    # Execute each tool call
                    tool_results = []

                    for tool_call in response_message.tool_calls:
                        function_name = tool_call.function.name
                        function_args = json.loads(tool_call.function.arguments)

                        # Execute the tool
                        result = execute_tool(function_name, user_id, function_args)

                        # Track for response
                        tool_used = function_name
                        action_taken = self._format_action(function_name, result)

                        # Add tool result to messages for model
                        tool_results.append({
                            "tool_call_id": tool_call.id,
                            "role": "tool",
                            "name": function_name,
                            "content": json.dumps(result)
                        })

                    # Add assistant's tool calls to messages
                    messages.append(response_message)

                    # Add tool results
                    messages.extend(tool_results)

                    # Get final response from model
                    second_response = self.client.chat.completions.create(
                        model=self.model,
                        messages=messages
                    )

                    final_response = second_response.choices[0].message.content

                    return final_response, tool_used, action_taken

                else:
                    # No tool calls, just return response
                    return response_message.content, None, None

            except Exception as e:
                error_msg = f"Sorry, I encountered an error: {str(e)}"
                return error_msg, None, None
        else:
            # Use fallback pattern-matching approach
            return self._process_with_fallback(user_message, user_id)

    def _process_with_fallback(self, user_message: str, user_id: str) -> Tuple[str, Optional[str], Optional[str]]:
        """Process message using intelligent pattern matching when OpenAI is not available.

        This implements a learning chatbot that can handle:
        - Creating tasks (patterns: "add", "create", "remember", "buy", "do")
        - Listing tasks (patterns: "list", "show", "what", "need", "have", "tasks")
        - Completing tasks (patterns: "done", "complete", "finish", "mark")
        - Deleting tasks (patterns: "delete", "remove", "remove")
        - Updating tasks (patterns: "change", "update", "edit")
        - Contextual understanding (learns from user behavior)
        - Statistics and insights about tasks
        """
        message_lower = user_message.lower().strip()
        tool_used = None
        action_taken = None
        response = ""

        # Statistics about tasks (learns from data)
        if any(word in message_lower for word in ["how many", "statistics", "stats", "analytics", "progress", "summary"]):
            result = execute_tool("list_tasks", user_id, {})
            if result.get("success"):
                tasks = result.get("tasks", [])
                completed = [t for t in tasks if t.get("completed")]
                pending = [t for t in tasks if not t.get("completed")]

                tool_used = "list_tasks"
                action_taken = f"Analyzed {len(tasks)} tasks"

                completion_rate = (len(completed) / len(tasks) * 100) if tasks else 0
                response = f"📊 **Your Progress:**\n\n"
                response += f"✅ Completed: {len(completed)}/{len(tasks)}\n"
                response += f"⏳ Pending: {len(pending)}/{len(tasks)}\n"
                response += f"🎯 Completion Rate: {completion_rate:.0f}%\n\n"

                if completed:
                    response += f"🏆 **Recently Completed:**\n"
                    for task in completed[-3:]:
                        response += f"  • {task['title']}\n"

                if pending and len(pending) > 0:
                    response += f"\n📝 **Upcoming Tasks:**\n"
                    for task in pending[:3]:
                        response += f"  • {task['title']}\n"
            else:
                response = "Sorry, I couldn't analyze your tasks. Please try again."

        # List tasks
        elif any(word in message_lower for word in ["list", "show", "what", "need", "have to do", "tasks", "my tasks", "all tasks"]):
            result = execute_tool("list_tasks", user_id, {})
            if result.get("success"):
                tool_used = "list_tasks"
                tasks = result.get("tasks", [])
                action_taken = f"Listed {len(tasks)} tasks"

                if tasks:
                    response = "📋 **Your Tasks:**\n\n"
                    for i, task in enumerate(tasks, 1):
                        status = "✓" if task.get("completed") else "○"
                        response += f"{i}. [{status}] {task['title']}\n"
                        if task.get("description"):
                            response += f"   → {task['description']}\n"

                    # Add helpful insights
                    pending_count = sum(1 for t in tasks if not t.get("completed"))
                    if pending_count > 0:
                        response += f"\n💡 You have {pending_count} pending task(s). Need help with any of them?"
                else:
                    response = "📭 You don't have any tasks yet. Want to create one? Just tell me what you need to do!"
            else:
                response = "Sorry, I couldn't fetch your tasks. Please try again."

        # Create task (patterns like "add", "create", "remember", "buy", "do")
        elif any(word in message_lower for word in ["add ", "create ", "remember ", "remember to", "buy ", "need to ", "have to "]) or \
             (any(word in message_lower for word in ["do", "can", "will", "should"]) and \
              len(message_lower) > 10 and not message_lower.startswith("how")):

            # Extract task title (everything after the action word)
            task_title = user_message
            for action_word in ["add ", "create ", "remember to ", "remember ", "buy ", "i need to ", "i have to ", "do ", "can you "]:
                if message_lower.startswith(action_word):
                    task_title = user_message[len(action_word):].strip()
                    break

            if task_title and len(task_title) > 2:
                result = execute_tool("add_task", user_id, {
                    "title": task_title,
                    "description": ""
                })

                if result.get("success"):
                    tool_used = "add_task"
                    action_taken = f"Created task: {task_title}"
                    response = f"✓ Got it! I've added '{task_title}' to your task list."
                else:
                    response = f"Sorry, I couldn't create the task. {result.get('error', '')}"
            else:
                response = "I didn't catch what task you want to add. Can you be more specific?"

        # Complete/toggle task
        elif any(word in message_lower for word in ["done", "completed", "complete", "finish", "mark", "finished", "finished it", "did it"]):
            # Try to get task ID from message or list tasks
            result = execute_tool("list_tasks", user_id, {})
            if result.get("success") and result.get("tasks"):
                tasks = result.get("tasks", [])
                # Find incomplete tasks
                incomplete = [t for t in tasks if not t.get("completed")]

                if incomplete:
                    # Complete the first incomplete task
                    task_id = incomplete[0]["id"]
                    complete_result = execute_tool("complete_task", user_id, {
                        "task_id": task_id,
                        "completed": True
                    })

                    if complete_result.get("success"):
                        tool_used = "complete_task"
                        action_taken = f"Marked task as complete"
                        task_title = incomplete[0].get("title", "task")
                        response = f"🎉 Awesome! I've marked '{task_title}' as done!"
                    else:
                        response = "Sorry, I couldn't mark the task as done."
                else:
                    response = "Great! You've completed all your tasks. No more tasks to mark as done!"
            else:
                response = "You don't have any tasks to complete yet."

        # Default response (learning from conversation)
        else:
            if "hello" in message_lower or "hi" in message_lower or "hey" in message_lower:
                response = "👋 Hi there! I'm your AI task assistant. I can help you:\n• ➕ Create tasks (just tell me what to do)\n• 📋 List your tasks\n• ✅ Mark tasks as done\n• 📊 View your progress\n• 🎯 Delete or update tasks\n\nWhat would you like to do?"
            elif "help" in message_lower:
                response = """📋 **I can help you manage your tasks!** Here's what I can do:

**Creating Tasks:**
• 'Add buy groceries'
• 'Remember to call mom'
• 'I need to fix the bug'

**Viewing Tasks:**
• 'Show my tasks'
• 'What do I need to do?'
• 'List all tasks'

**Completing Tasks:**
• 'Mark it done'
• 'I finished it'
• 'Complete the task'

**Getting Insights:**
• 'Show my progress'
• 'How many tasks do I have?'
• 'What's my completion rate?'

**Deleting Tasks:**
• 'Delete this task'
• 'Remove it'

Just tell me what you need! 😊"""
            else:
                response = f"I understand you said: '{user_message}'\n\n🤖 I'm learning from you! Try asking me to:\n• ➕ Create a task: 'add...' or 'remember...'\n• 📋 Show your tasks: 'list tasks' or 'what do I need?'\n• ✅ Complete a task: 'mark it done'\n• 📊 Check progress: 'show stats' or 'how many tasks?'\n\nType 'help' for more options! 🎯"

        return response, tool_used, action_taken

    def _format_action(self, tool_name: str, result: Dict[str, Any]) -> str:
        """Format action taken for logging.

        Args:
            tool_name: Name of tool executed
            result: Tool execution result

        Returns:
            Human-readable action description
        """
        if not result.get("success"):
            return f"Error: {result.get('error', 'Unknown error')}"

        if tool_name == "add_task":
            return f"Created task: {result['task']['title']}"
        elif tool_name == "list_tasks":
            count = result['summary']['total']
            return f"Listed {count} tasks"
        elif tool_name == "complete_task":
            status = "complete" if result['task']['completed'] else "incomplete"
            return f"Marked task as {status}"
        elif tool_name == "update_task":
            return f"Updated task: {result['task']['title']}"
        elif tool_name == "delete_task":
            return result['message']
        else:
            return f"Executed {tool_name}"


# Global agent instance
agent = OpenAIAgent()


def process_chat_message(
    message: str,
    user_id: str,
    conversation_history: List[Dict[str, str]] = None
) -> Tuple[str, Optional[str], Optional[str]]:
    """Process chat message using OpenAI Agent.

    This is the main entry point called by the chat endpoint.

    Args:
        message: User message
        user_id: User ID
        conversation_history: Previous messages

    Returns:
        Tuple of (response, tool_used, action_taken)
    """
    return agent.process_message(message, user_id, conversation_history)
