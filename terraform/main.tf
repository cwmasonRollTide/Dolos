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

resource "aws_ecr_repository" "dolos_ingestion" {
  name = "dolos-ingestion-repo"
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
          "sqs:SendMessage",
          "sqs:GetQueueUrl"
        ],
        Effect   = "Allow",
        Resource = aws_sqs_queue.terraform_queue.arn
      }
    ]
  })
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

resource "aws_ecs_task_definition" "dolos_ingestion" {
  family                   = "dolos-ingestion"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.fargate_sqs_role.arn
  task_role_arn            = aws_iam_role.fargate_sqs_role.arn

  container_definitions = jsonencode([{
    name  = "dolos-ingestion-container"
    image = "${aws_ecr_repository.dolos_ingestion.repository_url}:latest"
    portMappings = [{
      containerPort = 80
      hostPort      = 80
    }]
  }])
}

resource "aws_ecs_service" "dolos_service" {
  name            = "dolos-ingestion-service"
  cluster         = aws_ecs_cluster.dolos_cluster.id
  task_definition = aws_ecs_task_definition.dolos_ingestion.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets = [aws_subnet.dolos_subnet.id]
    security_groups = [aws_security_group.dolos_sg.id]
  }

  desired_count = 1
}
