//run as: forever start index.js

const { exec } = require('child_process');

//cnpm install request --save
//https://github.com/request/request
const request = require('request');

//cnpm install emailjs --save
//https://github.com/eleith/emailjs
const email = require("emailjs/email");

//在https://ngrok.com/ 下载ngrok程序
const command = '/Users/zuojianghua/ngrok http 80';

//配置smtp邮件发送参数
let email_server = email.server.connect({
    user: "@qq.com",
    password: "",
    host: "smtp.qq.com",
    ssl: true
});

let host = '';

setInterval(() => {
    request('http://127.0.0.1:4040', function (error, response, body) {
        // console.log('error:', error); 
        // console.log('statusCode:', response && response.statusCode); 
        // console.log('body:', body); 
        if (response && response.statusCode == 200) {
            let info = /https:\/\/(.*?\.ngrok\.io)/ig.exec(body);
            if (info && info[1]) {
                if (host != info[1]) {
                    console.log('reinit:', info[1]);
                    host = info[1];
                    //发送邮件通知
                    email_server.send({
                        text: "The host has just changed. \n"+info[1],
                        from: "zuo <@qq.com>",
                        to: "zuo <@qq.com>",
                        subject: "Your ngrok host has changed "
                    }, function (err, message) { 
                        console.log(err || message); 
                    });
                }
                console.log('online');
            } else {
                console.log('offline');
            }
        } else {
            console.log('offline');
            console.log('restart');
            const ls = exec(command);
        }
    });
}, 5000);