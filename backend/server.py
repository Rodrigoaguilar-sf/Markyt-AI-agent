from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from groq import Groq
import json
from financial_tools import TOOLS, TOOL_FUNCTIONS

load_dotenv()

app = FastAPI()

# Config CORS
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """Eres un asesor financiero experto que trabaja para Markyt, una fintech que ayuda a las personas a tomar mejores decisiones financieras.

IMPORTANTE: Tienes acceso a herramientas para obtener datos reales del mercado. DEBES usarlas para obtener información precisa y actualizada sobre precios de acciones y análisis.

Cuando analices inversiones:
1. SIEMPRE usa las herramientas disponibles para obtener datos reales
2. NO inventes ni estimes precios - llama a las funciones para obtener datos actuales
3. Explica las métricas en términos sencillos
4. Considera diferentes perfiles de riesgo
5. Da recomendaciones accionables y específicas
6. Menciona tanto oportunidades como riesgos de forma balanceada

Formato de respuesta:
- Usa emojis ocasionalmente para hacer la lectura más amigable (📈, 📉, 💰, ⚠️)
- Estructura tus respuestas con párrafos cortos
- Presenta los datos numéricos de forma clara
- Si presentas múltiples acciones, organiza la información de forma clara

DISCLAIMER OBLIGATORIO:
- Al final de cada análisis o recomendación de inversión, SIEMPRE incluye un breve recordatorio de que esta información es solo educativa y que deben consultar con un asesor financiero profesional antes de tomar decisiones de inversión.
- Varía la forma de expresarlo para que no suene repetitivo, pero siempre incluye este mensaje de responsabilidad.

Siempre mantén un tono profesional pero cercano."""


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = []


class ChatResponse(BaseModel):
    response: str
    history: List[dict]


@app.get("/")
async def root():
    return {"message": "Markyt AI Agent API Testing", "status": "running"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Convertir historial
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
        
        for msg in request.history:
            messages.append({"role": msg.role, "content": msg.content})
        
        messages.append({"role": "user", "content": request.message})
        
        # Loop de agent con tool calling
        max_iterations = 5
        iteration = 0
        
        while iteration < max_iterations:
            iteration += 1
            
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile", 
                messages=messages,
                tools=TOOLS,
                tool_choice="auto",
                max_tokens=4096
            )
            
            assistant_message = response.choices[0].message
            
            # Si no hay tool calls termina
            if not assistant_message.tool_calls:
                return ChatResponse(
                    response=assistant_message.content,
                    history=messages[1:] 
                )
       
            messages.append({
                "role": "assistant",
                "content": assistant_message.content or "",
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments
                        }
                    }
                    for tc in assistant_message.tool_calls
                ]
            })
            
            # Procesar tool calls
            for tool_call in assistant_message.tool_calls:
                tool_name = tool_call.function.name
                tool_args = json.loads(tool_call.function.arguments)
                
                print(f"🔧 Ejecutando: {tool_name}({tool_args})")
                
                result = TOOL_FUNCTIONS[tool_name](**tool_args)
                
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": tool_name,
                    "content": json.dumps(result)
                })
        
        return ChatResponse(
            response="Lo siento, necesité demasiados pasos para responder. ¿Podrías reformular tu pregunta?",
            history=messages[1:]
        )
    
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/chart/{symbol}")
async def get_chart(symbol: str, period: str = "3mo", interval: str = "1d"):
    """Endpoint para obtener datos de gráficos
    
    Parámetros:
    - symbol: Ticker de la acción (ej: AAPL)
    - period: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
    - interval: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
    """
    try:
        from financial_tools import get_stock_chart_data
        
        result = get_stock_chart_data(symbol, period, interval)
        
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/quote/{symbol}")
async def get_quote(symbol: str):
    """Endpoint para obtener precio actual y cambio de una acción"""
    try:
        from financial_tools import get_quote
        
        result = get_quote(symbol)
        
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
