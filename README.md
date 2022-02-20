[![pipeline status](https://gitlab.com/apollo-api/core/badges/master/pipeline.svg)](https://gitlab.com/apollo-api/core/commits/master)
[![coverage report](https://gitlab.com/apollo-api/core/badges/master/coverage.svg)](https://gitlab.com/apollo-api/core/-/commits/master)

# Apollo API
<img src="https://gitlab.com/apollo-api/core/-/raw/master/apollo-logo-earth-bg.png" alt="drawing" width="300px"/>

Apollo core is the heart of the Apollo framework. Apollo is built on Express.js & Typescript.

Essentially, it's Express.js with Typescript and a couple nice things out of the box like:

* Simplified route handling, creation, and organization
* Wire routes to controllers
* Route policies
* Route param data type enforcement
    * Validate query params, body params, & path params all from your route definition

## Running core tests
Easily run tests by running the `make test` command. Assumes Docker is installed.

## Example project
See the example project consuming Apollo-core here: https://gitlab.com/apollo-api/template
