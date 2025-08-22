import * as net from 'net';
import * as fs from 'fs/promises';

// Creating the TCP server
const server = net.createServer();
const htmlFilepath = './html/';

server.on("connection", handleNewConnection);
server.on("error", (err) => {
    console.log("Server error:", err);
});

function handleNewConnection(socket) {
    console.log("New Connrction!");

    socket.on("data", async (data) => {
        const request = new TextDecoder().decode(data);
        const splitRequest = request.split(" ");
        let htmlFile;

        if (splitRequest.length !== 2){
            socket.write("Error: Incomplete request");
            socket.end();
            return;
        }

        const requestType = splitRequest[0];;

        if (splitRequest[1].trim() === "/"){
            htmlFile = "index.html";
            console.log("Serving index.html");
        } else {
            htmlFile = splitRequest[1].slice(1);
        }

        if (requestType !== "GET"){
            socket.write("Error: Unsupported request type, Only GET requests are supported");
            socket.end();
            return;
        }

        try{
            const filePath = htmlFilepath + htmlFile;
            const fileData = await fs.readFile(filePath);
            socket.write(fileData);
        } catch (err) {
            socket.write("Error: Requested resource does not exist!");
        }

        socket.end();
    });

    socket.on("end", () => {
        console.log("Connection closed!");
    });
}

server.listen({ host: "127.0.0.1", port: 3000}, () => {
    console.log("Server is listening on port 3000");
})
