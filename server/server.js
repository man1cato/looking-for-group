const express = require('express');                     //THE ONLY FILE WHERE EXPRESS IS EVER USED
const app = express();
const path = require('path');
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 8080;

app.use(express.static(publicPath));

app.get('*', (req, res) => {                                //MATCH ALL UNMATCHED ROUTES
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
    console.log('Server is up');
});