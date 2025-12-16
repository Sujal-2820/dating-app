# MatchMint – Sujal Checklist (Auth, Wallet, Payments, Earnings, Withdrawals, Admin, Non‑Chat UI)

> **Scope**: Everything **outside** Harsh’s chat/gift/video‑call domain:  
> auth, profiles, wallet & coins, payments (Razorpay), earnings, withdrawals, discovery, dashboards, notifications, admin panel, and all non‑chat frontend.

---

## 0. BMAD Foundations (Sujal)

- [ ] Create backend BMAD structure:
  - `/models` – domain models (TS interfaces + Mongoose)
  - `/actions` – pure business actions
  - `/adapters` – Express route handlers, Razorpay client, MongoDB connection
  - `/workflows` – composed flows (purchase coins, withdraw, approve female, etc.)
  - `/config` – env + business constants (MESSAGE_COST, CALL_COST, GIFT_COSTS)
- [ ] Implement:
  - [ ] Central error types & mapping
  - [ ] Standard API response helper
  - [ ] JWT auth middleware
  - [ ] Role check middleware

---

## 1. Authentication & Profiles

### 1.1 Models
- [ ] `User` (base domain)
  - id, email/phone, passwordHash
  - role: `male | female | admin`
  - isVerified, isBlocked
  - profile fields (name, age, location, photos, bio, interests)
  - walletSnapshot: `coinBalance`, `tier`
  - flags: `profileCompleted`, `onboardingStep`

- [ ] `AuthCredentials`, `AuthTokenPayload`, `SignupModel`, `ProfileModel`

### 1.2 Actions
- [ ] `registerUser(model: SignupModel) → AuthResult`
- [ ] `loginUser(model: LoginModel) → AuthResult`
- [ ] `updateBasicProfile(userId, model: ProfileModel) → User`
- [ ] `blockUser(adminId, userId) → User`
- [ ] `verifyUser(adminId, userId) → User`

### 1.3 Workflows & Edge Cases
- [ ] Enforce unique email/phone
- [ ] Password strength checks
- [ ] Rate‑limit login attempts
- [ ] Prevent blocked users from logging in or calling sensitive APIs
- [ ] Profile completion gating (e.g. must complete before chat/discovery)

### 1.4 Frontend
- [ ] Implement Login/Signup/Profile pages using real APIs
- [ ] Global auth store and role‑based routing
- [ ] Handle token refresh/expiry

---

## 2. Wallet, Coins & Transactions (Core)

### 2.1 Models
- [ ] `WalletSnapshot` (userId, balance, lastUpdatedAt)
- [ ] `Transaction`:
  - userId
  - type: `purchase | message_spent | video_call_spent | gift_spent | message_earned | call_earned | gift_earned | bonus | adjustment`
  - direction: `credit | debit`
  - coinsDelta, balanceAfter
  - metadata (planId, relatedUserId, messageId, externalPaymentId)
  - status: `pending | completed | failed`

### 2.2 Actions
- [ ] `getWalletOverview(userId) → WalletSnapshot`
- [ ] `listTransactions(userId, filter) → Paginated<Transaction>`
- [ ] `applyTransaction(userId, coinsDelta, type, metadata) → WalletSnapshot`
- [ ] `deductCoinsForMessage(maleId, cost=50) → WalletSnapshot`
- [ ] `deductCoinsForGift(maleId, giftCost) → WalletSnapshot`
- [ ] `deductCoinsForCall(maleId, cost=500) → WalletSnapshot`
- [ ] `creditEarningsForMessage(femaleId, 50) → WalletSnapshot`
- [ ] `creditEarningsForGift(femaleId, giftCost) → WalletSnapshot`
- [ ] `creditEarningsForCall(femaleId, 500) → WalletSnapshot`

> These actions are what **Harsh** calls from chat workflows.

### 2.3 Safety & Subfeatures
- [ ] Ensure atomic update of balance + transaction write (no race conditions)
- [ ] Reject operations on insufficient coins with explicit `INSUFFICIENT_COINS` error
- [ ] Never allow negative balances
- [ ] Idempotency for externally triggered credits (purchases/webhooks)
- [ ] Indexes on `Transaction` (userId, createdAt, type)

### 2.4 Frontend
- [ ] `WalletPage.tsx` uses `GET /api/male/female/wallet`
- [ ] Transaction filters (all/purchased/spent) wired to API

---

## 3. Payments (Razorpay) & Coin Plans

### 3.1 Models
- [ ] `CoinPlan`:
  - id, name, tier, priceInINR, baseCoins, bonusCoins, totalCoins, active, badges
- [ ] `PaymentOrder`:
  - orderId, userId, planId, amount, currency, status
- [ ] `PaymentVerificationPayload` (from Razorpay)

### 3.2 Actions
- [ ] `getActivePlans() → CoinPlan[]`
- [ ] `createPurchaseOrder(userId, planId) → PaymentOrder`
- [ ] `verifyAndSettlePayment(payload) → SettlementResult`
  - On success:
    - apply credit transaction
    - update wallet balance
  - On failure:
    - mark transaction failed with reason

### 3.3 Safety & Subfeatures
- [ ] Use Razorpay test keys from `.env`
- [ ] Enforce idempotent settlement (paymentId → single credit)
- [ ] Validate plan is active & not tampered with (server‑side lookup)
- [ ] Handle webhook vs client‑confirmation (design future‑proof)

### 3.4 Frontend
- [ ] `CoinPurchasePage.tsx`: load plans, call create‑order API, open Razorpay
- [ ] `PaymentPage.tsx`: post‑payment status display using backend verification

---

## 4. Earnings System (Female)

### 4.1 Models
- [ ] `EarningsSummary`:
  - totalEarned, availableBalance, pendingWithdrawals
- [ ] `EarningsEntry`:
  - type: `message | call | gift`
  - coins, fromUserId, timestamp, relatedMessageId/CallId

### 4.2 Actions
- [ ] `getEarningsSummary(femaleId) → EarningsSummary`
- [ ] `getEarningsTimeline(femaleId, filter) → EarningsPoint[]`
- [ ] `exportEarningsReport(femaleId, filter) → File`
- [ ] Internal actions (called from wallet/earnings integration with Harsh):
  - `recordMessageEarning(femaleId, 50, fromUserId, messageId)`
  - `recordGiftEarning(femaleId, giftCost, fromUserId, messageId)`
  - `recordCallEarning(femaleId, 500, fromUserId, callId)`

### 4.3 Safety & Subfeatures
- [ ] Ensure earnings data is derivable from the same ledger used by wallet
- [ ] Timezone‑safe bucketing (daily/weekly/monthly)
- [ ] Efficient aggregation queries (indexes + pre‑aggregation if needed)

### 4.4 Frontend
- [ ] `FemaleDashboard.tsx`: use summary & small charts
- [ ] `EarningsPage.tsx`: detailed charts, breakdown, filters, export

---

## 5. Withdrawals (Female + Admin)

### 5.1 Models
- [ ] `Withdrawal`:
  - id, femaleId, amountCoins, payoutAmountINR
  - method: UPI | Bank
  - methodDetails (upiId OR accountNumber, ifsc, holderName)
  - status: `pending | approved | rejected | paid`
  - timestamps & audit fields

### 5.2 Actions
- [ ] `requestWithdrawal(femaleId, model) → Withdrawal`
- [ ] `approveWithdrawal(adminId, withdrawalId) → Withdrawal`
- [ ] `rejectWithdrawal(adminId, withdrawalId, reason) → Withdrawal`
- [ ] `markWithdrawalPaid(adminId, withdrawalId) → Withdrawal`

### 5.3 Safety & Subfeatures
- [ ] Validate min/max withdrawal amount
- [ ] Check available balance and **lock** funds when request is created
- [ ] Prevent multiple overlapping pending requests over certain thresholds
- [ ] Always record admin actions in `AuditLog`
- [ ] Provide clear error states: `INSUFFICIENT_BALANCE`, `INVALID_AMOUNT`, etc.

### 5.4 Frontend
- [ ] `WithdrawalPage.tsx`: full flow + form validation + success/error handling
- [ ] Admin `WithdrawalManagementPage.tsx`: filters, actions, status history

---

## 6. Discovery & Profile (Male & Female)

### 6.1 Discovery
- [ ] `DiscoveryFilterModel` (ageRange, distance, online, verified, search)
- [ ] `searchFemales(maleId, filter) → DiscoveryResult`
- [ ] Distance computation helper (Haversine) with tolerance for missing location
- [ ] Pagination & consistent ordering

### 6.2 Profile
- [ ] `getProfile(userId, targetUserId) → ProfileView`
- [ ] `updateProfile(userId, model) → Profile`
- [ ] Photo upload adapter (Cloudinary/S3 or local dev)
- [ ] Privacy rules (what fields visible to whom)

### 6.3 Frontend
- [ ] `NearbyFemalesPage.tsx`: wire filters + API
- [ ] `UserProfilePage.tsx` (male and female modules): show profile details from API
- [ ] `MyProfilePage.tsx` (male and female): full edit, photo gallery

---

## 7. Notifications (Server‑Side & FE, Non‑Chat)

### 7.1 Models
- [ ] `Notification`:
  - userId, type, title, message
  - read: boolean
  - actionUrl
  - createdAt

### 7.2 Actions
- [ ] `createNotification(model) → Notification`
- [ ] `listNotifications(userId, filter) → Paginated<Notification>`
- [ ] `markAsRead(userId, notificationId) → void`

### 7.3 Producers
- [ ] On:
  - Successful coin purchase
  - Withdrawal status changes
  - Admin system notifications
  - Optional: earnings milestones

### 7.4 Frontend
- [ ] `NotificationsPage.tsx` (male & female): list + filters + mark-as-read
- [ ] Unread badge logic on headers/bottom nav

---

## 8. Admin Panel (Dashboard, Users, Female Approval, Coin Economy, Transactions, Audit Logs)

### 8.1 Dashboard
- [ ] `buildAdminDashboard() → AdminDashboardStats`:
  - total users (male/female)
  - active users
  - total revenue, total payouts, profit
  - pending withdrawals
  - total transactions
  - charts: user growth, revenue trends, etc.

### 8.2 User Management
- [ ] `GET /api/admin/users` with multi‑filter
- [ ] `GET /api/admin/users/:id` with full details
- [ ] `blockUser`, `verifyUser` actions (already defined in auth section)
- [ ] Summary counts for stats cards

### 8.3 Female Approval Workflow
- [ ] `FemaleApproval` model (status, submittedAt, reviewedBy, notes)
- [ ] Endpoints: list pending, approve, reject
- [ ] Audit logs + notifications to users on decision

### 8.4 Coin Economy
- [ ] CRUD for `CoinPlan`
- [ ] CRUD for `PayoutSlab` (minCoins, maxCoins, payoutPercentage)
- [ ] Configurable:
  - message cost (should be 50)
  - call cost (500)
  - gift costs
- [ ] Expose read‑only configs for Harsh’s chat logic via API/config adapter

### 8.5 Transactions & Audit Logs
- [ ] `listTransactions(filter) → Paginated<AdminTransaction>`
- [ ] Record all admin actions in `AuditLog` with before/after state
- [ ] Efficient indexes & filters for large datasets

### 8.6 Frontend
- [ ] Wire all admin pages to corresponding APIs
- [ ] Ensure error & loading states are implemented (no mock only)

---

## 9. Dashboards (Male & Female)

### 9.1 Male Dashboard
- [ ] `buildMaleDashboard(userId) → MaleDashboardData`
  - wallet snapshot
  - stats (matches, messages sent, views)
  - nearby preview
  - active chat summary (via Harsh’s chat API)
- [ ] Frontend replacement of all mock data with live calls

### 9.2 Female Dashboard
- [ ] `buildFemaleDashboard(userId) → FemaleDashboardData`
  - earnings summary
  - stats (messages received, profile views, active conversations)
- [ ] Frontend: replace mocks, show trends

---

## 10. Testing & BMAD Validation (Sujal)

- [ ] Unit tests for:
  - Auth actions
  - Wallet/transaction actions
  - Payment create/verify actions (with mocks)
  - Earnings calculations
  - Withdrawal workflows
  - Admin stats builders
- [ ] Integration tests:
  - Purchase coins → wallet updated
  - Withdrawal approve/reject → balances and statuses correct
  - Coin economy configs being applied consistently
- [ ] BMAD checks:
  - Every model has type + runtime validation
  - Every action declares:
    - pre‑conditions
    - post‑conditions
    - error states
    - side‑effects

---

> As new subfeatures appear (e.g., VIP tiers, promo bonuses, referral earnings), add them here as **Models → Actions → Workflows**, and keep Harsh notified when they affect chat costs or real‑time flows.


