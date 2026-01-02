# SweetBox Builder - Progressive Web App

A mobile-first PWA for building custom Arabic sweets gift boxes with drag-and-drop functionality.

## Features

- **Mobile-First Design**: Optimized for mobile devices with RTL support
- **Box Builder**: Visual drag-and-drop interface to fill a 30cm gift box
- **Real-Time Calculations**: Live price, weight, and fill percentage tracking
- **Interactive Menu**: Zoomable price list with pinch-to-zoom and pan capabilities
- **WhatsApp Integration**: Direct order submission via WhatsApp
- **Progressive Web App**: Installable on mobile devices with offline support
- **Cream & Chocolate Theme**: Premium design with #FDF8E7 background and #8B5A2B accents

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations & interactions)
- Lucide React (icons)
- PWA Plugin

## Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx      # Main landing page with CTAs
│   ├── BoxBuilder.tsx        # Drag & drop box builder
│   ├── CheckoutModal.tsx     # Order form & WhatsApp integration
│   ├── ContactModal.tsx      # Contact information modal
│   ├── MenuModal.tsx         # Price list modal with menu images
│   └── ZoomableImage.tsx     # Interactive image viewer with zoom/pan
├── data/
│   └── sweets.ts            # Sweets data with dimensions & pricing
├── types/
│   └── index.ts             # Shared TypeScript types
├── App.tsx                  # Main app with routing
└── index.css                # Global styles & theme

public/assets/
├── sweets/                  # Sweet row images
│   ├── harissa-nuts copy copy.png
│   ├── halawet-jibn copy copy.png
│   ├── harissa-nutella copy copy.png
│   ├── cocoa-fingers copy copy.png
│   └── greek copy copy.png
└── menu/                    # Menu images
    ├── menu1.jpg
    └── menu2.jpg
```

## Images

### Sweet Images (Already Added)
Sweet row images are in place at `public/assets/sweets/`:
- `harissa-nuts copy copy.png` ✓
- `halawet-jibn copy copy.png` ✓
- `harissa-nutella copy copy.png` ✓
- `cocoa-fingers copy copy.png` ✓
- `greek copy copy.png` ✓

### Menu Images (Already Added)
Menu images are in place at:
- `public/assets/menu/menu1.jpg` ✓
- `public/assets/menu/menu2.jpg` ✓

## UI Features

**Text-Only Selection Buttons**: The sweet selection interface uses clean, text-based buttons showing:
- Sweet name in Arabic
- Price in JOD
- Weight in grams
- Width in cm
- Plus (+) icon to add to box

**Visual Box Builder**: Once added to the box, items display as actual product images stacked horizontally, showing exactly what the box will look like.

## Interactive Menu Features

The price list modal includes:
- **Pinch-to-Zoom**: Use two fingers to zoom in/out on mobile devices
- **Double-Tap**: Double-tap to zoom 2x, double-tap again to reset
- **Pan/Drag**: When zoomed, drag to move around the image
- **Zoom Buttons**: Use +/- buttons to zoom in/out
- **Scroll**: Scroll vertically between the two menu pages
- **Zoom Indicator**: Shows current zoom percentage

## Box Logic

- **Box Width**: 30cm (fillable area)
- **Base Price**: 1.00 JOD (empty box)
- **Minimum Fill**: 85% (25.5cm) required to checkout
- **Item Stacking**: Horizontal (side-by-side like slices)

## Sweets Data

All sweets are defined in `src/data/sweets.ts`:

1. هريسة بالمكسرات - 5.5cm, 225g, 5.5 JOD
2. حلاوة الجبن - 5.5cm, 190g, 5.5 JOD
3. هريسة نوتيلا - 7.0cm, 150g, 7.0 JOD
4. أصابع كاجو - 6.5cm, 160g, 6.5 JOD
5. يونانية - 6.5cm, 220g, 6.5 JOD

## Development

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
npm run preview
```

## WhatsApp Configuration

Orders are sent to: 962781506347

The message format includes:
- Customer name
- Phone number
- Order type (Pickup/Delivery)
- Box contents with quantities
- Total weight and price

## Contact Information

- **Phone**: 0781506347
- **Location**: https://maps.app.goo.gl/KRm4FWHXghgEp5Fv7

## PWA Configuration

The app is configured as a PWA with:
- RTL direction
- Arabic language
- Custom theme colors
- Offline support
- Installable on home screen

Icon files needed in `public/`:
- `pwa-192x192.png`
- `pwa-512x512.png`

## Color Palette

- **Cream**: #FDF8E7 (Background)
- **Coffee**: #4A3B32 (Text)
- **Bronze**: #8B5A2B (Accents)
