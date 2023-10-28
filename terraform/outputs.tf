output "SQS_QUEUE_URL" {
  value   = aws_sqs_queue.terraform_queue.url
}

output "ECR_REGISTRY_URL" {
  value   = aws_ecr_repository.dolos_ingestion.repository_url
}