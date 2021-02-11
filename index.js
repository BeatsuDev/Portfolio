const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')

// The webpage to host
// Set up this way to easily switch between different websites. I'm trying
// out things here, cuz I suck at design...
webpage = "PointPage"
app = express()

privateKey = fs.readFileSync('sslcert/privkey.pem', 'utf8')
certificate = fs.readFileSync('sslcert/cert.pem', 'utf8')
ca = fs.readFileSync('sslcert/chain.pem', 'utf8')

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/.webpages/' + webpage + '/index.html')
});


httpsServer = https.createServer(credentials, app)
httpServer = http.createServer(app)


app.use(express.static(__dirname + '/.webpages/' + webpage + '/public'))
httpsServer.listen(8443, () => console.log('HTTPS server listening on port 8443'))
httpServer.listen(8080, () => console.log('HTTP server listening on port 8080'))