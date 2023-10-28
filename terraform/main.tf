terraform {
  cloud {
    organization = "dolos"
    workspaces {
      name = "dolos"
    }
  }
}

resource "aws_dynamodb_table" "dolos_parsed_transcripts" {
  name                 = "dolos-parsed-interview-transcripts"
  billing_mode         = "PAY_PER_REQUEST"
  attribute {
    name               = "guest"
    type               = "S"
  }
  hash_key             = "guest"
  ttl {
    enabled            = true
    attribute_name     = "expiryPeriod"
  }
  point_in_time_recovery {
    enabled = true
  }
}

