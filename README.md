# Simple Color Palette

[![CI](https://github.com/MatyeusM/simple-color-palette/actions/workflows/ci.yml/badge.svg)](https://github.com/MatyeusM/simple-color-palette/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**[🎨 Try it live on GitHub Pages](https://matyeusm.github.io/simple-color-palette/)**

A modern, OKLCH-based color palette generator for developers and designers. Generate beautiful color
harmonies with complementary, triadic, and analogous color schemes in seconds.

## ✨ Features

### Color Modes

- **OKLCH** - Perceptually uniform color space for precise color manipulation
- **HSL** - Classic hue, saturation, lightness
- **RGB** - Standard red, green, blue

### Color Harmonies

- **Base** - Lightness variations of your base color (19 shades)
- **Complementary** - Colors opposite on the color wheel
- **Triadic** - Three colors evenly spaced around the color wheel
- **Analogous** - Colors adjacent on the color wheel

### Output Color Spaces

- **sRGB** - Standard web colors
- **Display P3** - Wide gamut for modern displays
- **Rec.2020** - Ultra-wide gamut for future displays

### Export Options

- **JSON** - Export palettes as structured data
- **Markdown** - Human-readable documentation format

### Developer-Friendly Features

- 🖱️ **Click to copy** any color's hex value
- 📋 **Paste to set** base color from clipboard (supports hex, rgb(), oklch(), named colors)
- ♿ **Accessible** with full ARIA labels and keyboard navigation
- 📱 **Responsive** design for all screen sizes

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) LTS or latest
- [pnpm](https://pnpm.io/) 10 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/MatyeusM/simple-color-palette.git
cd simple-color-palette

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Visit `http://localhost:5173` to see the app running locally.

### Build for Production

```bash
pnpm run build
```

The built files will be in the `dist/` directory.

## 📖 Usage

1. **Choose a color mode** - Select OKLCH, HSL, or RGB
2. **Adjust the sliders** - Fine-tune your base color
3. **Preview palettes** - View all color harmonies automatically generated
4. **Click to copy** - Click any swatch to copy its hex value
5. **Paste colors** - Paste any valid color anywhere on the page to set it as base
6. **Select output space** - Choose sRGB, P3, or Rec.2020
7. **Export** - Download your palette as JSON or Markdown

## 🛠️ Tech Stack

- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[colorjs.io](https://colorjs.io/)** - Color manipulation library
- **CSS Variables** - Dynamic theming
- **OKLCH Color Space** - Perceptually uniform colors

## 📝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Make sure your code passes all checks:

```bash
pnpm run eslint
pnpm run prettier
pnpm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**MatyeusM**

- GitHub: [@MatyeusM](https://github.com/MatyeusM)

## 🙏 Acknowledgments

- [colorjs.io](https://colorjs.io/) for the excellent color manipulation library
- OKLCH color space for perceptually uniform color handling
- The web development community for inspiration

## 🔗 Links

- **[Live Demo](https://matyeusm.github.io/simple-color-palette/)**
- **[Report Bug](https://github.com/MatyeusM/simple-color-palette/issues)**
- **[Request Feature](https://github.com/MatyeusM/simple-color-palette/issues)**

---

Made with ❤️ for developers who need simple, beautiful color palettes
