import * as net from "net";

const client = net.createConnection({ port: 3000 }, () => {
  const request = "GET /index.html";

  client.write(request);
});

client.on("data", (data) => {
  console.log(data.toString());
  client.end();
});
