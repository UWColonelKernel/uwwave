zip -r ./lambda.zip *

aws lambda update-function-code --function-name arn:aws:lambda:us-east-2:789855287082:function:uwwave-clearbit-function --zip-file fileb://lambda.zip

curl -v -X "PUT" -H "Content-Type: application/json" -d "{\"company\": \"google\"}" https://842gb0w279.execute-api.ca-central-1.amazonaws.com/items