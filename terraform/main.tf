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

resource "aws_ecr_repository" "dolos_transcript_parser" {
  name = "dolos-repo"
}

resource "aws_iam_role" "fargate_sqs_role" {
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
        Resource = aws_sqs_queue.terraform_queue.arn
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
        Resource = aws_dynamodb_table.dolos_parsed_transcripts.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "fargate_dynamodb_attach" {
  role       = aws_iam_role.fargate_sqs_role.name
  policy_arn = aws_iam_policy.dynamodb_full_access.arn
}

resource "aws_iam_role_policy_attachment" "fargate_sqs_attach" {
  role       = aws_iam_role.fargate_sqs_role.name
  policy_arn = aws_iam_policy.sqs_access.arn
}

resource "aws_ecs_cluster" "dolos_cluster" {
  name = "dolos-cluster"
}

resource "aws_vpc" "dolos_vpc" {
  cidr_block       = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = {
    Name = "dolos-vpc"
  }
}

resource "aws_subnet" "dolos_subnet" {
  vpc_id     = aws_vpc.dolos_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-east-2a" 
  map_public_ip_on_launch = true
  tags = {
    Name = "dolos-subnet"
  }
}

resource "aws_security_group" "dolos_sg" {
  vpc_id = aws_vpc.dolos_vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "dolos-sg"
  }
}

resource "aws_ecs_task_definition" "dolos_transcript_parser" {
  family                   = "dolos-transcript-parser"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.fargate_sqs_role.arn
  task_role_arn            = aws_iam_role.fargate_sqs_role.arn

  container_definitions = jsonencode([{
    name  = "dolos-parser-container"
    image = "${aws_ecr_repository.dolos_transcript_parser.repository_url}:latest"
    portMappings = [{
      containerPort = 80
      hostPort      = 80
    }]
    environment = [
      {
        name  = "DYNAMO_DB_TABLE",
        value = aws_dynamodb_table.dolos_parsed_transcripts.name
      },
      {
        name  = "SQS_QUEUE_URL",
        value = aws_sqs_queue.terraform_queue.url
      }
    ]
  }])
}

resource "aws_ecs_service" "dolos_service" {
  name            = "dolos-transcript-parser-service"
  cluster         = aws_ecs_cluster.dolos_cluster.id
  task_definition = aws_ecs_task_definition.dolos_transcript_parser.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets = [aws_subnet.dolos_subnet.id]
    security_groups = [aws_security_group.dolos_sg.id]
  }

  desired_count = 1
}

# Define a CloudWatch metric for number of messages visible in the SQS queue
resource "aws_cloudwatch_metric_alarm" "sqs_messages_visible" {
  alarm_name          = "sqs-messages-visible"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = "300"
  statistic           = "Average"
  threshold           = "10"
  alarm_description   = "Alarm when there are too many messages in the queue"
  alarm_actions       = [aws_appautoscaling_policy.scale_out_policy.arn]
  dimensions = {
    QueueName = aws_sqs_queue.terraform_queue.name
  }
}

# Define ECS service auto scaling
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = 5 # Maximum number of tasks
  min_capacity       = 1 # Minimum number of tasks
  resource_id        = "service/${aws_ecs_cluster.dolos_cluster.name}/${aws_ecs_service.dolos_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "scale_out_policy" {
  name               = "scale-out"
  service_namespace  = "ecs"
  scalable_dimension = "ecs:service:DesiredCount"
  resource_id        = "service/${aws_ecs_cluster.dolos_cluster.name}/${aws_ecs_service.dolos_service.name}"
  policy_type        = "StepScaling"

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 300
    metric_aggregation_type = "Average"

    step_adjustment {
      scaling_adjustment          = 1
      metric_interval_lower_bound = 0
    }
  }
}

resource "aws_appautoscaling_policy" "scale_in_policy" {
  name               = "scale-in"
  service_namespace  = "ecs"
  scalable_dimension = "ecs:service:DesiredCount"
  resource_id        = "service/${aws_ecs_cluster.dolos_cluster.name}/${aws_ecs_service.dolos_service.name}"
  policy_type        = "StepScaling"

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 300
    metric_aggregation_type = "Average"

    step_adjustment {
      scaling_adjustment          = -1
      metric_interval_upper_bound = 0
    }
  }
}
