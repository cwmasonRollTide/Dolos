data "archive_file" "lambda_archive_file" {
  type = "zip"
  source_dir  = "../functions/${var.function_name}"
  output_path = "../output/functions/${var.function_name}.zip"
}

resource "aws_lambda_function" "lambda_function" {
  filename          = data.archive_file.lambda_archive_file.output_path
  function_name     = "${var.function_name}-${var.env}"
  role              = var.role_arn
  handler           = "index.handler"
  source_code_hash  = data.archive_file.lambda_archive_file.output_sha
  runtime           = "nodejs18.x"

  environment {
    variables = {
      S3_BUCKET_NAME          = var.s3_bucket
      TABLE_NAME              = var.dynamodb_table_name
      API_KEY                 = var.api_key
    }
  }
}

resource "aws_api_gateway_rest_api" "gateway_rest" {
  name        = "api-gateway-${var.function_name}-endpoint-${var.env}"
  description = "API Gateway for lambda function"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.gateway_rest.id
  parent_id   = aws_api_gateway_rest_api.gateway_rest.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_rest.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = var.gateway_http_method
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "gateway_integration" {
  rest_api_id             = aws_api_gateway_rest_api.gateway_rest.id
  resource_id             = aws_api_gateway_method.proxy.resource_id
  http_method             = aws_api_gateway_method.proxy.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_function.invoke_arn
}

resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_rest.id
  resource_id   = aws_api_gateway_rest_api.gateway_rest.root_resource_id
  http_method   = var.gateway_http_method
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id             = aws_api_gateway_rest_api.gateway_rest.id
  resource_id             = aws_api_gateway_method.proxy_root.resource_id
  http_method             = aws_api_gateway_method.proxy_root.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_function.invoke_arn
}

resource "aws_api_gateway_deployment" "deploy" {
  depends_on = [
    aws_api_gateway_integration.gateway_integration,
    aws_api_gateway_integration.lambda_root,
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_rest.id
  stage_name  = var.env
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.gateway_rest.execution_arn}/*/*"
}

resource "aws_api_gateway_method_response" "method_response" {
  rest_api_id       = aws_api_gateway_rest_api.gateway_rest.id
  resource_id       = aws_api_gateway_resource.proxy.id
  http_method       = aws_api_gateway_method.proxy.http_method
  status_code       = 200

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

resource "aws_api_gateway_integration_response" "integration_response" {
  rest_api_id       = aws_api_gateway_rest_api.gateway_rest.id
  resource_id       = aws_api_gateway_resource.proxy.id
  http_method       = aws_api_gateway_method.proxy.http_method
  status_code       = 200
  depends_on = [aws_api_gateway_integration.gateway_integration]

  response_templates = {
    "application/json" = ""
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
}

resource "aws_api_gateway_method" "options" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_rest.id
  resource_id   = aws_api_gateway_resource.proxy.id
  depends_on = [
    aws_api_gateway_rest_api.gateway_rest,
    aws_api_gateway_resource.proxy
  ]
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "options" {
  rest_api_id       = aws_api_gateway_rest_api.gateway_rest.id
  resource_id       = aws_api_gateway_resource.proxy.id
  http_method       = aws_api_gateway_method.options.http_method
  status_code       = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Headers" = true
  }
}

resource "aws_api_gateway_integration" "options" {
  rest_api_id = aws_api_gateway_rest_api.gateway_rest.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.options.http_method

  type = "MOCK"
}

resource "aws_api_gateway_integration_response" "options" {
  depends_on        = [aws_api_gateway_integration.options,aws_api_gateway_integration.gateway_integration]
  rest_api_id       = aws_api_gateway_rest_api.gateway_rest.id
  resource_id       = aws_api_gateway_resource.proxy.id
  http_method       = aws_api_gateway_method.options.http_method
  status_code       = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Methods" = "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}