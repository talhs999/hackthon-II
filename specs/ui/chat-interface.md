# UI Design: Vault-Style AI Chat Interface

## Vision
Premium, animated conversational interface that feels like an AI vault opening. Smooth transitions, intelligent animations, and premium micro-interactions deliver a VIP user experience.

## Design Philosophy
- **Opening Experience**: Vault-like reveal animation on first load
- **Premium Feel**: Subtle glows, smooth curves, careful spacing
- **Clarity**: Message hierarchy, clear intent communication
- **Responsiveness**: Instant feedback, smooth animations
- **Accessibility**: Clear contrast, readable typography

## Color Palette

### Dark Mode (Primary)
- **Background**: `#0a0e27` (deep blue-black)
- **Surface**: `#1a1f3a` (darker blue)
- **Primary**: `#7c3aed` (vibrant purple)
- **Secondary**: `#2dd4bf` (cyan accent)
- **Success**: `#10b981` (emerald)
- **Text Primary**: `#f1f5f9` (white-ish)
- **Text Secondary**: `#94a3b8` (gray)
- **Border**: `#334155` (dark gray)

### Gradients
- **Glow**: `linear-gradient(135deg, #7c3aed, #2dd4bf)`
- **AI Badge**: `linear-gradient(135deg, #2dd4bf, #7c3aed)`

## Layout Structure

```
┌─────────────────────────────────────────┐
│        Header (User Profile)            │
├─────────────────────────────────────────┤
│                                         │
│      Chat Messages Area                 │
│      (Scrollable, auto-scroll)          │
│                                         │
├─────────────────────────────────────────┤
│   Input Field + Send Button             │
└─────────────────────────────────────────┘
```

## 1. Opening Animation (Vault Reveal)

### Trigger
- Page load
- Navigation to chat
- Conversation opened

### Animation Sequence

#### Phase 1: Blur & Dim (0-300ms)
```css
.vault-overlay {
  backdrop-filter: blur(0px) → blur(8px);
  background: rgba(0, 0, 0, 0) → rgba(0, 0, 0, 0.4);
  transition: 300ms ease-out;
}
```

#### Phase 2: Orb Expansion (300-600ms)
```css
.vault-orb {
  width: 60px → 600px;
  height: 60px → 600px;
  opacity: 1;
  border: 2px solid #7c3aed;
  box-shadow: 0 0 20px #7c3aed;
  border-radius: 50%;
  transition: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

#### Phase 3: Content Fade In (500-800ms)
```css
.chat-container {
  opacity: 0 → 1;
  transform: scale(0.95) → scale(1);
  transition: 300ms ease-in-out;
}
```

### Code (Framer Motion)
```typescript
const vaultAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const orbAnimation = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};
```

## 2. Header Component

### Layout
```
┌──────────────────────────────────────────┐
│  [User Avatar] User Name  [Menu]  [Exit] │
│  📍 Chat • AI Status: Ready              │
└──────────────────────────────────────────┘
```

### Elements
- **Left**: User avatar (8px border)
- **Center**: User name + AI status
- **Right**: Menu icon, Exit button

### Styling
```css
.header {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(45, 212, 191, 0.1));
  border-bottom: 1px solid #334155;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.ai-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s ease-in-out infinite;
}
```

## 3. Chat Messages Area

### Message Types

#### User Message
```
┌──────────────────────────────┐
│      Remember to buy milk   │
│         [12:30 PM]           │
└──────────────────────────────┘
```

**Styling:**
```css
.message-user {
  align-self: flex-end;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #f1f5f9;
  border-radius: 20px 20px 4px 20px;
  padding: 12px 16px;
  max-width: 80%;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}
```

**Animation:**
```
Slide from right: transform: translateX(50px) → translateX(0)
Duration: 300ms
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
```

#### Assistant Message
```
┌──────────────────────────────┐
│ ✅ Got it! I've created a    │
│    task: "buy milk"          │
│      [12:31 PM]              │
└──────────────────────────────┘
```

**Styling:**
```css
.message-assistant {
  align-self: flex-start;
  background: #1a1f3a;
  border: 1px solid #334155;
  color: #f1f5f9;
  border-radius: 20px 20px 20px 4px;
  padding: 12px 16px;
  max-width: 80%;
  box-shadow: 0 4px 12px rgba(45, 212, 191, 0.1);
}

.message-assistant::before {
  content: '🤖';
  margin-right: 8px;
}
```

**Animation:**
```
Typing effect: Show dots animation
Slide from left: transform: translateX(-50px) → translateX(0)
Duration: 300ms
Easing: ease-out
```

#### Tool Execution Indicator
```
┌─────────────────────────────────────────┐
│ 🔧 Processing... (add_task)             │
│    ✨ Updating your tasks...            │
│    ✅ Created task: 'buy milk'          │
└─────────────────────────────────────────┘
```

**Styling:**
```css
.tool-execution {
  background: rgba(16, 185, 129, 0.1);
  border-left: 3px solid #10b981;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  color: #10b981;
}

.tool-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #10b981;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

### Scroll Behavior
- **Auto-scroll**: New messages auto-scroll to bottom
- **Smooth**: Scroll animation duration 300ms
- **Manual override**: User can scroll up to history
- **Jump to bottom**: Button to jump to latest when scrolled up

```javascript
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

## 4. Input Area

### Layout
```
┌─────────────────────────────────────────────┐
│  [emoji]  Type your message...    [send] ↗️ │
└─────────────────────────────────────────────┘
```

### Input Field
```css
.input-field {
  background: #1a1f3a;
  border: 1px solid #334155;
  border-radius: 20px;
  padding: 12px 16px;
  color: #f1f5f9;
  font-size: 14px;
  resize: none;
  min-height: 48px;
  max-height: 120px;
  transition: all 300ms ease;
}

.input-field:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.input-field::placeholder {
  color: #64748b;
}
```

### Send Button
```css
.send-button {
  background: linear-gradient(135deg, #7c3aed, #2dd4bf);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 200ms ease;
}

.send-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
}

.send-button:active {
  transform: scale(0.95);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Placeholder Text
- "What would you like to do?"
- "Ask me about your tasks..."
- "Describe a new task..."

## 5. Micro-Interactions

### Input Focus Pulse
```css
@keyframes inputFocus {
  0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }
  100% { box-shadow: 0 0 0 8px rgba(124, 58, 237, 0); }
}

.input-field:focus {
  animation: inputFocus 0.6s ease-out;
}
```

### Typing Indicator
```css
@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
}

.typing-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2dd4bf;
  margin: 0 4px;
  animation: typing 1.4s ease-in-out infinite;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
```

### Send Button Glow
```css
@keyframes buttonGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(124, 58, 237, 0.5); }
  50% { box-shadow: 0 0 16px rgba(124, 58, 237, 0.8); }
}

.send-button:hover {
  animation: buttonGlow 2s ease-in-out infinite;
}
```

### Success Checkmark
```typescript
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.3, ease: "backOut" }}
>
  ✅
</motion.div>
```

## 6. Mobile Responsive Design

### Breakpoints
- **Desktop**: > 1024px (full layout)
- **Tablet**: 768px - 1024px (adjusted spacing)
- **Mobile**: < 768px (optimized layout)

### Mobile Adjustments
```css
@media (max-width: 768px) {
  .message-user,
  .message-assistant {
    max-width: 90%;
  }

  .header {
    padding: 12px;
  }

  .input-area {
    gap: 8px;
  }
}
```

## 7. Dark Mode (Default)

Complete dark mode implementation with smooth transitions:

```css
:root {
  --bg-primary: #0a0e27;
  --bg-secondary: #1a1f3a;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border: #334155;
  --primary: #7c3aed;
  --secondary: #2dd4bf;
  --success: #10b981;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

## 8. Loading States

### Initial Load
```
🔄 Loading conversation...
(with animated spinner)
```

### Sending Message
```
Button disabled
Opacity reduced
Spinner shows
```

### AI Thinking
```
🤖 AI thinking...
(with typing indicator)
```

## 9. Empty State

```
┌─────────────────────────────────┐
│                                 │
│         🤖 Welcome!              │
│                                 │
│  "What would you like to do?"  │
│                                 │
│  • Add a task                   │
│  • Check your tasks             │
│  • Mark something complete      │
│                                 │
└─────────────────────────────────┘
```

## 10. Performance Considerations

### Optimizations
- Virtualized message list (for 1000+ messages)
- Lazy load message history
- Debounce input field
- Memoize message components
- Preload animations

### Animation Performance
- Use `will-change` sparingly
- GPU-accelerated transforms
- Reduce blur effects on low-end devices
- Test on 60fps target

## Accessibility

### WCAG 2.1 AA Compliance
- Color contrast ratio ≥ 4.5:1
- Keyboard navigation support
- ARIA labels on interactive elements
- Screen reader support
- Focus indicators visible

### Implementation
```jsx
<button
  aria-label="Send message"
  aria-disabled={isLoading}
  onClick={handleSend}
>
  Send
</button>
```

## Code Organization

### Component Structure
```
ChatPage/
  ├── Header.tsx
  ├── MessageList.tsx
  │   ├── MessageItem.tsx
  │   ├── UserMessage.tsx
  │   └── AssistantMessage.tsx
  ├── InputArea.tsx
  └── Animations/
      ├── vaultAnimation.ts
      ├── messageAnimations.ts
      └── microInteractions.ts
```

## Future Enhancements
- Voice input
- Conversation export
- Dark/Light mode toggle
- Message reactions
- Conversation search
- Rich text messages
- File attachments
- Code syntax highlighting
