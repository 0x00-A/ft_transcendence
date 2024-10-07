all: up

clean:
	docker compose -f docker-compose.yml down

fclean:
	docker compose -f docker-compose.yml down --rmi all -v

up:
	docker compose -f docker-compose.yml --env-file .env up --build

down:
	docker compose -f docker-compose.yml down

re: fclean all
