import os
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai # <--- ENSURE THIS IS THE IMPORT

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure API Key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in environment variables")
else:
    genai.configure(api_key=api_key)

# DEBUG: Print available models to console on startup
# This helps us verify if your API key has access to 'gemini-1.5-flash'
try:
    print("--- Listing Available Models ---")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
    print("--------------------------------")
except Exception as e:
    print(f"Error listing models: {e}")


@app.get("/")
def home():
    return {"message": "Backend running successfully!"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat")
def chat(message: str = Body(..., embed=True)):
    try:
        # Use the standard model initialization
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        response = model.generate_content(message)
        
        # The standard library response object has a .text property
        return {"reply": response.text}

    except Exception as e:
        # detailed error logging
        print(f"Error during generation: {e}")
        return {"error": str(e)}
    
@app.post("/analyze")
def analyze(message: str = Body(..., embed=True)):
    """
    Developer code analyzer:
    - Detects bugs
    - Explains errors
    - Provides fixes in code blocks
    - Gives optimized code and reasoning
    - Provides time/space complexity if applicable
    """
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY missing"}

        model = genai.GenerativeModel("gemini-2.5-flash")

        prompt = f"""
You are an advanced AI debugging assistant.

Given this code or error message:

{message}

Your tasks:

1. Identify ALL bugs
2. Explain WHY each bug happens
3. Provide the FIXED code in ```code``` block
4. Provide an OPTIMIZED version in another ```code``` block (if possible)
5. Provide time + space complexity analysis
6. Give recommendations for improvement

Return output in a clean, readable structure.
"""

        response = model.generate_content(prompt)

        return {"analysis": response.text}

    except Exception as e:
        return {"error": str(e)}
