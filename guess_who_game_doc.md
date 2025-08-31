# 🎲 Guess Who? - Online Multiplayer Game Documentation

## 1. 🎯 Project Overview
The game is a **two-player online “Guess Who?” clone**, playable from:
- 📱 Mobile browsers  
- 💻 Desktop browsers  

Players can:  
- Create or join a private game room (using a 4–6 digit code).  
- Each player gets a board with **characters displayed as cards**.  
- Players take turns asking **yes/no questions** (through a chat system).  
- Based on answers, players **eliminate characters** by flipping them down.  
- Players can use the **Guess button** to attempt the final guess.  
- The server validates the guess and declares **win or lose**.

---

## 2. ⚙️ Tech Stack
- **Frontend (Browser):**
  - **React (preferred)** for smooth UI state management.
  - **TailwindCSS** for styling.
  - **GSAP** (GreenSock) for animations (card flip, transitions, UI effects).
- **Backend:**
  - **Node.js + Express** server.
  - **WebSockets (Socket.IO)** for real-time sync between players.
- **Database:**
  - Not required for basic gameplay (all in-memory).  
  - Optional Redis for scaling (not necessary for MVP).
- **Deployment:**
  - Host backend on **Heroku, Railway, or Render** (for global access).
  - Use a domain with **HTTPS** for secure connections.

---

## 3. 🏠 Main Menu Flow
When a user opens the game:
1. **Name Input Field:** Player enters their display name.  
2. **Two Options:**  
   - **Create Game**  
     - Generates a **4–6 digit game code** (e.g., `5231`).  
     - Host waits in lobby until second player joins.  
   - **Join Game**  
     - Enters code in a text box.  
     - Joins the host’s lobby.  
3. **Lobby Screen:**  
   - Shows both players’ names.  
   - Host has a **Start Game** button.  

---

## 4. 🧑‍🎨 Characters & Assets
The game requires **diverse character cards**:
- Total: **24 characters** (classic Guess Who style).  
- Each card has:
  - Cartoon-style face/character.
  - Visible traits (hair, glasses, hat, beard, gender, skin tone, clothing).  
- Art Style:
  - **Flat vector illustration** (easy for AI agent to generate).  
  - Characters should be **distinct and diverse** in:  
    - Gender (male, female, non-binary).  
    - Skin tones.  
    - Hair styles/colors.  
    - Accessories (glasses, hats, jewelry).  
    - Clothing colors.  
- Format:
  - PNG images (transparent background).  
  - Size: **200×250px per card**.  
  - A **backside design** (used when flipped/eliminated).

📌 **Instruction for your AI agent:**  
Generate **24 unique character illustrations** with the above diversity rules. Keep them in a folder `/assets/characters/`.

---

## 5. 🎮 Gameplay Flow
### 5.1 Board Setup
- Each player sees the **same 24 characters** laid out in a grid (4×6).  
- One character is randomly assigned as **“secret identity”** to each player.  
- Players cannot see their opponent’s secret identity.  

### 5.2 Asking Questions
- A **chat box UI** at the bottom lets players type yes/no questions.  
- Example: “Does your character wear glasses?”  
- The other player clicks **Yes** or **No** response buttons.  
- The chat log shows history of questions/answers.  

### 5.3 Eliminating Characters
- Player can **tap (mobile) or click (PC)** on a character card.  
- Card flips down with **GSAP animation** (0.5s flip, fade-out).  
- Players can tap/click again to **flip back up** if they change their mind.  

### 5.4 Making a Guess
- Each player has a **Guess Button**.  
- When it’s their turn:  
  - They click the button, then click a character card.  
  - The guess is sent to the server.  
  - Server checks if guessed character == opponent’s secret identity.  
  - **If correct:** Guessing player wins.  
  - **If wrong:** Opponent automatically wins.  

---

## 6. 🔗 Networking (Multiplayer Logic)
- **Room System:**  
  - On “Create Game,” backend generates unique room code.  
  - Players connect via Socket.IO with that room ID.  
- **Turn Handling:**  
  - Server enforces **turn-based play** (only one player active at a time).  
  - After asking a question/guessing, the turn switches.  
- **Sync Events (WebSocket messages):**  
  - `playerJoined` → updates lobby.  
  - `gameStart` → sends board + secret identity.  
  - `questionAsked` → sends chat message.  
  - `answerGiven` → updates chat log.  
  - `characterFlipped` → syncs board flips.  
  - `playerGuessed` → server checks and sends `win` or `lose`.  

---

## 7. 🎨 UI/UX & Animations
### Main Menu
- Soft gradient background.  
- Input fields + buttons with rounded corners.  
- GSAP fade-in for elements.  

### Lobby
- Avatars + player names.  
- Animated “waiting” indicator.  

### Game Board
- Grid layout, responsive for mobile & PC.  
- Each character card has:  
  - Hover effect (PC) / tap effect (mobile).  
  - Flip-down animation with GSAP (rotateY 180° + fade).  

### Chat Box
- Slide-in from bottom.  
- Messages in speech-bubble style.  
- Smooth scroll when new message appears.  

### Guess Result
- Fullscreen overlay with animation:
  - ✅ “You Win!” (confetti effect).  
  - ❌ “You Lose!” (fade-out red background).  

---

## 8. 🛠️ Error Handling
- Invalid room code → show error.  
- Player disconnects → auto “You Win” for remaining player.  
- Guess button disabled if not your turn.  

---

## 9. 🔒 Security & Fair Play
- Secret identity is **only assigned by server** (never exposed in client-side code).  
- Players can’t modify their board state locally; all actions validated via server.  

---

## 10. 📂 Project Structure (Recommended)
```
/frontend
   /src
      /components
         Board.jsx
         Card.jsx
         ChatBox.jsx
         Lobby.jsx
         Menu.jsx
      /assets
         /characters (24 PNGs)
      App.jsx
      index.jsx
/backend
   /src
      server.js
      socket.js
```

---

## 11. 👥 Sample Character List (24)
These are descriptions your AI agent should use to generate illustrations:

1. Young woman, dark skin, curly hair, red shirt.  
2. Elderly man, bald, glasses, blue sweater.  
3. Teen boy, light skin, freckles, baseball cap.  
4. Middle-aged woman, blonde hair, green dress.  
5. Man with beard, turban, yellow shirt.  
6. Woman with hijab, purple clothing.  
7. Asian man, short black hair, gray hoodie.  
8. Woman with pink dyed hair, nose ring, denim jacket.  
9. Man with mustache, cowboy hat, plaid shirt.  
10. Woman with braids, hoop earrings, orange blouse.  
11. Man with afro, sunglasses, leather jacket.  
12. Elderly woman, white hair bun, floral dress.  
13. Young girl, ponytail, striped shirt.  
14. Man with buzzcut, tattoo on neck, black t-shirt.  
15. Woman with short bob haircut, glasses, cardigan.  
16. Man with spiky hair, headphones around neck.  
17. Non-binary person, green hair, piercings, hoodie.  
18. Woman with hat, scarf, and coat.  
19. Man with dreadlocks, casual t-shirt.  
20. Young man, messy blonde hair, hoodie.  
21. Woman with long straight hair, red lipstick, formal blouse.  
22. Man with long beard, beanie, casual jacket.  
23. Woman with curly short hair, yellow dress.  
24. Man with medium-length hair, suit and tie.  

---

✅ This documentation gives your AI agent **everything needed**:  
- Full gameplay rules  
- Networking logic  
- UI/UX flow  
- Character asset requirements  
- Animations and interactions  
- Sample list of 24 diverse characters  
