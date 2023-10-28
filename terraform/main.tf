terraform {
  cloud {
    organization = "dolos"
    workspaces {
      name = "dolos"
    }
  }
}

resource "aws_dynamodb_table" "dolos_parsed_transcripts" {
  name                 = "dolos-parsed-interview-transcripts"
  billing_mode         = "PAY_PER_REQUEST"
  attribute {
    name               = "guest"
    type               = "S"
  }
  hash_key             = "guest"
  ttl {
    enabled            = true
    attribute_name     = "expiryPeriod"
  }
  point_in_time_recovery {
    enabled = true
  }
}

resource "aws_sqs_queue" "terraform_queue_deadletter" {
  name = "dolos-ingestion-deadletter-queue"
  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.terraform_queue.arn]
  })
}

resource "aws_sqs_queue" "terraform_queue" {
  name                      = "dolos-ingestion-queue"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.terraform_queue_deadletter.arn
    maxReceiveCount     = 4
  })
}

