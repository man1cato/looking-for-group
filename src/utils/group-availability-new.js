var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyzG8AODPdzdkhjG'}).base('appOY7Pr6zpzhQs6l');


exports.populateGroupAvailability = function(areaRecordId){
    var formula = `{Area Record ID} = '${areaRecordId}'`;
    base('Groups').select({
        filterByFormula: formula                                                //FIND ALL GROUPS BELONGING TO USER'S AREA
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        records.forEach(function(record) {                                      //FOR EACH GROUP...
            console.log('Retrieved', record.get('Name'));
            var groupRecordId = record.getId();
            var usersRecordIds = record.get('Users');                           //...GET ARRAY OF GROUP MEMBERS...
            var groupAvailability = {};                                         //...SET GROUP AVAILABILITY AS AN EMPTY OBJECT...
            if (err) { console.error(err); return; }
            else {                                                   
                createGroupAvailability(groupRecordId,usersRecordIds,groupAvailability);    //...THEN CALL CREATE GROUP AVAILABILITY FUNCTION
            } 
        });
    });
};


//******** FUNCTIONS **********//

//PARSE USERS & BUILD GROUP AVAILABILITY
function createGroupAvailability(groupRecordId,usersRecordIds, groupAvailability){
    var targetUser = usersRecordIds.shift();
    if(targetUser){                                                         //FOR SELECTED USER IN THE GROUP...
        getUserAvailability(targetUser).then((response)=>{                  //...CALL GET USER AVAILABILITY FUNCTION TO RETURN USER AVAILABILITY ARRAY...
            return updateGroupAvailability(groupAvailability,response);     //...THEN CALL UPDATE GROUP AVAILABILITY FUNCTION TO RETURN UPDATED GROUP AVAILABILITY OBJECT
        }).then((response)=>{
            createGroupAvailability(groupRecordId,usersRecordIds,response); //TRIGGER RECURSION TO GO TO NEXT USER
        });
    } else {                                                                
        for (var prop in groupAvailability){
            if (groupAvailability[prop] < 4){                               //IF AVAILABILITY COUNT IS LESS THAN 4...
                delete groupAvailability[prop];                             //...DELETE THAT AVAILABILITY FROM GROUP AVAILABILITY OBJECT
            }
        }
        console.log('Group availability:',groupAvailability);
        
        var finalGroupAvailability = Object.keys(groupAvailability);        //CONVERT THE GROUP OBJECT TO AN ARRAY BY REMOVING COUNT VALUES...
        
        base('Groups').update(groupRecordId, {
          "Group Availability": finalGroupAvailability                      //...THEN UPDATE GROUP AVAILABILITY RECORD
        }, function(err, record) {
            if (err) { console.error(err); return; }
                console.log('Record updated:',record.get('Name'));
        });
    }
}


//PROVIDE USER AND RETURN THEIR AVAILABILITY
let getUserAvailability = function(targetUser){
    return new Promise(function(resolve,reject){
        base('Users').find(targetUser, function(err, record) {
            if (err) { console.error(err); return; }
            var userAvailability = record.get('Availability');
            resolve(userAvailability);  //array
        });
    });
};


//PROVIDE A USER'S AVAILABILITY ARRAY AND A GROUP OBJECT AND UPDATE THE GROUP OBJECT WITH THE USER'S AVAILABILITY 
let updateGroupAvailability = function(groupAvailability, userAvailability){
    return new Promise(function(resolve,reject){
        var targetAvailability = userAvailability.shift();
        if (targetAvailability) {
            if(groupAvailability.hasOwnProperty(targetAvailability) == false){                      //IF GROUP AVAILABILITY DOES NOT ALREADY CONTAIN TARGET AVAILABILITY...
                groupAvailability[targetAvailability] = 1;                                          //...ADD IT TO GROUP OBJECT AND SET "COUNT" VALUE TO 1
            } else {                                                             
                groupAvailability[targetAvailability] = groupAvailability[targetAvailability] + 1;  //ELSE INCREASE COUNT BY 1
            }
            updateGroupAvailability(groupAvailability,userAvailability);                            //TRIGGER RECURSION TO GO TO NEXT AVAILABILITY
        }
        resolve(groupAvailability);                                                                 //RETURN OBJECT CONTAINING KEY:VALUE PAIRS OF AVAILABILITY:COUNT
    });
};

