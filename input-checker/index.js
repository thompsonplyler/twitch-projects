const express = require('express');
const app = express();
const cors = require('cors');
const port = 3003;
const keys = require ('global-keys')
let tabState = {tab:false}

const keyStream = new keys.KeyStream();


const counters = { q: 0 };
app.use(cors())
keyStream.on('data',state=>{
    if (String(state)=="81"){
        counters["q"]++
    }
    
    
})


app.get("/counters", (req, res) => {
    res.send(JSON.stringify(counters));
    res.end();
})

app.get("/tabstate", (req, res) => {
    res.send(JSON.stringify(tabState));
    res.end();
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
