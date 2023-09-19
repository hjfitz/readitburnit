resource "aws_lambda_function" "read_lambda" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = data.archive_file.read_lambda.output_path
  function_name = "read_secret"
  role          = aws_iam_role.iam_for_lambda_read.arn
  handler       = "src/read_handler.read_handler"

  source_code_hash = data.archive_file.read_lambda.output_base64sha256

  runtime = "nodejs18.x"

  depends_on = [
    data.archive_file.read_lambda
  ]

  environment {
    variables = {
      TABLE_NAME    = aws_dynamodb_table.dynamo_enc_secrets.name
      CRYPTO_SECRET = random_password.aes_secret.result
      CRYPTO_IV     = random_password.aes_iv.result
    }
  }

}
