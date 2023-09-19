locals {
  lambda_dist = "../lambda/dist"
  lambda_src  = "../lambda/src"
}
resource "null_resource" "build_lambda" {
  provisioner "local-exec" {
    command = "./../build.sh"
  }

  triggers = {
    redeployment = sha1(join("", [for f in fileset(local.lambda_src, "*") : filesha1("${local.lambda_src}/${f}")]))
  }
}

data "archive_file" "read_lambda" {
  type        = "zip"
  source_dir  = local.lambda_dist
  output_path = "payload.zip"

  depends_on = [
    null_resource.build_lambda
  ]
}

data "archive_file" "write_lambda" {
  type        = "zip"
  source_dir  = local.lambda_dist
  output_path = "payload.zip"

  depends_on = [
    null_resource.build_lambda
  ]
}
