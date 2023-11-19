variable "env"  {
  type        = string
  default     = "prod"
  description = "Environment var"
}

variable "function_name"  {
  type        = string
  description = "The function name for this module"
}

variable "s3_bucket" {
  type        = string
}

variable "dynamodb_table_name" {
  type        = string
  description = "The dynamodb table for the project / endpoint to reference"
}

variable "role_arn" {
  type        = string
  description = "The role the lambda function should assume to perform ops"
}

variable "gateway_http_method" {
  type        = string
  default     = "GET"
  description = "POST,GET,PUT,DELETE,etc."
}

variable "api_key" {
  type        = string
  default     = "empty"
  description = "If this lambda function needs to reach out to an external api and is key based, use this var"
}