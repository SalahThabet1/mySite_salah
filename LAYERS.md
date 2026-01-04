# Layer System Documentation

## Overview
The Quartz site now includes a configurable layer system for visual effects. You can control three distinct layers: grain, plum, and shutters.

## Configuration

Edit `quartz.config.ts` to configure the layers:

```typescript
layers: {
  grain: { 
    enabled: true,  // Toggle grain noise overlay
    zIndex: 9999    // Stacking order (higher = on top)
  },
  plum: { 
    enabled: true,  // Toggle plum branch animation
    zIndex: 1       // Stacking order
  },
  shutters: { 
    enabled: true,  // Toggle dappled light effect
    zIndex: 0       // Stacking order
  },
}
```

## Layer Descriptions

### Grain (Foreground)
- **Effect**: Subtle noise texture overlay
- **Default z-index**: 9999 (top layer)
- **Purpose**: Adds organic texture and reduces color banding
- **Implementation**: CSS `body::after` pseudo-element with SVG noise filter

### Plum (Middle)
- **Effect**: Animated tree branches growing from screen edges
- **Default z-index**: 1
- **Purpose**: Organic, artistic background animation
- **Implementation**: Canvas-based custom element with recursive branch drawing
- **Persistence**: Only generates once on initial load, persists through navigation

### Shutters (Background)
- **Effect**: Dappled light effect with animated shutters/blinds
- **Default z-index**: 0 (bottom layer)
- **Purpose**: Creates depth and visual interest with light/shadow patterns
- **Implementation**: CSS-animated gradient divs with sunrise/sunset cycles

## Usage Examples

### Disable all layers
```typescript
layers: {
  grain: { enabled: false, zIndex: 9999 },
  plum: { enabled: false, zIndex: 1 },
  shutters: { enabled: false, zIndex: 0 },
}
```

### Only plum animation
```typescript
layers: {
  grain: { enabled: false, zIndex: 9999 },
  plum: { enabled: true, zIndex: 1 },
  shutters: { enabled: false, zIndex: 0 },
}
```

### Reverse stacking order (plum on top)
```typescript
layers: {
  grain: { enabled: true, zIndex: 9999 },
  plum: { enabled: true, zIndex: 10000 },  // Above grain
  shutters: { enabled: true, zIndex: 0 },
}
```

## Technical Details

### Files Modified
- `quartz/components/renderPage.tsx`: Layer rendering logic
- `quartz/styles/custom.scss`: Layer styling and animations
- `quartz/cfg.ts`: Type definitions
- `quartz.config.ts`: User configuration

### Z-Index Management
The z-index values control the stacking order of layers:
- Higher values appear on top
- Negative values work but are not recommended
- Default values provide optimal visual hierarchy

### Performance Notes
- Plum animation uses Canvas API and may impact performance on lower-end devices
- Grain overlay is lightweight (SVG filter)
- Shutters use CSS animations (hardware accelerated)

### Browser Compatibility
All effects use standard web APIs and should work in modern browsers:
- Canvas API (for plum)
- CSS Custom Properties (for grain z-index)
- CSS animations (for shutters)
- Web Components (for plum custom element)
