/*eslint-disable*/
const express = require('express');
const app = express();
const port = 8100;

app.get('/', (req, res) => res.send('Wizard server!'));

app.listen(port, () => console.log(`Wizard server listening on port ${port}!`));
