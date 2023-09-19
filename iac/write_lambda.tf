resource "aws_lambda_function" "write_lambda" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = data.archive_file.write_lambda.output_path
  function_name = "write_secret"
  role          = aws_iam_role.iam_for_lambda_write.arn
  handler       = "src/write_handler.write_handler"

  source_code_hash = data.archive_file.write_lambda.output_base64sha256

  runtime = "nodejs18.x"

  depends_on = [
    data.archive_file.write_lambda
  ]

  environment {
    variables = {
      TABLE_NAME    = aws_dynamodb_table.dynamo_enc_secrets.name
      CRYPTO_SECRET = random_password.aes_secret.result
      CRYPTO_IV     = random_password.aes_iv.result
    }
  }

}
