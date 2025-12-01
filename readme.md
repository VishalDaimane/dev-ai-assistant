# 🧠 Developer AI Assistant  
An AI-powered debugging assistant built using **FastAPI**, **React**, **Gemini 2.5 Flash**, and an optional **Multi-Agent Analysis System**.  
This project helps developers detect bugs, fix code, analyze complexity, and optimize solutions in real-time.

---

## 🚀 Features

### ✅ 1. Chat Assistant  
- Natural-language chat  
- Explains code, debugging help, suggestions  
- Powered by Google Gemini 2.5 Flash  

### ✅ 2. Code Debugging (Deep Analysis Mode)  
Multi-Agent pipeline:
- **🐞 Bug Finder Agent** — Detects bugs, missing syntax, runtime issues  
- **🛠 Fixer Agent** — Generates corrected code + optimized version  
- **💡 Explainer Agent** — Explains errors, gives Big-O complexity, best practices  

### ✅ 3. Developer-Friendly UI  
- Code block detection  
- Syntax highlighting  
- Separate Agent Results panel  
- Tailwind-powered clean interface  

### ✅ 4. FastAPI Backend  
- `/chat` → general conversation  
- `/analyze` → detailed single-agent analysis  
- `/multi_analyze` → advanced multi-agent debugging  
- CORS enabled for React  
- `.env` support  

### ✅ 5. Free to Use (India-compatible)  
- Uses **Gemini API** (works in India without credit card)  
- Completely free-tier compatible  

---

## 🧱 Tech Stack

### **Frontend**
- React  
- Vite  
- TailwindCSS  
- react-syntax-highlighter  

### **Backend**
- FastAPI  
- Python 3  
- Google Gemini (`google-generativeai`)  
- dotenv  

### **AI**
- Gemini 2.5 Flash Model  
- Multi-Agent architecture (Finder, Fixer, Explainer)  

---

## 📂 Project Structure



dev-ai-assistant/
│
├── backend/
│ ├── main.py
│ ├── .env
│ └── requirements.txt
│
└── frontend/
├── src/
│ ├── App.jsx
│ ├── Chat.jsx
│ └── index.css
├── package.json
└── vite.config.js




---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo

```bash
git clone https://github.com/yourusername/dev-ai-assistant.git
cd dev-ai-assistant


🔧 Backend Setup (FastAPI + Gemini)
2️⃣ Create virtual environment


cd backend
python -m venv .venv
.\.venv\Scripts\activate   # Windows


3️⃣ Install dependencies

pip install fastapi uvicorn python-dotenv google-generativeai


4️⃣ Add your Gemini API Key

Create .env file:
GEMINI_API_KEY=your_api_key_here


Get key from:
👉 https://aistudio.google.com/apikey

5️⃣ Start backend server
uvicorn main:app --reload


Backend runs at:
👉 http://127.0.0.1:8000

Swagger Docs:
👉 http://127.0.0.1:8000/docs

🎨 Frontend Setup (React + Tailwind)
6️⃣ Install dependencies

cd ../frontend
npm install


7️⃣ Start frontend
npm run dev
Frontend runs at:
👉 http://localhost:5173

🧠 Multi-Agent Debugging (Advanced)
Endpoint:

POST /multi_analyze
{
  "message": "your code here"
}
Returns:

{
  "finder": "Bug list...",
  "fixer": "Corrected code...",
  "explainer": "Complexity + reasoning..."
}
🛠️ Future Enhancements (Optional)

🗂 File upload for full code analysis

🔬 Unit test generation

📦 Add local model fallback (Ollama)

🚀 Streaming responses (token-by-token)

🔍 Add logging + history sidebar

🌙 Dark mode

🏁 Conclusion

This project demonstrates a college-level + portfolio-ready AI system that combines:

LLM Chat

Multi-Agent Reasoning

Intelligent Code Debugging

Modern UI/UX

Feel free to fork, improve, and showcase it!

👨‍💻 Author

Vishal Prakash Daimane
Developer • AI Enthusiast • Full Stack Engineer