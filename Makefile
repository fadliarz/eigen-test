build-dev:
	docker-compose -f docker-compose-dev.yaml build $(c)
up-dev:
	docker-compose -f docker-compose-dev.yaml up -d $(c)
down-dev:
	docker-compose -f docker-compose-dev.yaml down $(c)
run-dev:
	docker-compose -f docker-compose-dev.yaml down $(c) && docker-compose -f docker-compose-dev.yaml build $(c) && docker-compose -f docker-compose-dev.yaml up -d $(c)
