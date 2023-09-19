// todo still! cloudwatch logging
data "aws_iam_policy_document" "read_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda_read" {
  name               = "iam_for_read_lambda"
  assume_role_policy = data.aws_iam_policy_document.read_assume_role.json
}

data "aws_iam_policy_document" "lambda_read_dynamo" {
  statement {
    effect = "Allow"

    actions = [
      "dynamodb:Query",
      "dynamodb:DeleteItem",
    ]

    resources = [
      aws_dynamodb_table.dynamo_enc_secrets.arn
    ]
  }
}

resource "aws_iam_policy" "read_from_dynamo" {
  name        = "lambda_dynamo_read"
  path        = "/"
  description = "query a dynamodb instance"
  policy      = data.aws_iam_policy_document.lambda_read_dynamo.json
}

resource "aws_iam_role_policy_attachment" "lambda_read" {
  role       = aws_iam_role.iam_for_lambda_read.name
  policy_arn = aws_iam_policy.read_from_dynamo.arn
}
