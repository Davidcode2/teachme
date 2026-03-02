# MyMaterials Component Regression Tests

## Bug: Navigation causes "cannot access property material of undefined"

### Issue
When navigating between routes:
1. `/materials/mine/bought` 
2. `/materials/mine/workspace`
3. Back to `/materials/mine/bought`

The app crashes with: "can't access property material j is undefined"

### Root Cause
The `getMaterial` helper function didn't handle undefined items in the searchResults array:
```typescript
const getMaterial = (el: any): Material => {
  return el.material || el;  // Crashes if el is undefined!
};
```

When navigating between routes, the global searchResults state can contain undefined values.

### Fix Applied
1. Added `.filter(Boolean)` to remove undefined/null items:
   ```typescript
   const safeSearchResults = (Array.isArray(searchResults) ? searchResults : []).filter(Boolean);
   ```

2. Made `getMaterial` return null for undefined:
   ```typescript
   const getMaterial = (el: any): Material | null => {
     if (!el) return null;
     return el.material || el;
   };
   ```

3. Added null check in render:
   ```typescript
   const material = getMaterial(el);
   return material ? <Card key={material.id || index} material={material} /> : null;
   ```

## Manual Regression Test Steps

### Test 1: Navigation Between Mine Routes
1. Login to the application
2. Navigate to `/materials/mine/bought`
3. Verify materials load correctly
4. Click on "Erstellt" tab (navigates to `/materials/mine/workspace`)
5. Verify materials load correctly
6. Click on "Gekauft" tab (navigates back to `/materials/mine/bought`)
7. **Expected**: Materials load without errors
8. **Before fix**: Error "can't access property material of undefined"

### Test 2: Rapid Navigation
1. Login to the application
2. Rapidly switch between "Gekauft" and "Erstellt" tabs 5+ times
3. **Expected**: No errors, smooth navigation

### Test 3: Search and Navigate
1. Login to the application
2. Search for a term in the search bar
3. Navigate to `/materials/mine/bought`
4. Clear the search
5. Navigate between tabs
6. **Expected**: No errors at any point

### Test 4: Empty States
1. Login with a user that has no bought materials
2. Navigate to `/materials/mine/bought`
3. Should show "NoData" component
4. Navigate to `/materials/mine/workspace`
5. Navigate back to `/materials/mine/bought`
6. **Expected**: Still shows "NoData" without errors

## Automated Test (When Test Framework Added)

```typescript
// TODO: Add when vitest/jest is configured
import { describe, it, expect } from 'vitest';
import { getMaterial } from './myMaterials';

describe('getMaterial helper', () => {
  it('should return null for undefined', () => {
    expect(getMaterial(undefined)).toBeNull();
  });

  it('should return null for null', () => {
    expect(getMaterial(null)).toBeNull();
  });

  it('should extract material from MaterialWithThumbnail', () => {
    const material = { id: '1', title: 'Test' };
    const item = { material, thumbnail: null };
    expect(getMaterial(item)).toBe(material);
  });

  it('should return Material directly', () => {
    const material = { id: '1', title: 'Test' };
    expect(getMaterial(material)).toBe(material);
  });
});

describe('safeSearchResults filtering', () => {
  it('should filter out undefined items', () => {
    const results = [undefined, { id: '1' }, null, { id: '2' }];
    const safe = results.filter(Boolean);
    expect(safe).toHaveLength(2);
    expect(safe[0]).toEqual({ id: '1' });
  });
});
```

## Related Components
- `myMaterials.tsx` - Fixed
- `searchResults.tsx` - May have similar issue, check if fix needed there too
