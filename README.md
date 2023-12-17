# Description

ACME software™ plans to revolutionise the insurance industry by building an insurance software that enables a potential client to get a quote for an insurance policy ; manage the life of the policy (sign a policy, receive payments, send contractual documents to the client and so on) ; and allow the client to declare claims.

Unfortunately the last developer just quit the initial team, leaving you with an unfinished product. The high ambitions of ACME software™ rest on your shoulders!

Insurance is not original at all but it has a rich domain with interesting choices to make. Let's view it as a playground where we can either borrow ideas from our competitors or build our own vision of what an insurance software should be!

# Local development

## Installation

```bash
$ npm install
```

## Start a database

```
npm run containers:db:start
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Reset the database

```
npm run containers:stop
npm run containers:db:erase
```

# With docker

```
docker build -t poca/poca-2022:latest .
docker image ls
```

## Start the docker image

Assuming a database is ready:

```
docker run --net=host --env NODE_ENV=development poca/poca-2022:latest
```

## Publish the image

```
docker login
docker push poca/poca-2022:latest
```

## Remove old images

```
docker image prune
```

# Deploy to the cloud

## Set up AWS account

* Sign up for a new AWS account
* Set up MFA
* Create a programmatic user "gitlab-ci" in a new group "admin" with AdministratorAccess
* Create access keys for that user
* Configure AWS on your computer (eg `~/.aws/config` / `~/.aws/credentials` on linux)

## Docker hub

* Create an account on docker hub and create an access token

## Set up terraform

Install terraform.

Create an S3 bucket to contain the tfstate and a DynamoDB table to contain the lock.

In the directory `terraform`, to initialize the project:

```
terraform init
```

Set the secrets in you shell:

```
export TF_VAR_db_password="xxx"
```

To plan the deployment:

```
terraform plan --var-file=staging.tfvars
```

To deploy:

```
terraform apply --var-file=staging.tfvars
```

To destroy:

```
terraform destroy --var-file=staging.tfvars
```

## Use the software online

Go to http://13.36.135.25/front

## Logs

Logs are stored on AWS Cloudwatch: https://eu-west-3.console.aws.amazon.com/cloudwatch/home?region=eu-west-3#logsV2:log-groups/log-group/poca-web/log-events
