# MatchMint – Harsh Checklist (Chat, Gifts, Video Calls, Real‑Time)

> **Scope**: Everything related to **chat/messaging**, **gifts**, **video calls**, **chat‑related coin movements**, and **chat‑side notifications**.  
> **Do NOT touch**: auth, wallet core, payments, earnings core, withdrawals, admin, non‑chat pages.

---

## 0. Foundations (Harsh)

- [ ] Attach Socket.IO server to Express HTTP server
- [ ] Implement Socket.IO auth handshake (JWT → userId, role)
- [ ] Track online status & lastSeen for users
- [ ] Create BMAD structure for chat domain:
  - `/models/chat` – `ChatThread`, `ChatMessage`, `CallSession`, `GiftMessage`
  - `/actions/chat` – pure chat actions
  - `/adapters/chat` – Socket.IO handlers, chat HTTP routes if needed
  - `/workflows/chat` – “send paid message”, “send free message”, “send gift”, “start call”

---

## 1. Chat Models & Storage

- [ ] `Chat` model
  - participants (maleId, femaleId)
  - lastMessage, lastMessageAt
  - per‑user unread counts
  - soft‑delete flags (per participant)

- [ ] `Message` model
  - chatId, senderId, receiverId
  - type: `text | image | gift | system`
  - content, mediaUrl, giftId
  - coinCost (for male paid messages)
  - status: `sent | delivered | read`
  - timestamps (createdAt, updatedAt, readAt)

- [ ] (Optional) `Gift` model or static catalog
  - id, name, icon, description, cost, rarity, active

- [ ] (Optional) `CallSession` model
  - chatId, callerId, calleeId
  - status: `initiated | ringing | accepted | rejected | ended`
  - startedAt, endedAt, durationSeconds

---

## 2. BMAD Models & Actions (Chat)

### 2.1 Models
- [ ] `ChatThreadModel`
- [ ] `ChatMessageModel` (validated length, allowed types)
- [ ] `PaidMessageActionModel` (senderId, receiverId, content, cost=50)
- [ ] `FreeMessageActionModel`
- [ ] `GiftSendModel` (giftId, senderId, receiverId)
- [ ] `CallStartModel` (callerId, calleeId, cost=500)

### 2.2 Actions (pure, no IO)
- [ ] `createOrGetChat(maleId, femaleId) → ChatThreadModel`
- [ ] `appendMessage(thread, messageModel) → ChatMessageModel`
- [ ] `markMessagesRead(thread, readerId, upToMessageId) → updatedThread`
- [ ] `buildChatPreview(thread, lastMessage) → ChatPreview`
- [ ] `canSendMessage(user, thread) → boolean | errorCode`
- [ ] `canStartCall(user, thread) → boolean | errorCode`

---

## 3. Socket.IO Workflows

### 3.1 Events to Implement
- [ ] `chat:join` – join room(s) for user’s chats
- [ ] `chat:sendMessage` – main message send
- [ ] `chat:messageReceived` – server → receiver
- [ ] `chat:seen` – read receipts
- [ ] `chat:typing` – typing indicator
- [ ] `chat:stopTyping`
- [ ] `call:initiate`, `call:ringing`, `call:accept`, `call:reject`, `call:end`

### 3.2 Paid Message Workflow (Male → Female)
**Socket handler**:
- [ ] Validate payload against `PaidMessageActionModel`
- [ ] Ensure sender is male, not blocked, chat allowed
- [ ] Call **Sujal’s** wallet/earnings actions:
  - [ ] `walletActions.deductCoins(maleId, 50)` (adapter call)
  - [ ] `earningActions.creditCoins(femaleId, 50)` (adapter call)
- [ ] If deduction fails → emit `INSUFFICIENT_COINS` error, do **not** send message
- [ ] If credit fails after deduction → log + emit generic error, ensure compensating logic exists from Sujal’s side
- [ ] Append message to DB and update Chat
- [ ] Emit:
  - [ ] `chat:messageReceived` to receiver room
  - [ ] `chat:messageSent` (ack) to sender
  - [ ] Optional: balance update event using Sujal’s wallet summary

### 3.3 Free Message Workflow (Female → Male)
- [ ] Validate payload (`FreeMessageActionModel`)
- [ ] No coin operations
- [ ] Same DB + socket flow as paid message

### 3.4 Read Receipts & Typing
- [ ] `chat:seen`:
  - [ ] Mark messages read in DB
  - [ ] Update unread counts
  - [ ] Emit `chat:seen` to other participant
- [ ] `chat:typing` / `chat:stopTyping`:
  - [ ] Broadcast typing status to other side

---

## 4. Gifts (Male → Female)

### 4.1 Gift Catalog
- [ ] Define gift list (static JSON or DB model)
  - id, name, icon URL, cost, active
- [ ] Provide helper to resolve `giftId → cost` & metadata

### 4.2 Workflow
- [ ] FE: `ChatGiftSelectorModal` → emit `chat:sendGift`
- [ ] Socket handler steps:
  - [ ] Validate `GiftSendModel`
  - [ ] Ensure gift exists and active
  - [ ] Call **Sujal’s**:
    - `walletActions.deductForGift(maleId, giftCost)`
    - `earningActions.creditForGift(femaleId, giftCost)`
  - [ ] On success:
    - [ ] Create `Message` type `gift`
    - [ ] Emit `chat:giftReceived`
  - [ ] On failure: send friendly error to sender

---

## 5. Video Call Signaling (Male Pays)

### 5.1 Basic Signaling
- [ ] `call:initiate`:
  - [ ] Validate `CallStartModel`
  - [ ] Check user can start call (role=male, not busy)
  - [ ] Ask Sujal’s wallet action to **reserve/deduct** 500 coins
  - [ ] Create `CallSession` in DB
  - [ ] Emit `call:ringing` to female
- [ ] `call:accept`:
  - [ ] Mark session accepted, start timer
- [ ] `call:reject`:
  - [ ] Mark session rejected, ensure coin rule agreed with Sujal:
    - Either full refund or only charge on accepted call
- [ ] `call:end`:
  - [ ] Mark end, compute duration
  - [ ] If Sujal later adds duration‑based earnings, integrate via his action

### 5.2 Safety & Edge Cases
- [ ] Prevent multiple simultaneous active calls per user
- [ ] Handle disconnects mid‑call (auto end after timeout)
- [ ] Clear error codes: BUSY, OFFLINE, INSUFFICIENT_COINS, CALL_NOT_FOUND

---

## 6. FE Chat Implementations (Male & Female)

### 6.1 Shared components
- [ ] `MessageBubble.tsx` – render text/image/gift/system
- [ ] `MessageInput.tsx` – integrate with socket send + disable when sending
- [ ] `ChatWindowHeader.tsx` – show name, status, video button
- [ ] `ChatListItem.tsx` – preview last message + unread
- [ ] `ChatListHeader.tsx` – search, coin display (data from Sujal’s API)
- [ ] `ChatMoreOptionsModal.tsx` – block/report/delete (server hooks from Sujal)
- [ ] `ActiveChatsList.tsx` – horizontal list of active chats
- [ ] `GiftMessageBubble.tsx`, `GiftCarouselViewer.tsx`, `ChatGiftSelectorModal.tsx`

### 6.2 Male Chat Pages
- [ ] `Male ChatListPage.tsx`:
  - [ ] Load initial chat list from Harsh’s chat API
  - [ ] Subscribe to socket updates for new messages/unreads
  - [ ] Implement search/filter locally or via API
- [ ] `Male ChatWindowPage.tsx`:
  - [ ] Load messages via chat API
  - [ ] Real‑time updates via sockets
  - [ ] Paid message send flow with coin error handling
  - [ ] Gift send UI + errors
  - [ ] Video call button triggers signaling flow

### 6.3 Female Chat Pages
- [ ] `Female ChatListPage.tsx`:
  - [ ] Same pattern as male but labeling free messaging
- [ ] `Female ChatWindowPage.tsx`:
  - [ ] Free message send flow
  - [ ] Receive gifts + messages
  - [ ] Handle incoming video call signaling

---

## 7. Chat‑Side Notifications

- [ ] On new message:
  - [ ] Emit socket event
  - [ ] Optionally call Sujal’s notification service via adapter
- [ ] On missed call:
  - [ ] Create system message in chat
  - [ ] Trigger notification (adapter to Sujal’s notification actions)
- [ ] On gift received:
  - [ ] Inline chat message + optional notification

---

## 8. Hardening & Tests (Harsh)

- [ ] Unit tests for:
  - [ ] Chat actions (appendMessage, canSendMessage, markMessagesRead)
  - [ ] Gift send logic (model validation + branching)
  - [ ] Call session state transitions
- [ ] Integration tests:
  - [ ] Male paid message end‑to‑end (mock Sujal’s wallet/earnings adapters)
  - [ ] Female free message flow
  - [ ] Gifts flow with mocked wallet/earning actions
- [ ] Socket load tests for high message volume (basic)

---

> **Reminder**: Any place you need coins or earnings changed, call **Sujal’s actions/adapters** – do not implement wallet/earnings math in chat code.  
> For new subflows you discover (e.g. reactions to messages, pinned chats), add them here under new BMAD Models + Actions + Workflow steps.


