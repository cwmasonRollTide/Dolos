terraform {
  cloud {
    organization = "dolos"
    workspaces {
      name = "dolos"
    }
  }
}

### Saved prompts and answers (after transcripts are translated into proper shape for training data)
resource "aws_dynamodb_table" "dolos_parsed_transcripts" {
  name                 = "dolos-parsed-interview-transcripts"
  billing_mode         = "PAY_PER_REQUEST"
  attribute {
    name               = "guest"
    type               = "S"
  }
  hash_key             = "guest"
  point_in_time_recovery {
    enabled = true
  }
}

resource "aws_s3_bucket" "images_bucket" {
  name    = "dolos-celebrity-images"
}

module "permissions" {
  source              = "./modules/permissions"
  env                 = var.env
  s3_bucket_arn       = aws_s3_bucket.images_bucket.arn
  dynamo_db_table_arn = aws_dynamodb_table.dolos_parsed_transcripts.arn
}

module "retrieve_celebrity_names" {
  source              = "./modules/lambda-api-endpoint"
  env                 = var.env
  function_name       = "retrieve-celebrity-names"
  role_arn            = module.permissions.MAIN_ROLE_ARN
  dynamodb_table_name = aws_dynamodb_table.dolos_parsed_transcripts.name
  s3_bucket           = aws_s3_bucket.images_bucket.name
  gateway_http_method = "GET"
}

module "retrieve_celebrity_training_data" {
  source              = "./modules/lambda-api-endpoint"
  env                 = var.env
  function_name       = "retrieve-celebrity-training-data"
  role_arn            = module.permissions.MAIN_ROLE_ARN
  dynamodb_table_name = aws_dynamodb_table.dolos_parsed_transcripts.name
  s3_bucket           = aws_s3_bucket.images_bucket.name
  gateway_http_method = "GET"
}

module "save_celebrity_training_data" {
  source              = "./modules/lambda-api-endpoint"
  env                 = var.env
  function_name       = "save-celebrity-training-data"
  role_arn            = module.permissions.MAIN_ROLE_ARN
  dynamodb_table_name = aws_dynamodb_table.dolos_parsed_transcripts.name
  s3_bucket           = aws_s3_bucket.images_bucket.name
  gateway_http_method = "PUT"
}