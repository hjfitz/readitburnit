data "aws_iam_policy_document" "write_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda_write" {
  name               = "iam_for_write_lambda"
  assume_role_policy = data.aws_iam_policy_document.write_assume_role.json
}


data "aws_iam_policy_document" "lambda_put_dynamo" {
  statement {
    effect = "Allow"

    actions = [
      "dynamodb:PutItem"
    ]

    resources = [
      aws_dynamodb_table.dynamo_enc_secrets.arn
    ]
  }
}

resource "aws_iam_policy" "write_from_dynamo" {
  name        = "lambda_dynamo_write"
  path        = "/"
  description = "query a dynamodb instance"
  policy      = data.aws_iam_policy_document.lambda_put_dynamo.json
}

resource "aws_iam_role_policy_attachment" "lambda_write" {
  role       = aws_iam_role.iam_for_lambda_write.name
  policy_arn = aws_iam_policy.write_from_dynamo.arn
}
