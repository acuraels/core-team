build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

run_ai:
	poetry run python -m src