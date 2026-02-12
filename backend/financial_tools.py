import yfinance as yf
from datetime import datetime
import json

def get_quote(symbol: str) -> dict:
    """Obtiene precio actual, cambio y métricas de una acción"""
    try:
        stock = yf.Ticker(symbol)
        info = stock.info
        hist = stock.history(period="1d")
        
        if hist.empty:
            return {"error": f"No se encontró información para {symbol}"}
        
        current_price = hist['Close'].iloc[-1]
        previous_close = info.get('previousClose', current_price)
        
        change = current_price - previous_close
        change_percent = (change / previous_close) * 100 if previous_close else 0
        
        return {
            "symbol": symbol.upper(),
            "current_price": round(float(current_price), 2),
            "previous_close": round(float(previous_close), 2),
            "change": round(float(change), 2),
            "change_percent": round(float(change_percent), 2),
            "currency": info.get('currency', 'USD'),
            "company_name": info.get('shortName', symbol),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}


def get_stock_price(symbol: str) -> dict:
    """Obtiene el precio actual de una acción"""
    try:
        stock = yf.Ticker(symbol)
        data = stock.history(period="1d")
        
        if data.empty:
            return {"error": f"No se encontró información para {symbol}"}
        
        current_price = data['Close'].iloc[-1]
        
        return {
            "symbol": symbol,
            "price": round(float(current_price), 2),
            "currency": "USD",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}


def get_stock_analysis(symbol: str, period: str = "3mo") -> dict:
    """Análisis histórico de una acción"""
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period)
        
        if hist.empty:
            return {"error": f"No se encontró información para {symbol}"}
        
        # Metricas basicas
        current = hist['Close'].iloc[-1]
        max_price = hist['Close'].max()
        min_price = hist['Close'].min()
        avg_price = hist['Close'].mean()
        volatility = hist['Close'].std()
        
        # Tendencia (compara primeros y ultimos 5 días)
        recent_avg = hist['Close'].tail(5).mean()
        old_avg = hist['Close'].head(5).mean()
        trend = "alcista" if recent_avg > old_avg else "bajista"
        change_pct = ((current - old_avg) / old_avg) * 100
        
        return {
            "symbol": symbol,
            "current_price": round(float(current), 2),
            "max_3m": round(float(max_price), 2),
            "min_3m": round(float(min_price), 2),
            "avg_3m": round(float(avg_price), 2),
            "volatility": round(float(volatility), 2),
            "trend": trend,
            "change_pct": round(float(change_pct), 2)
        }
    except Exception as e:
        return {"error": str(e)}


def get_portfolio_summary(symbols: list) -> dict:
    """Resume un portafolio de acciones"""
    try:
        portfolio = []
        total_value = 0
        
        for symbol in symbols:
            analysis = get_stock_analysis(symbol)
            if "error" not in analysis:
                portfolio.append(analysis)
                total_value += analysis["current_price"]
        
        if not portfolio:
            return {"error": "No se pudo analizar ninguna acción del portafolio"}
        
        highest_vol = max(portfolio, key=lambda x: x["volatility"])
        best_perf = max(portfolio, key=lambda x: x["change_pct"])
        
        return {
            "stocks": portfolio,
            "total_positions": len(portfolio),
            "combined_value": round(total_value, 2),
            "highest_volatility": highest_vol["symbol"],
            "best_performer": best_perf["symbol"]
        }
    except Exception as e:
        return {"error": str(e)}


# Definición de tools
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_stock_price",
            "description": "Obtiene el precio actual en tiempo real de una acción del mercado estadounidense. Usa el símbolo ticker (ej: AAPL para Apple, GOOGL para Google).",
            "parameters": {
                "type": "object",
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "Símbolo ticker de la acción (ej: AAPL, MSFT, TSLA)"
                    }
                },
                "required": ["symbol"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_stock_analysis",
            "description": "Análisis histórico completo de una acción: precio actual, máximos/mínimos, volatilidad y tendencia de los últimos 3 meses.",
            "parameters": {
                "type": "object",
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "Símbolo ticker de la acción"
                    },
                    "period": {
                        "type": "string",
                        "description": "Período de análisis: 1mo, 3mo, 6mo, 1y",
                        "default": "3mo"
                    }
                },
                "required": ["symbol"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_portfolio_summary",
            "description": "Analiza un portafolio completo de acciones y genera un resumen con métricas consolidadas.",
            "parameters": {
                "type": "object",
                "properties": {
                    "symbols": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Lista de símbolos ticker del portafolio"
                    }
                },
                "required": ["symbols"]
            }
        }
    }
]

def get_stock_chart_data(symbol: str, period: str = "3mo", interval: str = "1d") -> dict:
    """Obtiene datos históricos para gráficos"""
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period, interval=interval)
        
        if hist.empty:
            return {"error": f"No se encontró información para {symbol}"}
        
        chart_data = []
        for date, row in hist.iterrows():
            chart_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "price": round(float(row['Close']), 2),
                "volume": int(row['Volume']),
                "high": round(float(row['High']), 2),
                "low": round(float(row['Low']), 2)
            })
        
        current_price = hist['Close'].iloc[-1]
        first_price = hist['Close'].iloc[0]
        change = ((current_price - first_price) / first_price) * 100
        
        return {
            "symbol": symbol,
            "period": period,
            "data": chart_data,
            "current_price": round(float(current_price), 2),
            "change_percent": round(float(change), 2),
            "data_points": len(chart_data)
        }
    except Exception as e:
        return {"error": str(e)}


# Mapeo de funciones
TOOL_FUNCTIONS = {
    "get_stock_price": get_stock_price,
    "get_stock_analysis": get_stock_analysis,
    "get_portfolio_summary": get_portfolio_summary
}