all: up

clean:
	docker compose -f docker-compose.yml down -v

clean-deploy:
	docker compose -f docker-compose-deploy.yml down -v

fclean:
	docker compose -f docker-compose.yml down --rmi all -v

up:
	docker compose -f docker-compose.yml --env-file .env up

deploy:
	docker compose -f docker-compose-deploy.yml --env-file .env up

build:
	docker compose -f docker-compose.yml --env-file .env up --build

build-deploy:
	docker compose -f docker-compose-deploy.yml --env-file .env up --build

down:
	docker compose -f docker-compose.yml down

makemigrations:
	docker compose run --rm backend sh -c "python manage.py makemigrations"

test:
	docker compose run --rm backend sh -c "python manage.py test"

shell:
	docker compose run --rm backend sh -c "python manage.py shell"

re: fclean all
