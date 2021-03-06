const express  = require("express")
const bodyParser = require("body-parser")
const  xml = require('object-to-xml')
const  fs = require('fs')

const app = express()
const port = process.env.PORT || 1337;

const fileName = 'log.txt'
const covid19ImpactEstimator = require("./estimator")


const log = (req,res) => {
    if(req.originalUrl == "/" || req.originalUrl == "/favicon.ico"){
        return
    }else{
        const duration = Date.now() - req.body.start;
        duration = duration < 10 ? "0"+(duration+"") : duration;
        fs.appendFile(fileName,`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms\n`, function (err) {
        if (err) return console.log(err);
    })}
}

app.get("/api/v1/on-covid-19/logs", (req,res) => {    
    const logs = fs.readFileSync(fileName);
    res.type("text/plain")
    console.log(req.body,logs);
    
    return res.send(logs)
})


app.use(bodyParser.json({ extended: true }));


app.post(['/api/v1/on-covid-19','/api/v1/on-covid-19/json'], (req, res,next) => {
    req.body.start = Date.now()
    res.on("finish",() => {
       log(req,res)
    })
    console.log(req.body,covid19ImpactEstimator(req.body))
    return res.json(covid19ImpactEstimator(req.body));

})


app.get("/clear", (req,res) => {
    fs.unlink
    return res.send("Done")
})
app.post('/api/v1/on-covid-19/xml', (req, res,next) => {
    req.body.start = Date.now()
    res.type('application/xml');
    log(req,res)
    console.log(req.body,xml(covid19ImpactEstimator(req.body)))
    return res.send(xml(covid19ImpactEstimator(req.body)))
})


// app.use((req,res) => {
//     req.body.start = Date.now()
//     res.status(400)
//     log(req,res)
//    return res.send("Not found")
// })

app.listen(port, () => console.log(`Example app listening at ${port}`))