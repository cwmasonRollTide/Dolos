# Dolos
- Ingest all of the transcripts from larry king live into training data for openAi learning model to mimic speech and content of what they say

## Project Plan

### DolosIngestion
- Run this part locally using a .env file at the root of DolosIngestion/ to 
set your AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and SQS_QUEUE_URL environment variables
- Send GET request using postman or curl, to your 
http://localhost:{port}/ingest?url=https://transcripts.cnn.com/show/lkl
- in order to kick off processing of all the transcripts for this show. Should be other
- shows we can find and update the parser so it can handle more interview transcript formats
- https://transcripts.cnn.com/show/sotu

### DolosTranscriptParser
- Listens to the SQS queue defined in terraform directory. 
- This is populated by
running the DolosIngestion project and sending a page with links to transcripts 
within href tags. 
- There is a test controller for iterative dev
on parsing a single interview. 
- The autoscaling group defined in terraform/main.tf
scales up to five instances to consume the urls of the individual transcripts in the 
SQS queue.
- Each instance has a background service hosted that is polling the queue, and processes
five transcripts at a time
- Translates html of interview transcript into prompt and completion pairs suitable
to train an openAi model
  - Most likely too limited of data although there are over 3,000 interviews stemming
    from this https://transcripts.cnn.com/show/lkl address and there have to be more shows
    they just aren't readily available in the UI and I probably need to scan what's available
    if possible. One would hope other interview transcripts you'd find would have a similar
    enough structure to be parsed by the same project

### Terraform
- DynamoDB table for storing the dataset in your own table in AWS
- SQS Queue populated by running DolosIngestion locally with proper .env variables
  - Have to send base Url of show interview transcripts formatted like the ones
  at http://transcripts.cnn.com/show/lkl
- Fargate task for autoscaling dockerized DolosTranscriptParser. Scales from 1 to 5
instances of the consuming container that each process five messages from the queue at a time

### Github Action in .github/workflows/workflow.yml
- requires AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY in your github actions secrets
- pushes dockerized DolosTranscriptParser to private ECR registry defined in terraform