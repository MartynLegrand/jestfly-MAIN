# Community System Test Matrix

## Overview
This document provides a comprehensive test matrix for the JestFly Community system, covering functional, integration, performance, and security testing.

---

## 1. Posts & Feed Testing

### 1.1 Post Creation
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Create text-only post | 1. Open CreatePostModal<br>2. Enter text<br>3. Click Post | Post appears in feed | ⬜ |
| Create post with single image | 1. Open CreatePostModal<br>2. Enter text<br>3. Upload 1 image<br>4. Click Post | Post with image appears | ⬜ |
| Create post with multiple images | 1. Upload 4 images | All 4 images display in grid | ⬜ |
| Exceed image limit | 1. Try to upload 5 images | Error message shown | ⬜ |
| Create post with hashtags | 1. Enter text with #hashtags | Hashtags are clickable | ⬜ |
| Create post with mentions | 1. Enter text with @username | Mention creates notification | ⬜ |
| Empty post submission | 1. Click Post without content | Validation error shown | ⬜ |
| Max character limit | 1. Enter 5000+ characters | Character counter, limit enforced | ⬜ |
| Post with large image | 1. Upload 15MB image | Error or auto-resize | ⬜ |
| Post visibility settings | 1. Set to 'followers only'<br>2. Post | Only followers see post | ⬜ |

### 1.2 Feed Loading
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Load initial feed | 1. Navigate to /community/feed | First 20 posts load | ⬜ |
| Infinite scroll | 1. Scroll to bottom | Next batch loads automatically | ⬜ |
| Empty feed state | 1. New user, no posts | "No posts yet" message | ⬜ |
| Feed refresh | 1. Pull to refresh (mobile) | New posts appear at top | ⬜ |
| Filter by following | 1. Switch to "Following" tab | Only following posts shown | ⬜ |
| Filter by hashtag | 1. Click hashtag | Posts with that tag shown | ⬜ |
| Feed performance | 1. Load feed | <3 seconds load time | ⬜ |

### 1.3 Post Interactions
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Like post | 1. Click heart icon | Like count increases, heart fills | ⬜ |
| Unlike post | 1. Click heart again | Like count decreases, heart empties | ⬜ |
| Comment on post | 1. Click comment icon | Comment modal opens | ⬜ |
| Share post | 1. Click share icon | Native share or copy link | ⬜ |
| Bookmark post | 1. Click bookmark icon | Post saved to bookmarks | ⬜ |
| View post details | 1. Click post content | Full post view opens | ⬜ |
| Report post | 1. Click report button<br>2. Submit report | Report submitted, toast shown | ⬜ |
| Pin post (admin) | 1. Admin clicks pin | Post pinned at top | ⬜ |

### 1.4 Post Management
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Edit own post | 1. Click edit<br>2. Update content<br>3. Save | Post updated, "edited" flag | ⬜ |
| Delete own post | 1. Click delete<br>2. Confirm | Post removed from feed | ⬜ |
| Cannot edit others' posts | 1. Try to edit another user's post | Edit button not visible | ⬜ |
| Cannot delete others' posts | 1. Try to delete another user's post | Delete button not visible | ⬜ |

---

## 2. Comments Testing

### 2.1 Comment Creation
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Add comment | 1. Open post<br>2. Type comment<br>3. Submit | Comment appears | ⬜ |
| Empty comment | 1. Submit without text | Validation error | ⬜ |
| Max character limit | 1. Enter 2000+ characters | Limit enforced | ⬜ |
| Reply to comment | 1. Click reply<br>2. Add comment | Nested reply shown | ⬜ |
| Comment with mention | 1. Add @username in comment | User gets notification | ⬜ |
| Comment with image | 1. Upload image with comment | Image displays | ⬜ |

### 2.2 Comment Interactions
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Like comment | 1. Click heart on comment | Like count increases | ⬜ |
| Unlike comment | 1. Click heart again | Like count decreases | ⬜ |
| Edit own comment | 1. Click edit<br>2. Update<br>3. Save | Comment updated | ⬜ |
| Delete own comment | 1. Click delete<br>2. Confirm | Comment removed | ⬜ |
| Report comment | 1. Click report<br>2. Submit | Report submitted | ⬜ |

### 2.3 Comment Display
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Load comments | 1. Open post | Comments load | ⬜ |
| Comment pagination | 1. Post with 50+ comments | Paginated/load more | ⬜ |
| Nested replies display | 1. View reply thread | Indentation shows nesting | ⬜ |
| Comment timestamps | 1. Check timestamps | Relative time (e.g., "2h ago") | ⬜ |

---

## 3. Follows & Social Graph

### 3.1 Following Users
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Follow user | 1. Click follow button | Button changes to "Following" | ⬜ |
| Unfollow user | 1. Click unfollow | Button changes to "Follow" | ⬜ |
| Cannot follow self | 1. Try to follow own profile | Follow button not shown | ⬜ |
| Follow notification | 1. User A follows User B | User B gets notification | ⬜ |
| Following count | 1. Follow multiple users | Count updates correctly | ⬜ |
| Followers count | 1. Get followed by users | Count updates correctly | ⬜ |

### 3.2 Following Feed
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View following feed | 1. Switch to "Following" tab | Only followed users' posts | ⬜ |
| Empty following feed | 1. Don't follow anyone | "Follow users to see posts" | ⬜ |
| Real-time following updates | 1. Follow user<br>2. Check feed | Their posts appear | ⬜ |

---

## 4. Notifications Testing

### 4.1 Notification Generation
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Like notification | 1. User A likes User B's post | User B gets notification | ⬜ |
| Comment notification | 1. User A comments on User B's post | User B gets notification | ⬜ |
| Follow notification | 1. User A follows User B | User B gets notification | ⬜ |
| Mention notification | 1. User A mentions User B | User B gets notification | ⬜ |
| Reply notification | 1. User A replies to User B's comment | User B gets notification | ⬜ |
| No self-notification | 1. Like own post | No notification generated | ⬜ |

### 4.2 Notification Display
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View notifications | 1. Click notification bell | Dropdown shows notifications | ⬜ |
| Unread count | 1. Check bell icon | Badge shows unread count | ⬜ |
| Mark as read | 1. Click notification | Marked as read, badge updates | ⬜ |
| Mark all as read | 1. Click "Mark all read" | All marked, badge clears | ⬜ |
| Delete notification | 1. Click delete | Notification removed | ⬜ |
| Notification link | 1. Click notification | Navigate to related post | ⬜ |
| Real-time delivery | 1. User A likes post | User B sees immediately | ⬜ |

---

## 5. Moderation Testing

### 5.1 Content Reporting
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Report post | 1. Click report<br>2. Select reason<br>3. Submit | Report created | ⬜ |
| Report comment | 1. Click report<br>2. Select reason<br>3. Submit | Report created | ⬜ |
| Add report details | 1. Enter additional details | Details saved | ⬜ |
| View reports (admin) | 1. Admin opens moderation tab | All reports listed | ⬜ |

### 5.2 Content Moderation (Admin)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Approve post | 1. Click approve | Post status = approved | ⬜ |
| Reject post | 1. Click reject | Post hidden | ⬜ |
| Delete post | 1. Click delete<br>2. Confirm | Post permanently deleted | ⬜ |
| Pin post | 1. Click pin | Post pinned at top | ⬜ |
| Unpin post | 1. Click unpin | Post unpinned | ⬜ |
| Approve comment | 1. Click approve | Comment visible | ⬜ |
| Reject comment | 1. Click reject | Comment hidden | ⬜ |
| Delete comment | 1. Click delete | Comment deleted | ⬜ |

### 5.3 Report Management
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Review report | 1. Admin clicks "Take Action" | Report marked as reviewed | ⬜ |
| Dismiss report | 1. Admin clicks "Dismiss" | Report marked as dismissed | ⬜ |
| Multiple reports | 1. Multiple users report same post | All reports linked | ⬜ |

---

## 6. Performance Testing

### 6.1 Load Times
| Test Case | Target | Status |
|-----------|--------|--------|
| Feed initial load | <3 seconds | ⬜ |
| Post creation | <2 seconds | ⬜ |
| Comment load | <1.5 seconds | ⬜ |
| Image upload | <5 seconds | ⬜ |
| Notification delivery | <1 second | ⬜ |

### 6.2 Stress Testing
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| 100 posts in feed | 1. Load feed with 100+ posts | Smooth scrolling | ⬜ |
| 50 comments on post | 1. Load post with 50+ comments | Paginated loading | ⬜ |
| 10 concurrent users | 1. Simulate 10 users posting | No errors | ⬜ |
| Rapid likes | 1. Like 20 posts quickly | All register correctly | ⬜ |

### 6.3 Bundle Size
| Metric | Target | Status |
|--------|--------|--------|
| Total bundle size | <2.5 MB | ⬜ |
| Community chunk | <500 KB | ⬜ |
| Lazy loading | Active | ⬜ |

---

## 7. Security Testing

### 7.1 Authentication
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Logged out user | 1. Access community without login | Redirect to login | ⬜ |
| Post without auth | 1. API call without token | 401 Unauthorized | ⬜ |
| Session expired | 1. Session expires<br>2. Try to post | Re-authentication required | ⬜ |

### 7.2 Authorization (RLS)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Read own posts | 1. User queries own posts | Allowed | ⬜ |
| Read public posts | 1. User queries public posts | Allowed | ⬜ |
| Read private posts | 1. User queries others' private posts | Denied | ⬜ |
| Update own post | 1. User updates own post | Allowed | ⬜ |
| Update others' post | 1. User updates another's post | Denied | ⬜ |
| Delete own post | 1. User deletes own post | Allowed | ⬜ |
| Delete others' post | 1. User deletes another's post | Denied | ⬜ |
| Admin moderation | 1. Admin moderates any post | Allowed | ⬜ |
| Non-admin moderation | 1. Regular user tries to moderate | Denied | ⬜ |

### 7.3 Input Validation
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| XSS in post content | 1. Enter `<script>alert('xss')</script>` | Sanitized/escaped | ⬜ |
| SQL injection | 1. Enter SQL in search | Parameterized query safe | ⬜ |
| Malicious image | 1. Upload .exe renamed to .jpg | Rejected | ⬜ |
| Oversized file | 1. Upload 50MB image | Rejected | ⬜ |

---

## 8. Mobile Responsiveness

### 8.1 Layout
| Test Case | Device | Status |
|-----------|--------|--------|
| Feed view | Mobile (375px) | ⬜ |
| Post creation | Mobile | ⬜ |
| Comment thread | Mobile | ⬜ |
| Notification center | Mobile | ⬜ |
| Moderation tab | Tablet (768px) | ⬜ |

### 8.2 Touch Interactions
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Swipe to refresh | 1. Pull down on feed | Feed refreshes | ⬜ |
| Tap to like | 1. Tap heart icon | Like registered | ⬜ |
| Long press menu | 1. Long press post | Context menu opens | ⬜ |

---

## 9. Accessibility

### 9.1 Keyboard Navigation
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Tab through feed | 1. Press Tab | Focus moves logically | ⬜ |
| Submit post (Enter) | 1. Type post<br>2. Press Enter | Post submitted | ⬜ |
| Close modal (Esc) | 1. Open modal<br>2. Press Esc | Modal closes | ⬜ |

### 9.2 Screen Reader
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Post content | 1. Navigate to post | Content read aloud | ⬜ |
| Button labels | 1. Navigate to buttons | Labels clear | ⬜ |
| Image alt text | 1. Navigate to image | Alt text read | ⬜ |

---

## 10. Integration Testing

### 10.1 Cross-Module Integration
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Profile link from post | 1. Click author name | Navigate to profile | ⬜ |
| NFT showcase in post | 1. Share NFT in post | NFT card displays | ⬜ |
| Store product in post | 1. Mention product | Product link works | ⬜ |

### 10.2 Real-time Sync
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| New post appears | 1. User A creates post<br>2. User B on feed | Post appears in real-time | ⬜ |
| Like count updates | 1. User A likes<br>2. User B viewing | Count updates live | ⬜ |
| Notification arrives | 1. User A likes B's post | Notification appears live | ⬜ |

---

## Test Execution Guidelines

1. **Priority Levels**
   - P0: Critical functionality (must pass)
   - P1: Important features (should pass)
   - P2: Nice-to-have (can defer)

2. **Test Environments**
   - Local development
   - Staging server
   - Production

3. **Browser Coverage**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)
   - Mobile Safari (iOS)
   - Chrome Mobile (Android)

4. **Test Data**
   - Use seed data for consistency
   - Create test users with various roles
   - Clean up after testing

5. **Reporting**
   - Document all failures with screenshots
   - Log steps to reproduce
   - Assign priority and owner
   - Track in issue tracker

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Developer | | | |
| Product Owner | | | |
| Community Manager | | | |
