resource "aws_api_gateway_rest_api" "api" {
  name = "rtb"
}

# ─────────────────────────────────────────────────
# Secret reader
# ─────────────────────────────────────────────────
resource "aws_api_gateway_resource" "resource" {
  path_part   = ""
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.api.id
  depends_on  = [aws_api_gateway_rest_api.api]
  lifecycle {
    ignore_changes = [
      // this is a bit of a hack for localstack;
      // for some reason the parent id gets mapped to the id
      parent_id
    ]
  }
}

resource "aws_api_gateway_method" "get" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.resource.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.querystring.id" = true
  }

}


resource "aws_api_gateway_method" "post" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.resource.id
  http_method   = "POST"
  authorization = "NONE"
}

