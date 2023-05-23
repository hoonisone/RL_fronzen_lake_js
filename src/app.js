// const http = require('http');


// const hostname = '127.0.0.1';
// const port = 3000;
 
// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.end(fs.readFileSync("index.html"));
  
// });
 
// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
const express = require('express');
const http = require('http');
const path = require('path');
// const cors = require("cors");

const app = express()
const __dirname = path.resolve();
const server = http.createServer(app)
const PORT = 8080

app.use('/', express.static("./"))
// app.use('/module/', express.static("./node_modules"))
// app.use(cors({
//   origin: "http://127.0.0.1", // 접근 권한을 부여하는 도메인
//   credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
//   optionsSuccessStatus: 200, // 응답 상태 200으로 설정
// }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html") 
  
});

server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

// module.exports = router;
// module.exports = {
//   devServer: {
//     proxy: {
//       '/api': {
//         target: 'https://api.evan.com',
//         changeOrigin: true,
//         pathRewrite: { '^/api': '' },
//       },
//     }
//   }
// }

// import nj from "numjs"
// var a = nj.array([2,3,4]);
// console.log(a)