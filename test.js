let ussername = 'xander';
let password = 'password';

let obj = new Object();

obj[ussername] = new Object();
obj[ussername][ussername] = ussername;
obj[ussername][password] = password;

console.log(obj)