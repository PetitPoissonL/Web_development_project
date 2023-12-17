/*
The AWS user used by terraform is granted the AWS managed policy AdministratorAccess.
*/

terraform {
  
  backend "s3" {
    bucket = "snwlc-tfstates"
    key = "snwlc-lock"
    region = "eu-west-3"
    dynamodb_table = "dynamodb-state-locking"
    profile = "default"
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# resource "aws_dynamodb_table" "state_locking" {
#   name         = "dynamodb-state-locking"
#   billing_mode = "PAY_PER_REQUEST"
#   hash_key     = "LockID"
#   attribute {
#     name = "LockID"
#     type = "S"
#     }
# }

provider "aws" {
  region = "eu-west-3"  # Europe (Paris)
}

data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners = ["amazon"]

  filter {
    name = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}
