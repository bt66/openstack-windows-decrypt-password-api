const express = require('express')
const { exec } = require("child_process");
const openssl = require('openssl-nodejs')
const fs = require('fs');
const app = express()
const multer = require("multer");
const path = require("path");
const port = 3000

app.use(express.json())

const diskStorage = multer.diskStorage({
    // konfigurasi folder penyimpanan file
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/uploads"));
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

app.post('/decrypt-password',
    multer({ storage: diskStorage }).single("cert"),
    (req, res) => {
    // console.log(req.file)
    // console.log(req.file.filename)
    // console.log(req.body.encryptedPassword)
    // console.log(req.file.path)
    const plain = Buffer.from(req.body.encryptedPassword, 'base64')
    // console.log(plain)
    fileName = './decoded-password/decryptResult-'+ Date.now()
    fs.writeFile(fileName, plain, err => {
        if (err) {
            // console.error(err);
            res.send(err)
        }
        command = "openssl rsautl -decrypt -inkey "+req.file.path+" -in "+ fileName
        exec(command, (error, stdout, stderr) => {
            if (error) {
                // console.error(`exec error: ${error}`);
                res.send(stderr)
                // return;
            }
            // console.log(`stdout: ${stdout}`);
            // console.error(`stderr: ${stderr}`);
            // console.log(plain)
            res.json({"decryptedPassword": stdout})
            fs.unlinkSync(req.file.path);
            fs.unlinkSync(fileName);
        });
    });
})

app.listen(port, () => {
    console.log(`Decrypt password API listen on port ${port}`)
})
