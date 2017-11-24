var socket = io();                                                              //OPEN UP WEBSOCKET AND KEEP IT OPEN
  
socket.on('connect', function(){                                                //LISTENER THAT TRIGGERS WHEN USER CONNECTS TO SERVER 
console.log('Connected to server');                                             //PRINTS TO DEVELOPER CONSOLE IN BROWSER
});

socket.on('disconnect', function(){                                             //LISTENER THAT TRIGGERS WHEN USER DISCONNECTS FROM SERVER
console.log('Disconnected from server');
});

socket.on('newUserEntry', function() {                                          //LISTENER THAT TRIGGERS WHEN IT RECIEVES newUserEntry EMISSION FROM SERVER.JS
    console.log('New user');                                                    //CALLBACK SHOULD TRIGGER THE SCRIPTS FOR WHEN A NEW USER IS CREATED
});