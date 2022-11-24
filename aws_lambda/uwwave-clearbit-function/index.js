const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const dynamo = new AWS.DynamoDB.DocumentClient();

var clearbit = require("clearbit")("sk_35846bd98a0983e90d50fe22603a9a01");

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      //   case "DELETE /items/{id}":
      //     await dynamo
      //       .delete({
      //         TableName: "http-crud-tutorial-items",
      //         Key: {
      //           id: event.pathParameters.id
      //         }
      //       })
      //       .promise();
      //     body = `Deleted item ${event.pathParameters.id}`;
      //     break;
      case "GET /items/{company}":
        body = await dynamo
          .get({
            TableName: "uwwave-clearbit-items",
            Key: {
              company: event.pathParameters.company,
            },
          })
          .promise();
        break;
      case "GET /items":
        body = await dynamo
          .scan({ TableName: "uwwave-clearbit-items" })
          .promise();
        break;
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        // await dynamo
        //   .put({
        //     TableName: "uwwave-clearbit-items",
        //     Item: {
        //       company: requestJSON.company,
        //       url: requestJSON.url,
        //       logo: requestJSON.logo,
        //     },
        //   })
        //   .promise();
        // body = `Put item ${requestJSON.company}`;

        // var response = await clearbit.Domains.find({
        //   domain: requestJSON["company"],
        // }).promise();

        await dynamo
          .put({
            TableName: "uwwave-clearbit-items",
            Item: requestJSON,
          })
          .promise();
        body = `Put item ${requestJSON["name"]}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
