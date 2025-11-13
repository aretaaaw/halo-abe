const express = require('express')

const app=express()

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/pages/halo.html");
});

app.get('/daftar', (req, res) => {
    res.sendFile(__dirname + "/pages/halo.html");
});

app.get('/public/:file', (req, res) => {
    res.sendFile(__dirname + "/public/" + req.params.file)
})

app.listen(8080, () => {
    console.log("http://localhost:8080/")
})