# 🔐 Session Management & Auto-Logout Feature

## Overview
The SKSU FAQ Bot now includes an advanced session management system that automatically logs users out when they close the browser, with an optional "Keep me logged in" feature for persistent sessions.

---

## ✨ Features

### 1. **Auto-Logout on Browser Close**
- By default, users will be logged out when they close the browser
- Uses `sessionStorage` for temporary sessions (clears automatically)
- Protects user accounts on shared computers
- Enhances security for public/shared devices

### 2. **"Keep Me Logged In" Option**
- Checkbox on login page allows users to stay logged in
- Uses `localStorage` for persistent sessions
- Perfect for personal devices
- Session survives browser restarts

### 3. **Smart Storage Management**
- Automatically detects which storage type to use
- Prevents conflicts between storage types
- Cleans up unused storage on login/logout

---

## 🎯 How It Works

### **Login Flow:**

1. **User enters credentials** → Username/Email + Password
2. **User selects session type:**
   - ✅ **Keep me logged in** (checked) → Uses `localStorage` (persistent)
   - ❌ **Keep me logged in** (unchecked) → Uses `sessionStorage` (temporary)
3. **Token saved** to appropriate storage
4. **Success message** indicates session type

### **Auto-Logout Triggers:**

#### **For SessionStorage (Unchecked "Keep me logged in"):**
- Browser tab closed
- Browser window closed
- Browser restarted
- **Result:** Automatic logout, token automatically cleared

#### **For LocalStorage (Checked "Keep me logged in"):**
- Only logs out when user manually clicks logout
- Survives browser restarts
- **Result:** Stays logged in until manual logout

### **Page Load Flow:**

```
User opens index.html
    ↓
Check localStorage for token
    ↓
Check sessionStorage for token
    ↓
Token found? → Validate with server
    ↓           ↓
   YES         NO
    ↓           ↓
Load app    Redirect to login.html
```

---

## 🔧 Technical Implementation

### **1. Login Page (login.html)**

#### Remember Me Checkbox:
```html
<div class="remember-me">
    <input type="checkbox" id="rememberMe" checked>
    <label for="rememberMe">Keep me logged in (Stay signed in)</label>
</div>

<div class="session-info">
    ⚠️ Unchecking "Keep me logged in" will log you out when you close the browser
</div>
```

#### Storage Selection Logic:
```javascript
const rememberMe = document.getElementById('rememberMe').checked;
const storage = rememberMe ? localStorage : sessionStorage;

// Save to appropriate storage
storage.setItem('authToken', data.token);
storage.setItem('user', JSON.stringify(data.user));
storage.setItem('rememberMe', rememberMe);

// Clear the other storage to avoid conflicts
if (rememberMe) {
    sessionStorage.clear();
} else {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
}
```

### **2. Main App (index.html)**

#### Token Detection:
```javascript
// Check both storages
let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
let rememberMe = localStorage.getItem('rememberMe') === 'true' || 
                 sessionStorage.getItem('rememberMe') === 'true';
```

#### Auto-Logout on Close:
```javascript
window.addEventListener('beforeunload', (event) => {
    const rememberMeLocal = localStorage.getItem('rememberMe') === 'true';
    const rememberMeSession = sessionStorage.getItem('rememberMe') === 'true';
    
    // Only clear if user didn't select "Remember Me"
    if (!rememberMeLocal && !rememberMeSession) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        sessionStorage.clear();
        console.log('🔒 Session cleared - user will need to login again');
    }
});
```

### **3. Signup Flow**

New users default to **sessionStorage** (not persistent):
```javascript
// For new signups, use sessionStorage by default
sessionStorage.setItem('authToken', data.token);
sessionStorage.setItem('user', JSON.stringify(data.user));
sessionStorage.setItem('rememberMe', 'false');
```

**Reason:** New users should explicitly opt-in to persistent sessions for better security.

---

## 🎨 UI/UX Enhancements

### **Visual Feedback:**

1. **Session Info Box:**
   - Yellow warning box below checkbox
   - Clearly explains logout behavior
   - Animation on display

2. **Success Messages:**
   - "You will stay logged in" (Remember Me checked)
   - "You will be logged out when you close the browser" (unchecked)

3. **Checkbox Styling:**
   - Modern accent color (purple)
   - Large clickable area
   - Custom cursor pointer

---

## 📱 Use Cases

### **Scenario 1: Personal Device**
**User:** Student on personal laptop
**Action:** ✅ Check "Keep me logged in"
**Result:** Stays logged in even after closing browser
**Benefit:** Convenient, no need to re-login

### **Scenario 2: Library Computer**
**User:** Student using campus library computer
**Action:** ❌ Uncheck "Keep me logged in"
**Result:** Automatically logged out when browser closes
**Benefit:** Protects account from next user

### **Scenario 3: Shared Device**
**User:** Student using friend's laptop
**Action:** ❌ Uncheck "Keep me logged in"
**Result:** Session ends when they close the tab/browser
**Benefit:** Friend can't access their account later

---

## 🔒 Security Benefits

1. **Prevents Unauthorized Access:**
   - Auto-logout protects accounts on shared devices
   - No manual logout needed

2. **User Control:**
   - Users decide session persistence
   - Clear indication of security implications

3. **Token Cleanup:**
   - Tokens automatically removed from storage
   - Prevents stale/expired tokens

4. **Multi-Storage Support:**
   - Checks both storage types
   - Clears both on logout for complete cleanup

---

## 🧪 Testing Instructions

### **Test 1: Auto-Logout (SessionStorage)**
1. Open login page
2. **Uncheck** "Keep me logged in"
3. Login successfully
4. Close browser completely
5. Reopen browser and navigate to app
6. **Expected:** Redirected to login page ✅

### **Test 2: Persistent Session (LocalStorage)**
1. Open login page
2. **Check** "Keep me logged in"
3. Login successfully
4. Close browser completely
5. Reopen browser and navigate to app
6. **Expected:** Still logged in ✅

### **Test 3: Tab Close**
1. Login without "Keep me logged in"
2. Open app in one tab
3. Close that tab (not entire browser)
4. Open new tab to app URL
5. **Expected:** Still logged in (same browser session) ✅

### **Test 4: New Signup**
1. Create new account
2. Close browser
3. Reopen and visit app
4. **Expected:** Redirected to login (sessionStorage default) ✅

---

## 📋 Configuration

### **Default Settings:**

```javascript
// Login page default
rememberMe.checked = true; // Users can uncheck if needed

// Signup page default
Uses sessionStorage (no persistence)
```

### **Customization:**

To change default behavior, edit `login.html`:

```html
<!-- Change checked attribute -->
<input type="checkbox" id="rememberMe" checked>  <!-- Persistent by default -->
<input type="checkbox" id="rememberMe">          <!-- Temporary by default -->
```

---

## 🐛 Troubleshooting

### **Issue: Still logged in after closing browser**
**Cause:** "Keep me logged in" was checked during login
**Solution:** Uncheck the box on next login

### **Issue: Logged out too quickly**
**Cause:** Using sessionStorage (checkbox unchecked)
**Solution:** Check "Keep me logged in" during login

### **Issue: Token conflicts**
**Cause:** Both localStorage and sessionStorage have tokens
**Solution:** Clear browser data or use incognito mode

---

## 🚀 Future Enhancements

1. **Session Timeout:**
   - Auto-logout after X minutes of inactivity
   - Configurable timeout period

2. **Session Extension:**
   - "Extend session" button before expiry
   - Warning before auto-logout

3. **Multiple Device Management:**
   - View active sessions
   - Remote logout from other devices

4. **Biometric Login:**
   - Fingerprint/Face ID support
   - WebAuthn integration

---

## 📊 Statistics

### **Storage Comparison:**

| Feature | localStorage | sessionStorage |
|---------|-------------|----------------|
| **Persistence** | Survives browser restart | Cleared on close |
| **Security** | Lower (stays logged in) | Higher (auto-logout) |
| **Use Case** | Personal devices | Shared devices |
| **User Control** | Checkbox enabled | Checkbox disabled |
| **Default (Login)** | ✅ (checked) | Available option |
| **Default (Signup)** | ❌ | ✅ (default) |

---

## 🎓 User Education

### **Login Page Tips:**

Add these tips to guide users:

```html
<div class="tips">
    <h4>💡 Security Tips:</h4>
    <ul>
        <li>✅ Check "Keep me logged in" on your personal device</li>
        <li>❌ Uncheck on shared computers (library, café, friend's device)</li>
        <li>🔒 Your session will auto-logout when you close the browser if unchecked</li>
    </ul>
</div>
```

---

## 📝 Code Files Modified

1. **`public/login.html`:**
   - Added "Remember Me" checkbox
   - Updated login handler to use localStorage/sessionStorage
   - Added signup handler to use sessionStorage by default
   - Visual feedback for session type

2. **`public/index.html`:**
   - Updated token detection to check both storages
   - Added `beforeunload` event listener
   - Clear appropriate storage based on rememberMe setting
   - Enhanced authentication check

---

## ✅ Checklist

- [✅] Auto-logout on browser close (sessionStorage)
- [✅] Persistent session option (localStorage)
- [✅] "Keep me logged in" checkbox
- [✅] Visual feedback for session type
- [✅] Storage conflict prevention
- [✅] Token cleanup on logout
- [✅] Multi-storage detection
- [✅] Default to sessionStorage on signup
- [✅] User education messages
- [✅] Comprehensive testing

---

**Created by: Christian Keth Aguacito** 🚀
**Date:** November 14, 2025
**Version:** 2.0.0
