const ioHook = require('iohook');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;


const counters = { q: 0 };
app.use(cors())


ioHook.on("keypress", event => {
    if (event.rawcode == 81) {
        counters["q"]++
    }
})


app.get("/counters", (req, res) => {
    res.send(JSON.stringify(counters));
    res.end();
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

ioHook.start();