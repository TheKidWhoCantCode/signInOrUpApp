const express = require('express');
const path = require('path');
const { Socket } = require('socket.io');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
app.use(express.static("."));

var accounts = JSON.parse(fs.readFileSync('./accounts.json').toString());

function signUp(accountInfo) {
    
    accounts = JSON.parse(fs.readFileSync('./accounts.json').toString());

    if (!Object.keys(accounts).includes(accountInfo.username)) {

        let username = accountInfo.username;
        let password = accountInfo.password;

        let account = new Object();

        account[username] = new Object();
        account[username] = { 
            ussername: username,
            password: password
        }

        fs.writeFile('./accounts.json', JSON.stringify(account, null, 2), function(err) {
            if (err) throw err;
            console.log('signed up')
        });

        return;
    } else {
    console.log(`account exists:  "${accountInfo.username}"`);
    }
}

function signIn(accountInfo) {

    accounts = JSON.parse(fs.readFileSync('./accounts.json').toString());

    if (Object.keys(accounts).includes(accountInfo.username) && accounts[accountInfo.username].password === accountInfo.password) {

        console.log('signed in!')

    } else {

        console.log(`account does not exists exist or password incorrect ussername:  "${accountInfo.username}"`);

    }
}




app.get('/', function (req, res) {
    res.sendFile(
        path.join(__dirname, 'index.html')
    )
});

io.on('connection', (socket) => {
    console.log('new connection');
    socket.on('disconnect', () => {
        console.log('disconnected');
    });

    socket.on('signIn', accountInfo => {
        console.log('signing In...');
        console.log(accountInfo);

        signIn(accountInfo);
        
    });
    socket.on('signUp', accountInfo => {
        console.log('signing Up...')
        console.log(accountInfo);

        signUp(accountInfo);
        
    });
});

server.listen(3000, () => {
    console.log('started server');
});
