/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "SwiftReachHistory";

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

app.get('/history', function(req, res) {
  const { userId } = req.query;
  
  const params = {
    TableName: tableName,
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    }
  };

  dynamodb.scan(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error fetching history" });
    } else {
      res.json(data.Items);
    }
  });
});

app.post('/history', function(req, res) {
  const { userId, type, history } = req.body;
  if (history.length === 0) res.status(200).json({ success: "No history to save" });

  const newItem = {
    id: uuidv4(),
    userId,
    type,
    history
  };

  const params = {
    TableName: tableName,
    Item: newItem
  };

  dynamodb.put(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error saving history" });
    } else {
      res.json(newItem);
    }
  });
});

app.delete('/history/:id', function(req, res) {
  const { id } = req.params;

  const params = {
    TableName: tableName,
    Key: {
      id
    }
  };

  dynamodb.delete(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error deleting history" });
    } else {
      res.json({ success: "History deleted", id: uuid });
    }
  });
});

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
