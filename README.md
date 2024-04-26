# Read2Burn - Serverless File Uploader

This is a serverless application built with Node.js and the Serverless framework that allows users to upload files for temporary storage. Uploaded files are automatically deleted after a configurable time-to-live (TTL).

## Features
- Encryption in transit and at rest
- Single-use links to share sensitive data
- Scalable serverless architecture

## Prerequisites
- Node.js and npm installed (https://nodejs.org/en/download)
- Terraform installed (https://developer.hashicorp.com/terraform/install)
- Localstack for local development (https://docs.localstack.cloud/getting-started/installation/)
- An AWS account with appropriate permissions

## Deployment
1. Clone this repository
1. Configure your AWS credentials using aws configure
1. Change dir to `iac/` and use `terraform plan` and `terraform apply` to create your infrastructure

## Usage
Once deployed, you can upload files using the following command:

```
shell
curl -X POST https://<your-api-gateway-endpoint>/upload -F "file=@<path-to-your-file>"
```

The response will contain a unique identifier for the uploaded string and the read URL.

## Local Development
To test the application locally, run:

```sh
npm install
cd iac/
tflocal apply
```
 
You can then use the provided upload URL in a browser or curl command for testing purposes.
