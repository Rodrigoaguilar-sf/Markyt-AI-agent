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

## Screenshots

![Chat Interface](screenshots/chat.png)
![Portfolio Dashboard](screenshots/portfolio.png)
![Price Charts](screenshots/chart.png)
![Dark Mode](screenshots/dark-mode.png)

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
