const username = '';
const password = '';
const host = 'localhost';
const port = '27017';
const database = 'Connections';
const params = '';
const secret = 'MyLittleSecret';

let uri = 'mongodb://';
if (username && password) {
  uri += `${username}:${password}@`;
}

uri += `${host}:${port}/${database}${params}`;

module.exports = {
  mongodb: { uri },
  secret: secret
};
