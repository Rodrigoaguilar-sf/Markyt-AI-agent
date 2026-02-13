# Markyt AI Financial Advisor

Asesor financiero con IA que analiza acciones en tiempo real y da recomendaciones personalizadas.

## ¿Qué hace?

Agente conversacional que consulta precios reales del mercado, analiza tendencias, compara inversiones y genera recomendaciones basadas en perfil de riesgo.

**Ejemplo:**

```
Usuario: "Analiza AAPL, GOOGL, MSFT"
Agente: 📊 Valor total: $990.83
        🚀 Mejor: GOOGL (+10.26%)
        ⚠️ Riesgo: MSFT (-19.81%)
```

## Interfaz

<img width="1919" height="1078" alt="image" src="https://github.com/user-attachments/assets/151b2a1d-fe3b-4db2-bc33-33f9052e89b9" />

## charts
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/60fa8d2e-bcbd-4346-a92f-7683629a8c9a" />

## Portfolio
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/02ac0050-d50e-4bd9-ac47-85bc5a25f8fa" />

## Dark Mode
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/17a621f6-de44-47d3-ba46-9a3b54daabb7" />

## Markyt-gif
![markyt](https://github.com/user-attachments/assets/e739c61a-8148-4204-a919-6bb46daf9605)


## Stack Técnico

**Backend:** FastAPI + Groq (Llama 3.3) + yfinance  
**Frontend:** React + Vite + Tailwind + Recharts  
**IA:** Function calling con 3 herramientas financieras

## Arquitectura

```
React Frontend (Vite + Tailwind)
     ↓ HTTP REST
FastAPI Backend
     ↓
Groq (IA) + Yahoo Finance (datos reales)
```

El agente decide **autónomamente** qué herramientas usar según la consulta del usuario mediante function calling.

## Estructura del Proyecto

```
financial-ai-agent/
├── backend/
│   ├── server.py              # FastAPI + Groq agent
│   ├── financial_tools.py     # Funciones de análisis financiero
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/        # ChatWindow, Portfolio, Charts
    │   ├── hooks/             # useConversationHistory, useTheme
    │   └── services/          # API client
    └── package.json
```

## Features

- Chat conversacional con IA
- Precios en tiempo real (NYSE/NASDAQ)
- Análisis histórico con tendencias y volatilidad
- Comparación de múltiples acciones
- Dashboard de portfolio personalizado
- Gráficos interactivos con Recharts
- Historial de conversaciones (localStorage)
- Modo oscuro
- Interfaz responsive

## ¿Por qué este proyecto?

Democratizar el acceso a asesoría financiera de calidad. Un agente que explica conceptos complejos en lenguaje simple y da recomendaciones accionables, ayudando a las personas a tomar mejores decisiones financieras.

## Disclaimer

Esta aplicación proporciona información con fines educativos y no constituye asesoría financiera profesional. Siempre consulta con un asesor certificado antes de tomar decisiones de inversión.

---
