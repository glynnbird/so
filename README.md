# so

A simple serverless StackOverflow poller that

- fetches recent questions added on tags that interest you
- adds them to a Cloudant database
- notifies a Slack incoming webhook that a new question has arrived

## Pre-requisites

- an IBM Cloud Functions account with the `bx wsk` tool installed and set up
- an IBM Cloudant database
- a Slack account with an "Incoming Webhook" configured

## Installation

Clone this repo. Then run:

```sh
export ACCOUNT="mycloudant"
export PASSWORD="mypassword"
export TAG="cloudant;couchdb"
export DBNAME="mydatabase"
export HOOK="https://hooks.slack.com/services/MY/WEBHOOK/URL"
./deploy.sh
```

## Setup

In the IBM Cloud Functions UI, 

- set up a trigger/rule to run the `so/poll` action every 30 minutes.
- set up a changes feed listener to run `so/notify` whenever your Cloudant database changes


