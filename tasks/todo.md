# Fix Navbar Dropdown - All 32 Pages

## Problems
1. **Transparent background** - hero image bleeds through dropdown
2. **Columns not separated** - HEDGES and WALLS & MORE blend together

## Solution
1. Change `rgba(10, 18, 14, 0.97)` → `rgb(10, 18, 14)` (solid background)
2. Add `border-right: 1px solid rgba(255,255,255,0.08)` to `.lsfs-dropdown-section`
3. Add `:last-child` rule to remove border from rightmost column

## Todo Items
- [x] Fix solid background in all 32 files
- [x] Add column divider CSS to all 32 files
- [x] Verify changes in browser

---

## Review Section

### Changes Made
| Change | Before | After |
|--------|--------|-------|
| Dropdown background | `rgba(10, 18, 14, 0.97)` | `rgb(10, 18, 14)` (solid) |
| Column divider | None | `border-right: 1px solid rgba(255,255,255,0.08)` |
| Last column | N/A | `border-right: none` (no border on rightmost) |

### Files Modified
32 HTML files updated (all pages with embedded navbar)

### Impact
- Dropdown menu now has solid dark background (no hero bleed-through)
- Subtle vertical divider between HEDGES and WALLS & MORE columns
- Locations dropdown (3 columns) will have dividers between all columns
- No other code affected
