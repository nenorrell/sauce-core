NODE=14
UNIT_TEST := "tests/**/*.test.ts"
INTEGRATION_TEST := "tests/**/*.int-test.ts"
TEST := "tests/**/*test.ts"

clean:
	./bin/clean.sh

install:
	docker run -i --rm --name install-apollo-api -u "node" -v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} npm install ${PCKG}

lint:
	docker run -i --rm --name lint-apollo-api -u "node" -v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} npm run lint

lint-fix:
	docker run -i --rm --name lint-fix-apollo-api -u "node" -v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} npm run lint:fix

test: install run-tests lint

run-tests:
	docker run -i --rm -p "9198:1337" \
	-e NODE_ENV=test \
	-e ENV="local" \
	-e JWT_PRIVATE="Test-private-key" \
	-v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} \
	node_modules/.bin/nyc --reporter=text --reporter=cobertura --report-dir=./coverage \
	node_modules/.bin/mocha \
	--require ts-node/register \
	$(TEST) -R spec --color --verbose --exit

unit_test:
	docker run -i --rm -p "9199:9200" \
	-v `pwd`:/usr/src/app \
	-w /usr/src/app node:${NODE} \
	node_modules/.bin/nyc --reporter=text --reporter=cobertura --report-dir=./coverage-unit \
	node_modules/.bin/mocha \
	--require ts-node/register \
	$(UNIT_TEST) -R spec --color --verbose

integration-test-run:
	docker run -i --rm -p "9198:1337" \
	-e NODE_ENV=test \
	-e ENV="local" \
	-e JWT_PRIVATE="Test-private-key" \
	-v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} \
	node_modules/.bin/nyc --reporter=text --reporter=cobertura --report-dir=./coverage-integration \
	node_modules/.bin/mocha \
	--require ts-node/register \
	$(INTEGRATION_TEST) -R spec --color --verbose --exit

package:
	/bin/sh ./bin/package.sh

compile:
	docker run -i --rm --name compile-apollo-api -e NODE_ENV=production -u "node" -v `pwd`:/usr/src/app -w /usr/src/app node:${NODE} npm run build

publish: test
	npm publish --access=public

publish-ci: install
	docker run -i --rm -p "9198:1337" \
	-v `pwd`:/usr/src/app -w /usr/src/app \
	-e NPM_TOKEN=$(NPM_TOKEN) \
	node:${NODE} ./.bin/publish-ci.js
