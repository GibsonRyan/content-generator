/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_SWIFTREACHPROMPTS_ARN
	STORAGE_SWIFTREACHPROMPTS_NAME
	STORAGE_SWIFTREACHPROMPTS_STREAMARN
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "SwiftReachPrompts";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

app.get('/prompt', async function (req, res) {
  const { language, topic } = req.query;

  if (!language || !topic) {
    res.status(400).json({ error: 'Missing required query parameters: language and/or topic' });
    return;
  }

  const queryParams = {
    TableName: tableName,
    IndexName: 'LanguageTopicIndex',
    KeyConditionExpression: 'language = :language AND topic = :topic',
    ExpressionAttributeValues: {
      ':language': language,
      ':topic': topic,
    },
  };

  try {
    const result = await dynamodb.query(queryParams).promise();
    res.status(200).json(result.Items);
  } catch (error) {
    console.error('Error fetching prompts from DynamoDB:', error);
    res.status(500).json({ error: 'Could not fetch prompts' });
  }
});

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
