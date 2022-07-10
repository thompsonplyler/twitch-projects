const express = require("express");
const app = express();
const cors = require("cors");
const port = 3010;
const exec = require("child_process").exec;

app.listen(port, () =>
  console.log(`
Example app listening on port ${port}!
`)
);

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

async function getLiveGameAPIAddress() {
  return new Promise((resolve, reject) => {
    const fetch = require("node-fetch");

    exec("tasklist", function (err, stdout, stderr) {
      console.log(stdout);
      const leagueLine = stdout
        .split("\n")
        .filter((l) => l.startsWith("League of Legends.exe"))[0];
      if (leagueLine == null) {
        reject("No League of Legends client found");
        return;
      }
      const words = leagueLine
        .split(" ")
        .filter((s) => s.length)
        .map((s) => s.trim());
      // console.log(`pid = ${words[3]}`);

      exec("netstat -ano", async function (err, stdout, stderr) {
        const lines = stdout.split("\n");
        // console.log(lines[0]);
        const tcpConnections = lines.filter(
          (w) => w.indexOf(words[3]) >= 0 && w.indexOf("LISTENING") >= 0
        );

        for (let conn of tcpConnections) {
          const connectionData = conn.split(" ").filter((s) => s.length);
          // console.log(connectionData);
          try {
            const response = await fetch(
              `https://${connectionData[1]}/liveclientdata/allgamedata`
            );

            if (response.ok) {
              resolve(connectionData[1]);
              return;
            }
          } catch (e) {
            // console.error(e);
          }
        }

        reject("Unable to determine web server!");
      });
    });
  });
}

getLiveGameAPIAddress().then(console.log);
