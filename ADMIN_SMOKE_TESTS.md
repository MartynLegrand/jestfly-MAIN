# Admin Dashboard - Smoke Test Guide

This guide provides step-by-step instructions for manually testing all admin configuration functionality.

## Prerequisites

1. Supabase instance running with migrations applied
2. User account with `admin` role in `profiles` table
3. Application running locally or in staging environment

## Test Scenarios

### Test 1: Admin Access Control

**Objective:** Verify only admin users can access admin dashboard

**Steps:**
1. Log out if currently logged in
2. Navigate to `/admin`
3. **Expected:** Redirect to `/login`

4. Log in with non-admin account
5. Navigate to `/admin`
6. **Expected:** Redirect to `/unauthorized`

7. Log in with admin account
8. Navigate to `/admin`
9. **Expected:** Admin dashboard loads successfully

**Status:** [ ] Pass [ ] Fail

---

### Test 2: Home Configuration Tab

**Objective:** Test Home configuration save/load/reset

**Steps:**
1. Navigate to `/admin` as admin
2. Click "Home" in sidebar
3. Modify "Hero Title" field to "TEST TITLE"
4. Click "Save Changes"
5. **Expected:** Green toast "Home configuration saved!"
6. Refresh page
7. **Expected:** "Hero Title" still shows "TEST TITLE"
8. Click "Reset" button
9. **Expected:** Field reverts to saved value

**Config to Test:**
- [ ] Hero Title
- [ ] Hero Subtitle
- [ ] Hero Description
- [ ] CTA Text
- [ ] CTA Link
- [ ] Show 3D Crystal (toggle)
- [ ] Crystal Animation (toggle)
- [ ] Show Gallery (toggle)
- [ ] Show Features (toggle)

**Status:** [ ] Pass [ ] Fail

---

### Test 3: Bookings Configuration Tab

**Objective:** Test comprehensive booking settings

**Steps:**
1. Click "Bookings" in sidebar
2. Update "Page Title" to "Book JESTFLY Test"
3. Toggle off "DJ Booking"
4. **Expected:** DJ booking fields collapse/hide
5. Toggle on "Studio Sessions"
6. Update "Studio Booking Title"
7. Toggle "Email Notifications"
8. Click "Save Changes"
9. **Expected:** Success toast appears
10. Refresh and verify all changes persist

**Config to Test:**
- [ ] Page Title
- [ ] Subtitle
- [ ] Enable Bookings toggle
- [ ] DJ Booking toggle + fields
- [ ] Studio Booking toggle + fields
- [ ] Consultation toggle + fields
- [ ] Email Notifications
- [ ] Require Phone Number
- [ ] Allow Multiple Dates

**Status:** [ ] Pass [ ] Fail

---

### Test 4: Resources Configuration Tab

**Objective:** Test resource section controls

**Steps:**
1. Click "Resources" in sidebar
2. Update "Page Title"
3. Toggle on "Show Documentation"
4. **Expected:** Documentation URL field appears
5. Enter URL in "Documentation URL"
6. Toggle off "Show UI Schema Exporter"
7. Toggle "Require Authentication"
8. Click "Save Changes"
9. Verify success toast
10. Refresh and confirm persistence

**Config to Test:**
- [ ] Page Title
- [ ] Description
- [ ] Subtitle
- [ ] UI Schema Exporter toggle
- [ ] Documentation toggle + URL
- [ ] Design Assets toggle + URL
- [ ] API Reference toggle + URL
- [ ] Allow Downloads
- [ ] Require Authentication

**Status:** [ ] Pass [ ] Fail

---

### Test 5: Demo Submission Configuration Tab

**Objective:** Test demo submission settings

**Steps:**
1. Click "Demo Submission" in sidebar
2. Update "Max File Size (MB)" to 100
3. Update "Accepted Formats"
4. Toggle "Allow Multiple Files"
5. Toggle on "Enable Auto-Reply"
6. **Expected:** Auto-Reply Message field appears
7. Update auto-reply message
8. Click "Save Changes"
9. Verify success
10. Refresh and check all fields

**Config to Test:**
- [ ] Page Title
- [ ] Subtitle
- [ ] Submit Button Text
- [ ] Success Message
- [ ] Accepted Formats
- [ ] Max File Size
- [ ] Allow Multiple Files
- [ ] Require Social Media
- [ ] Terms Text
- [ ] Auto-Reply toggle
- [ ] Auto-Reply Message

**Status:** [ ] Pass [ ] Fail

---

### Test 6: Press Kit Configuration Tab

**Objective:** Test press kit media settings

**Steps:**
1. Click "Press Kit" in sidebar
2. Update "Artist Bio"
3. Update "Press Contact Email"
4. Update "Booking Contact Email"
5. Toggle off "Show Photos"
6. Toggle off "Show Videos"
7. Toggle on "Require Attribution"
8. **Expected:** Attribution Text field appears
9. Update attribution text
10. Save and verify

**Config to Test:**
- [ ] Page Title
- [ ] Subtitle
- [ ] Artist Bio
- [ ] Press Contact
- [ ] Booking Contact
- [ ] Show Photos
- [ ] Show Logos
- [ ] Show Videos
- [ ] Show Press Releases
- [ ] Show Social Links
- [ ] Allow Downloads
- [ ] Require Attribution
- [ ] Attribution Text

**Status:** [ ] Pass [ ] Fail

---

### Test 7: Live Stream Configuration Tab

**Objective:** Test streaming platform configuration

**Steps:**
1. Click "Live Stream" in sidebar
2. Change "Platform" dropdown to "YouTube"
3. **Expected:** YouTube Channel ID field appears
4. Enter channel ID
5. Change to "Twitch"
6. **Expected:** Twitch Channel field appears
7. Change to "Custom Embed"
8. **Expected:** Custom Embed Code textarea appears
9. Toggle "Show Chat"
10. Toggle "Show Schedule"
11. **Expected:** Schedule Text field appears
12. Toggle "Enable Notifications"
13. Toggle "Enable Archive"
14. Save and verify all fields

**Config to Test:**
- [ ] Page Title
- [ ] Subtitle
- [ ] Platform dropdown (YouTube/Twitch/Custom)
- [ ] YouTube Channel ID
- [ ] Twitch Channel
- [ ] Custom Embed Code
- [ ] Show Chat
- [ ] Show Schedule + text
- [ ] Notification toggle + text
- [ ] Archive toggle + URL

**Status:** [ ] Pass [ ] Fail

---

### Test 8: Airdrop Configuration Tab

**Objective:** Test token airdrop campaign settings

**Steps:**
1. Click "Airdrop" in sidebar
2. Update "Campaign Name"
3. Update "Token Symbol" to "TEST"
4. Update "Tokens Per User" to 500
5. Update "Total Supply"
6. Toggle "Campaign Active"
7. Set "Claim Start Date"
8. Set "Claim End Date"
9. Update "Eligibility Criteria"
10. Toggle "Require Wallet Connection"
11. Toggle "Require KYC"
12. Toggle "Auto-Distribute"
13. Update all text fields
14. Save and verify

**Config to Test:**
- [ ] Page Title
- [ ] Subtitle
- [ ] Campaign Name
- [ ] Token Symbol
- [ ] Tokens Per User
- [ ] Total Supply
- [ ] Campaign Active toggle
- [ ] Claim Start Date
- [ ] Claim End Date
- [ ] Eligibility Criteria
- [ ] Require Wallet
- [ ] Require KYC
- [ ] Terms URL
- [ ] Auto-Distribute
- [ ] Claim Button Text
- [ ] Success Message

**Status:** [ ] Pass [ ] Fail

---

### Test 9: Keyboard Shortcuts

**Objective:** Test all admin keyboard shortcuts

**Prerequisites:** Must be logged in as admin user. Shortcuts work from any page in the application.

**Steps:**
1. Navigate to any page in the application (e.g., homepage)
2. Press `Ctrl+K` (or `Cmd+K` on Mac)
3. **Expected:** Admin Quick Access menu opens
4. Press `Ctrl+K` again
5. **Expected:** Menu closes

6. Press `Ctrl+Shift+A`
7. **Expected:** Navigate to Admin Panel + toast notification

7. Press `Ctrl+Shift+H`
8. **Expected:** Navigate to Homepage + toast

9. Press `Ctrl+Shift+N`
10. **Expected:** Navigate to NFT Store + toast

11. Press `Ctrl+Shift+S`
12. **Expected:** Navigate to Store + toast

13. Press `Ctrl+Shift+C`
14. **Expected:** Navigate to Community + toast

15. Press `Ctrl+Shift+B`
16. **Expected:** Navigate to Bookings + toast

**Shortcuts to Test:**
- [ ] Ctrl/Cmd+K (Toggle menu)
- [ ] Ctrl/Cmd+Shift+A (Admin)
- [ ] Ctrl/Cmd+Shift+H (Home)
- [ ] Ctrl/Cmd+Shift+N (NFT Store)
- [ ] Ctrl/Cmd+Shift+S (Store)
- [ ] Ctrl/Cmd+Shift+C (Community)
- [ ] Ctrl/Cmd+Shift+B (Bookings)

**Status:** [ ] Pass [ ] Fail

---

### Test 10: Navigation & UI

**Objective:** Test dashboard navigation and responsiveness

**Steps:**
1. From Admin Dashboard, click "Overview" tab
2. **Expected:** Shows dashboard cards
3. Click on "Home" card
4. **Expected:** Navigates to Home config tab
5. Click sidebar "Store"
6. **Expected:** Shows Store config
7. Test on mobile viewport (resize browser to 375px width)
8. **Expected:** Sidebar adapts, cards stack vertically
9. Click AdminQuickAccess button (bottom right on desktop, bottom center on mobile)
10. **Expected:** Menu opens with all options

**Status:** [ ] Pass [ ] Fail

---

### Test 11: Error Handling

**Objective:** Test error scenarios

**Steps:**
1. Disconnect from Supabase (stop Supabase locally)
2. Try to save a config
3. **Expected:** Red error toast appears
4. Reconnect to Supabase
5. Try save again
6. **Expected:** Success toast

7. Log out admin account
8. Try to navigate to `/admin`
9. **Expected:** Redirect to login

**Status:** [ ] Pass [ ] Fail

---

### Test 12: Real-time Updates (if multiple admins)

**Objective:** Test config updates across sessions

**Steps:**
1. Open Admin Dashboard in two browser windows
2. Both logged in as admin
3. In Window 1, change Home title
4. Save in Window 1
5. Check Window 2
6. **Expected:** Window 2 updates automatically (via Supabase subscription)

**Status:** [ ] Pass [ ] Fail [ ] N/A

---

## Test Results Summary

Test | Status | Notes
-----|--------|------
Admin Access Control | [ ] |
Home Configuration | [ ] |
Bookings Configuration | [ ] |
Resources Configuration | [ ] |
Demo Configuration | [ ] |
Press Kit Configuration | [ ] |
Live Stream Configuration | [ ] |
Airdrop Configuration | [ ] |
Keyboard Shortcuts | [ ] |
Navigation & UI | [ ] |
Error Handling | [ ] |
Real-time Updates | [ ] |

**Overall Status:** [ ] All Pass [ ] Some Failed [ ] Not Tested

---

## Bug Report Template

If any test fails, document here:

**Test Failed:** [Test name]  
**Expected Behavior:** [What should happen]  
**Actual Behavior:** [What actually happened]  
**Steps to Reproduce:** [Exact steps]  
**Console Errors:** [Any errors in console]  
**Screenshots:** [Attach if relevant]

---

## Sign-off

**Tester Name:** _______________  
**Date:** _______________  
**Environment:** [ ] Local [ ] Staging [ ] Production  
**Browser:** _______________  
**Device:** _______________
