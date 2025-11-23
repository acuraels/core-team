FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl gcc g++ git build-essential \
    && rm -rf /var/lib/apt/lists/*


RUN curl -LsSf https://astral.sh/uv/install.sh | sh 

WORKDIR /ai

COPY pyproject.toml ./

RUN uv pip install --system .

COPY . .

CMD ["python", "-m", "src"]