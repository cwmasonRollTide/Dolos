#output "SQS_QUEUE_URL" {
#  value   = aws_sqs_queue.terraform_queue.url
#}
#
#output "ECR_REGISTRY_URL" {
#  value   = aws_ecr_repository.dolos_transcript_parser.repository_url
#}

output "retrieve_celebrity_names_url" {
  value = module.retrieve_celebrity_names.api_url
}

output "retrieve_celebrity_training_data_url" {
  value = module.retrieve_celebrity_training_data.api_url
}

output "save_celebrity_training_data" {
  value = module.save_celebrity_training_data.api_url
}