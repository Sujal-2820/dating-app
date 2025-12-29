# Permission Management Implementation

## Overview
Implemented a comprehensive permission management system for Location, Camera, and Microphone access to ensure smooth video calling and location-based features.

## Implementation Details

### 1. Permission Hook (`usePermissions.ts`)
**Location**: `frontend/src/core/hooks/usePermissions.ts`

**Features**:
- Checks current permission status for camera, microphone, and location
- Provides methods to request individual or all permissions
- Returns permission states: 'granted', 'denied', 'prompt', or 'unknown'
- Handles browser compatibility gracefully

**Key Methods**:
- `checkPermissions()` - Queries current permission status
- `requestLocationPermission()` - Triggers system location prompt
- `requestMediaPermissions()` - Triggers system camera/mic prompt
- `requestAllPermissions()` - Requests all permissions in sequence

### 2. Permission Request Modal (`PermissionRequestModal.tsx`)
**Location**: `frontend/src/shared/components/PermissionRequestModal.tsx`

**Features**:
- Shows on first app open (tracked via localStorage)
- Beautiful UI explaining why each permission is needed
- Displays location, camera, and microphone permissions with icons
- Privacy notice to reassure users
- "Enable Permissions" button triggers system prompts
- "Skip for now" option for users who want to grant later
- Error handling with user-friendly messages

**User Flow**:
1. User opens app for the first time
2. Modal appears explaining permissions needed
3. User clicks "Enable Permissions"
4. Browser shows system prompts for Location → Camera → Microphone
5. Modal closes after completion (regardless of grant/deny)
6. Modal won't show again (localStorage flag set)

### 3. Dashboard Integration

**Male Dashboard** (`MaleDashboard.tsx`):
- Shows `PermissionRequestModal` on first visit
- Checks `localStorage.getItem('matchmint_permissions_requested')`
- Sets flag after user interacts with modal

**Female Dashboard** (`FemaleDashboard.tsx`):
- Same implementation as Male Dashboard
- Ensures both user types get permission prompts

### 4. Video Call Permission Check (`VideoCallModal.tsx`)

**Just-in-Time Permission Request**:
- When user receives incoming video call
- Clicking "Accept" triggers `handleAcceptCall()`
- Function checks camera/microphone access before connecting
- If permissions denied, shows error message inline
- User can try again after granting permissions in browser settings

**Features**:
- Loading spinner while checking permissions
- Clear error messages for different failure scenarios:
  - Permission denied
  - No camera/microphone found
  - Generic access failure
- Buttons disabled during permission check
- Error displayed in red banner above action buttons

## Permission Flow

### First App Open
```
User opens app
    ↓
Dashboard loads
    ↓
Check localStorage for 'matchmint_permissions_requested'
    ↓
If NOT found → Show PermissionRequestModal
    ↓
User clicks "Enable Permissions"
    ↓
System prompts: Location → Camera → Microphone
    ↓
Set localStorage flag
    ↓
Modal closes
```

### Incoming Video Call
```
Video call rings
    ↓
User clicks "Accept"
    ↓
Check camera/microphone permissions
    ↓
If GRANTED → Connect call immediately
    ↓
If DENIED → Show error message
    ↓
User can grant in browser settings and retry
```

## Technical Implementation

### Browser Permission API
- Uses `navigator.permissions.query()` to check status
- Uses `navigator.geolocation.getCurrentPosition()` for location
- Uses `navigator.mediaDevices.getUserMedia()` for camera/mic
- Handles browser compatibility (some browsers don't support permission queries)

### Error Handling
- Graceful fallback for unsupported browsers
- Specific error messages for different failure types
- Non-blocking - app works even if permissions denied

### User Experience
- **Non-intrusive**: Modal only shows once
- **Clear**: Explains why each permission is needed
- **Flexible**: Users can skip and grant later
- **Secure**: Shows privacy notice
- **Just-in-time**: Video calls re-prompt if needed

## Files Modified/Created

### Created:
1. `frontend/src/core/hooks/usePermissions.ts`
2. `frontend/src/shared/components/PermissionRequestModal.tsx`

### Modified:
1. `frontend/src/module/male/pages/MaleDashboard.tsx`
2. `frontend/src/module/female/pages/FemaleDashboard.tsx`
3. `frontend/src/shared/components/VideoCallModal.tsx`

## Testing Checklist

- [ ] First app open shows permission modal
- [ ] Clicking "Enable Permissions" triggers system prompts
- [ ] Granting all permissions works correctly
- [ ] Denying permissions shows appropriate errors
- [ ] "Skip for now" closes modal and sets flag
- [ ] Modal doesn't show on subsequent visits
- [ ] Incoming video call prompts for permissions if not granted
- [ ] Permission error messages display correctly
- [ ] Accept button shows loading state during permission check
- [ ] Call connects successfully after granting permissions
- [ ] Clear localStorage to reset and test again

## Browser Compatibility

**Supported**:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Chrome/Safari

**Notes**:
- Some browsers don't support `navigator.permissions.query()` for camera/mic
- Fallback: Assume 'prompt' state and let getUserMedia handle it
- Location permission works across all modern browsers
