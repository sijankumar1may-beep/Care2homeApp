# Run Care2Home on Your Phone (Wi‑Fi only)

> **Important:** This app does **not** work in Expo Go. Use the **Care2home** dev app installed on your phone.

**Requirements:** Phone and PC on the **same Wi‑Fi**. No USB cable needed.

---

## How development mode works

Your app has **two parts**:

| Part | What it is | When it changes |
|------|------------|-----------------|
| **Native shell** | The Care2home app on your phone (Firebase, camera, WebView, etc.) | Only when you run `npm run android` |
| **JavaScript bundle** | Your screens, UI, and logic | **Live** from your PC via Metro over Wi‑Fi |

You do **not** rebuild the full app for every UI change. Install the shell once, then Metro pushes JS changes instantly (hot reload).

```
[Your PC — npm start]  ── Wi‑Fi ──►  [Phone — Care2home app]
     Metro serves latest code            Shows live updates
```

### Daily workflow

```
ONE TIME:  pair phone over Wi‑Fi + npm run android   → installs dev app
DAILY:     npm start                                 → starts live dev server
DAILY:     open Care2home on phone                   → see changes in real time
```

**Instant changes?** Yes — for JS/UI (screens, styles, logic).  
**Rebuild needed?** Only after adding native packages or changing `app.json` plugins.

---

## One-time setup

### 1. Install dependencies

```bash
npm install
```

### 2. Enable wireless debugging on your phone

Requires **Android 11 or newer**.

1. **Settings → About phone** → tap **Build number** 7 times (enables Developer options)
2. **Settings → Developer options** → turn on **Wireless debugging**
3. Tap **Pair device with pairing code**
4. Note the **pairing IP:port** and **6-digit code** shown on screen

### 3. Pair your phone with your PC

On your PC (phone and PC must be on the same Wi‑Fi):

```bash
adb pair 192.168.1.43:46791
```

Replace with the pairing **IP and port** from your phone. Enter the 6-digit code when prompted.

> **IP format:** use **dots** in the IP (`192.168.1.43`), then **one colon** before the port (`:46791`).  
> Wrong: `192:168:1:43:46791` — Right: `192.168.1.43:46791`

You can also pass the code in one line (pairing codes expire quickly — get a fresh one):

```bash
adb pair 192.168.1.43:46791 516612
```

> If `adb` is not found, use the full path:
> `C:\Users\YOUR_USER\AppData\Local\Android\Sdk\platform-tools\adb.exe`

### 4. Connect over Wi‑Fi

On your phone, open **Wireless debugging** again and note the **IP address and port** under “IP address & port” (this is different from the pairing port).

On your PC:

```bash
adb connect 192.168.x.x:YYYYY
adb devices
```

You should see your phone listed as `device`.

### 5. Build and install the app

```bash
npm run android -- --device
```

Wait for the build to finish. The **Care2home** app will install on your phone.

---

## Daily development (Wi‑Fi)

1. Make sure phone and PC are on the **same Wi‑Fi**.

2. If the phone was restarted, reconnect ADB:
   ```bash
   adb connect 192.168.x.x:YYYYY
   ```
   (Use the IP:port from **Wireless debugging** on your phone.)

3. Start Metro on your PC:
   ```bash
   npm start
   ```

4. Open the **Care2home** app on your phone (not Expo Go).

5. The app should connect automatically. If it does not:
   - Shake the phone → **developer menu**
   - Tap **Change bundle location** or **Enter URL manually**
   - Enter: `http://YOUR_PC_IP:8081`  
     Example: `http://192.168.1.44:8081`

6. To reload after code changes:
   - Shake phone → **Reload**, or
   - Press `r` in the terminal

---

## Quick reference

| When | Command | Phone action |
|------|---------|--------------|
| First install | `adb pair` → `adb connect` → `npm run android -- --device` | App installs over Wi‑Fi |
| Phone restarted | `adb connect 192.168.x.x:YYYYY` | — |
| Every session | `npm start` | Open **Care2home** |
| Reload | Press `r` in terminal | Shake → Reload |

