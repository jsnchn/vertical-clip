build:
	docker-compose build --parallel

logs:
	docker-compose logs -ft --tail 500

start-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml --compatibility up --remove-orphans --build -d

start:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml --compatibility up --remove-orphans --build -d

stop:
	docker-compose stop

restart:
	docker-compose restart

reboot: stop start

reboot-prod: stop start-prod

start-logs: start logs

start-prod-logs: start-prod logs

reboot-logs: stop start-logs

reboot-prod-logs: stop start-prod-logs
