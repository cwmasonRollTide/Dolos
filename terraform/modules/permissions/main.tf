resource "aws_iam_role" "fargate_role" {
  name = "DolosFargateSQSAccessRole"

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
  name        = "DolosFargateSQSAccessPolicy"
  description = "Allows Fargate tasks to push messages to SQS"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "sqs:ReceiveMessage",
          "sqs:GetQueueUrl",
          "sqs:GetQueueAttributes",
          "sqs:DeleteMessage"
        ],
        Effect   = "Allow",
        Resource = var.sqs_queue_arn
      }
    ]
  })
}

resource "aws_iam_policy" "dynamodb_full_access" {
  name        = "DolosFargateDynamoDBFullAccessPolicy"
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

resource "aws_iam_policy" "cloudwatch_logs_access" {
  name        = "DolosFargateCloudWatchLogsAccessPolicy"
  description = "Allows Fargate tasks to create and use CloudWatch Log Groups"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "ecr_access" {
  name        = "DolosFargateECRAccessPolicy"
  description = "Allows Fargate tasks to pull images from ECR"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer"
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "fargate_ecr_attach" {
  role       = aws_iam_role.fargate_role.name
  policy_arn = aws_iam_policy.ecr_access.arn
}

resource "aws_iam_role_policy_attachment" "fargate_cloudwatch_logs_attach" {
  role       = aws_iam_role.fargate_role.name
  policy_arn = aws_iam_policy.cloudwatch_logs_access.arn
}

resource "aws_iam_role_policy_attachment" "fargate_dynamodb_attach" {
  role       = aws_iam_role.fargate_role.name
  policy_arn = aws_iam_policy.dynamodb_full_access.arn
}

resource "aws_iam_role_policy_attachment" "fargate_sqs_attach" {
  role       = aws_iam_role.fargate_role.name
  policy_arn = aws_iam_policy.sqs_access.arn
}