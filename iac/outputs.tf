output "read_url" {
  value = aws_api_gateway_stage.secret_reader.invoke_url
}

output "localstack_url" {
  value = "https://${aws_api_gateway_rest_api.api.id}.execute-api.localhost.localstack.cloud:4566/${aws_api_gateway_stage.secret_reader.stage_name}"
}


output "write_url" {
  value = aws_api_gateway_stage.secret_writer.invoke_url
}
