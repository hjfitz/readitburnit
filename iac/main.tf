terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }

    null = {
      source  = "hashicorp/null"
      version = "3.2.1"
    }

    archive = {
      source  = "hashicorp/archive"
      version = "2.4.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "3.5.1"
    }

  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = local.aws_region
}
