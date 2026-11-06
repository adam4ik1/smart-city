# NEON GRID — AI-Powered Smart City 2035

An interactive 3D smart-city project for the **AI in Business & Technology** track.

## Features

- Full 3D city built with Three.js.
- 360° orbit controls: drag to rotate, scroll/pinch to zoom, right-drag to pan.
- Clickable buildings with contextual information panels and AI insights.
- Nine interactive facilities: AI Control Center, Smart Business Tower, Digital Bank, Smart Factory, AI Medical Center, Green Energy Hub, Smart University, Autonomous Transit Hub and Quantum Data Center.
- Animated autonomous traffic, wind turbines, glowing city grid and building lighting.
- City KPI dashboard, energy distribution and business analytics panels.
- Day/night simulation and reset-camera control.
- Responsive layout for desktop and mobile.

## Run locally

This project uses ES modules and loads Three.js from jsDelivr, so run it through a local web server (do not open `index.html` directly as a `file://` URL).

### Option A — Python

1. Install Python 3 if it is not already installed.
2. Open Terminal in this folder.
3. Run:

   ```bash
   python3 -m http.server 8000
   ```
4. Open http://localhost:8000 in your browser.

### Option B — VS Code

1. Open this folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

## Publish a public link with Vercel

1. Create a GitHub repository and upload the three project files (`index.html`, `styles.css`, `main.js`) plus this README.
2. Sign in at https://vercel.com/ and choose **Add New → Project**.
3. Import the GitHub repository.
4. Keep the framework preset as **Other**. No build command is needed; leave the output directory as the project root (`.`).
5. Click **Deploy**. Vercel will provide a public `*.vercel.app` URL.
6. Open the public URL in a private/incognito browser window to verify that it is accessible without signing in.
7. Submit that URL and a screenshot of the running city to Padlet.

Alternative: drag the project folder into https://app.netlify.com/drop to publish a static site.

## Controls

- **Left mouse drag / touch drag:** orbit the city.
- **Mouse wheel / pinch:** zoom in and out.
- **Right mouse drag:** pan the view.
- **Click a building:** open its information panel.
- **Night/Day button:** switch lighting simulation.
- **Reset View:** return to the default camera position.

## Project notes

This is an educational simulation. The dashboard values and AI insights are illustrative demo data, not live measurements or financial/medical advice. Three.js and OrbitControls are loaded from jsDelivr, so an internet connection is required when running the project.
