# Dappled Light Effect Implementation

This document describes the custom styling and transition effects inspired by [jackyzha0's personal website](https://github.com/jackyzha0/jackyzha0.github.io).

## What Was Implemented

### 1. **Smooth Theme Transitions**
- Beautiful sunrise/sunset animations when switching between light and dark modes
- Background color gradually transitions through dawn, morning, day, evening, dusk, and night colors
- Animation triggers automatically when theme changes

### 2. **Grainy Noise Effect** ⭐ NEW
- Film grain / noise texture overlay for a more organic, tactile feel
- Animated grain that shifts subtly (8-second loop)
- **Single CSS variable control**: `--grain-intensity` (range: 0.0 - 1.0)
- Uses SVG fractal noise for authentic texture
- Blend mode creates subtle depth without being distracting

### 3. **Fade-In Animations**
- Page elements fade in sequentially when loading
- Creates a polished, professional appearance
- Different animation timing for light vs dark mode

### 3. **Dappled Light Effect**
- Simulates light filtering through leaves
- Includes animated leaf shadows with perspective and 3D transforms
- Adds depth with progressive blur layers
- Features bouncing light effects
- Window blind shutters that adjust based on theme

### 4. **3D Perspective Effects**
- Leaves image with billowing animation (8-second loop)
- Transform matrix creates realistic perspective
- Different opacity and positioning for light/dark modes

## Files Modified

### 1. **quartz/styles/custom.scss**
Added comprehensive styling including:
- CSS animations (`@keyframes fade`, `fade2`, `sunrise`, `sunset`, `billow`)
- Dappled light container with all sub-elements
- Theme-specific color variables
- Responsive animations tied to `[saved-theme]` attribute

### 2. **quartz/components/renderPage.tsx**
- Created `DappledLight()` component function
- Added component to page body (before `#quartz-root`)
- Includes all necessary HTML structure for the effect

### 3. **quartz/components/scripts/darkmode.inline.ts**
- Added `animation-ready` class to body when theme changes
- Triggers animations on theme toggle

## Required Asset

### leaves.png (or alternative SVG)
You need to add a decorative image to the `quartz/static/` folder.

**Options:**
1. **Download original leaves**: Visit [jackyzha0's repo](https://github.com/jackyzha0/jackyzha0.github.io/tree/main/quartz/static) and save `leaves.png`
2. **Use the placeholder**: A basic `leaves.svg` has been created for you
3. **Create your own**: See suggestions below

### Alternative SVG Ideas

Instead of leaves, here are other natural elements that work beautifully:

#### 🌿 Nature Themes
- **Cherry Blossoms / Sakura petals** - Delicate, romantic aesthetic
- **Bamboo stalks** - Clean, zen minimalist look
- **Pine needles** - Sharp, geometric natural forms
- **Ferns / tropical leaves** - Bold, modern botanical
- **Maple leaves** - Autumn/seasonal feeling
- **Willow branches** - Flowing, elegant lines

#### ☁️ Abstract / Atmospheric
- **Clouds** - Soft, dreamy atmosphere
- **Smoke wisps** - Ethereal, mysterious
- **Water ripples** - Calm, flowing movement
- **Mountain silhouettes** - Bold, geometric
- **Abstract organic shapes** - Modern, artistic

#### ✨ Geometric / Architectural
- **Window lattice/grid** - Urban, structured
- **Islamic geometric patterns** - Intricate, cultural
- **Honeycomb / hexagons** - Modern, tech-inspired
- **Stained glass patterns** - Colorful, artistic
- **Circuit board traces** - Tech, digital aesthetic

#### 🌙 Celestial
- **Stars and constellations** - Night sky theme
- **Moon phases** - Mystical, cosmic
- **Nebula clouds** - Space, sci-fi aesthetic

**Best practices for custom SVGs:**
- Keep opacity low (10-20%)
- Use simple silhouettes, not detailed illustrations
- Size: 1600x1400px recommended
- Transparent background works best
- Black shapes that cast shadows

To replace the leaves, update the path in `custom.scss`:
```scss
#leaves {
  background-image: url("/static/your-custom-image.png");
}
```

## How It Works

### Theme Change Sequence
1. User clicks darkmode toggle
2. `saved-theme` attribute changes on `<html>` element
3. `animation-ready` class added to `<body>`
4. CSS animations trigger:
   - Background color transitions (sunrise/sunset)
   - Shutter height changes
   - Leaf perspective shifts
   - Opacity adjustments

### Animation Layers
The effect uses multiple layers:
1. **Base color**: Animated background gradient
2. **Glow layers**: Two light sources that shift
3. **Leaves**: 3D-transformed, billowing image
4. **Blinds**: Horizontal shutters that expand/contract
5. **Blur layers**: Progressive backdrop blur for depth

### CSS Variables
Custom variables for time-of-day colors:
- `--day`, `--morning`, `--evening`, `--dusk`, `--dawn`, `--night`
- `--shadow`: Shutter/bar color
- `--bounce-light`: Light reflection color
- `--timing-fn`: Easing function for transitions

## Customization

### Adjust Grain Intensity
The grain effect is controlled by a **single CSS variable**:
```scss
#dappled-light {
  --grain-intensity: 0.5;  // Default
}
```

**Recommended values:**
- `0.0` - No grain (completely smooth)
- `0.3` - Subtle, barely noticeable
- `0.5` - Balanced (default)
- `0.7` - Pronounced texture
- `1.0` - Maximum grain effect

You can even make it theme-specific:
```scss
[saved-theme="dark"] #dappled-light {
  --grain-intensity: 0.7;  // More grain in dark mode
}

[saved-theme="light"] #dappled-light {
  --grain-intensity: 0.4;  // Less grain in light mode
}
```

### Adjust Animation Speed
In `custom.scss`, modify animation durations:
```scss
body.animation-ready & {
  animation-duration: 1s;  // Change sunrise speed
}

[saved-theme="dark"] body.animation-ready & {
  animation-duration: 1.5s;  // Change sunset speed
}
```

### Change Colors
Edit color variables in `#dappled-light`:
```scss
--day: #fffdfa;      // Light mode background
--night: #0f131c;    // Dark mode background
--evening: #fccc83;  // Sunset color
// etc.
```

### Modify Perspective
Adjust 3D transform in `.perspective`:
```scss
transform: matrix3d(0.75, -0.0625, 0, 0.0008, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
```

### Disable Effect
To remove the effect entirely:
1. Delete `<DappledLight />` from `renderPage.tsx`
2. Remove or comment out the `#dappled-light` section in `custom.scss`

## Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Uses `backdrop-filter` (may have reduced effect in older browsers)
- Gracefully degrades - page remains functional without effects

## Performance
- Lightweight - CSS-only animations
- Uses hardware acceleration (`transform`, `opacity`)
- `pointer-events: none` ensures no interaction interference
- Fixed positioning avoids layout reflows

## Credits
Inspired by and adapted from [Jacky Zhao's personal website](https://jzhao.xyz/) ([GitHub](https://github.com/jackyzha0/jackyzha0.github.io)).
