resource "aws_iam_role" "fargate_role" {
  name = "FargateSQSAccessRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "sqs_access" {
  name        = "FargateSQSAccessPolicy"
  description = "Allows Fargate tasks to push messages to SQS"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "sqs:ReceiveMessage",
          "sqs:GetQueueUrl"
        ],
        Effect   = "Allow",
        Resource = var.sqs_queue_arn
      }
    ]
  })
}

resource "aws_iam_policy" "dynamodb_full_access" {
  name        = "FargateDynamoDBFullAccessPolicy"
  description = "Allows Fargate tasks full access to DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "dynamodb:*",
        Effect = "Allow",
        Resource = var.dynamo_db_table_arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "fargate_dynamodb_attach" {
  role       = aws_iam_role.fargate_role.name
  policy_arn = aws_iam_policy.dynamodb_full_access.arn
}

resource "aws_iam_role_policy_attachment" "fargate_sqs_attach" {
  role       = aws_iam_role.fargate_role.name
  policy_arn = aws_iam_policy.sqs_access.arn
}