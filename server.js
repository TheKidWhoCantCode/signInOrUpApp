const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db');
const path = require('path');
const { Socket } = require('socket.io');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
app.use(express.static("."));

var accounts = new Object;

let db;
connectToDb(err => {
    if (!err) {
        console.log('connected to database')
        db = getDb();
        getAccounts();
    } else {
        console.log(`error connecting to database, err: ${err}`);
    }
})


function signUp(accountInfo) {
    
    getAccounts();

    if (!Object.keys(accounts).includes(accountInfo.username)) {

        let username = accountInfo.username;
        let password = accountInfo.password;

        accounts[username] = new Object();
        accounts[username] = { 
            ussername: username,
            password: password
        };

        updateAccounts(accounts[username]);

        return;
    } else {
        io.emit('accountErr', 'Username taken');
        console.log(`account exists:  "${accountInfo.username}"`); 
    }
}

function signIn(accountInfo) {

    getAccounts;

    if (Object.keys(accounts).includes(accountInfo.username) && accounts[accountInfo.username].password === accountInfo.password) {

        console.log('signed in!');

    } else {

        io.emit('accountErr', 'Username or password incorrect');
        console.log(`account does not exists! ussername:  "${accountInfo.username}"`);

    }
}


function getAccounts() {
    console.log('geting data');
    db.collection('accounts')
        .find() // cursor toArray forEach
        .sort( { username: 1 })
        .forEach(account => {
            accounts[account.username] = new Object();
            accounts[account.username] = { 
                ussername: account.username,
                password: account.password
            };
        })
        .then(() => {
            console.log(accounts);
        })
        .catch(err => { 
            console.log(err);
            res.status(500);
        });
}
function updateAccounts(obj) {
    db.collection('accounts')
        .insertOne(obj);
    getAccounts();
}

app.get('/', function (req, res) {
    res.sendFile(
        path.join(__dirname, 'index.html')
    );
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

server.listen(3000, () => {+
    console.log(accounts);
    console.log('started server');
});
