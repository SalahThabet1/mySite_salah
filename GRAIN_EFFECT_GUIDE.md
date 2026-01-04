# Grain Effect Quick Reference

## 🎛️ Single Variable Control

The entire grain effect intensity is controlled by **one CSS variable**:

```scss
--grain-intensity: 0.5;  /* Range: 0.0 to 1.0 */
```

## 📍 Where to Change It

Open `quartz/styles/custom.scss` and find this line (~line 69):

```scss
#dappled-light {
  // ... other variables ...
  
  // Control grain intensity (0.0 = no grain, 1.0 = maximum grain)
  // Recommended range: 0.3 - 0.8
  --grain-intensity: 0.5;  // ← CHANGE THIS NUMBER
}
```

## 🎨 Recommended Values

| Value | Effect | Best For |
|-------|--------|----------|
| `0.0` | No grain | Clean, minimal designs |
| `0.3` | Subtle | Professional sites, portfolios |
| `0.5` | Balanced | General use (default) |
| `0.7` | Pronounced | Artistic, vintage aesthetic |
| `1.0` | Maximum | Strong film grain effect |

## 🌓 Theme-Specific Grain

Want different grain for light vs dark mode?

```scss
#dappled-light {
  --grain-intensity: 0.5;  // Default for light mode
}

[saved-theme="dark"] #dappled-light {
  --grain-intensity: 0.7;  // More grain in dark mode for atmosphere
}
```

## 🎬 How It Works

The grain effect uses:
- **SVG fractal noise** for authentic film grain texture
- **Overlay blend mode** to interact with colors below
- **Animated movement** (8s loop) for organic feel
- **Small tile size** (200x200px) for performance
- **10 animation steps** for subtle, non-distracting motion

## 🔧 Advanced Customization

### Change Grain Speed
```scss
&::after {
  animation: grain 8s steps(10) infinite;  // Change 8s to your preference
}
```

### Change Grain Size
```scss
&::after {
  background-size: 200px 200px;  // Smaller = finer grain, larger = coarser
}
```

### Change Blend Mode
```scss
&::after {
  mix-blend-mode: overlay;  // Try: multiply, soft-light, hard-light, screen
}
```

## 🚫 Disable Grain Completely

Set to zero or comment out the variable:
```scss
--grain-intensity: 0;
```

Or remove the `&::after` block entirely from `custom.scss`.

## 💡 Pro Tips

1. **Subtle is better** - Start at 0.3 and increase gradually
2. **Test both themes** - Grain looks different on light vs dark backgrounds
3. **Match your aesthetic** - More grain = vintage/analog feel, less grain = modern/clean
4. **Consider your content** - Photo-heavy sites might want less grain (0.2-0.4)
5. **Mobile performance** - Keep it reasonable (≤0.6) for smooth animations

## 🔄 Live Testing

1. Change the `--grain-intensity` value
2. Save the file
3. If running dev server (`npx quartz build --serve`), it will auto-reload
4. Toggle dark mode to see how it looks in both themes

---

**Need help?** Check the full implementation guide: `DAPPLED_LIGHT_IMPLEMENTATION.md`
