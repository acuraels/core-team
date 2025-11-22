FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_CREATE=false

RUN apt-get update && apt-get install -y --no-install-recommends && rm -rf /var/lib/apt/lists/*


RUN pip install --upgrade pip
RUN pip install poetry~=2.2 --no-cache-dir

WORKDIR /ai

COPY pyproject.toml poetry.lock* ./
RUN poetry install --only main --no-interaction --no-ansi --no-root


COPY . .

CMD ["python", "-m", "src"]