# Running Agri Clinic Management in VS Code

## Quick Start

### Method 1: One-Click Run (Recommended)

1. Open VS Code
2. Press `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` (Mac)
3. Type: **Tasks: Run Task**
4. Select: **Start All Servers**

Both backend and frontend will start automatically!

### Method 2: Using Run and Debug

1. Click the **Run and Debug** icon in the sidebar (or press `Ctrl + Shift + D`)
2. Select **"Full Stack: Backend + Frontend"** from the dropdown
3. Click the **Start Debugging** button (green play icon)

### Method 3: Manual Terminal

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## First Time Setup

1. **Install Dependencies:**
   - Press `Ctrl + Shift + P`
   - Type: **Tasks: Run Task**
   - Select: **Install Dependencies**

2. **Set Environment Variables:**
   Create a `.env` file in the root directory:
   ```
   SESSION_SECRET=your-secret-key-here
   ```

3. **Install Recommended Extensions:**
   - VS Code will prompt you to install recommended extensions
   - Click "Install All" when prompted

---

## Access the Application

- **Frontend:** http://localhost:5000
- **Backend API:** http://localhost:8000

## Login Credentials

- **Admin:** Username: `Dev410978`, Password: `raj978410`
- **Jayankondam:** Username: `Dev410978`, Password: `jayankondam`
- **Devamangalam:** Username: `Dev410978`, Password: `devamangalam`
- **Ariyalur:** Username: `Dev410978`, Password: `ariyalur`

---

## Keyboard Shortcuts

- `Ctrl + Shift + P` - Command Palette
- `Ctrl + ~` - Toggle Terminal
- `Ctrl + Shift + 5` - Split Terminal
- `F5` - Start Debugging
- `Shift + F5` - Stop Debugging

---

## Troubleshooting

**Port already in use:**
- Stop the running process or restart VS Code

**Dependencies not installed:**
- Run the "Install Dependencies" task

**Python environment not found:**
- Make sure Python 3.11+ is installed
- Run `uv sync` in terminal

---

## Project Structure

```
agri-clinic/
├── .vscode/              # VS Code configuration
│   ├── tasks.json       # Task definitions
│   ├── launch.json      # Debug configurations
│   ├── settings.json    # Workspace settings
│   └── extensions.json  # Recommended extensions
├── backend/
│   └── app.py           # Flask server (port 8000)
├── frontend/
│   ├── src/             # React source
│   └── vite.config.js   # Vite config (port 5000)
├── pyproject.toml       # Python dependencies
└── package.json         # Not used (frontend has its own)
```

Happy coding! 🚀
