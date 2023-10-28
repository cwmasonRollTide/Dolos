terraform {
  cloud {
    organization = "dolos"
    workspaces {
      name = "dolos"
    }
  }
}

## Saved prompts and answers (after transcripts are translated into proper shape for training data)
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

resource "aws_sqs_queue" "terraform_queue_deadletter" {
  name = "dolos-ingestion-deadletter-queue"
}

## TranscriptParser will be listening to this queue and processing each interview
## as a single item. should be in cluster and 
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
