var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyzG8AODPdzdkhjG'}).base('appOY7Pr6zpzhQs6l');

exports.addUserToGroups = function(userRecordId){
    return new Promise((resolve,reject)=>{
        base('Users').find(userRecordId, function(err, record) {                //FIND USER RECORD
            if (err) { console.error('User not found', err); return; }
            else {
                var userRecordID = record.getId();
                var userArea = record.get('Area');
                var interests = record.get('All Interests').split(",");
                console.log(record.get('Full Name'), userRecordID, userArea, interests);
                
                interests.forEach(function(interest){                           //FOR EACH INTEREST & AREA, CHECK TO SEE IF GROUP EXISTS
                    var formula = `AND({Interest} = "${interest}", {Area Record ID} = "${userArea}")`;
                    
                    base('Groups').select({
                        filterByFormula: formula
                    }).firstPage(function(err, records) {
                        if (err) { console.error(err); return; }
                        else if(records.length===0){                                // IF GROUP NOT FOUND...
                            var interestFormula = `{Interest} = "${interest}"`;     //...RETRIEVE INTEREST ID...
                            base('Interests').select({
                                filterByFormula: interestFormula,
                                maxRecords: 1
                            }).firstPage(function(err, records) {
                                if (err) { console.error(err); return; }
                                records.forEach(function(record) {
                                    var interestRecordId = record.getId();
                                    base('Groups').create({                         //...CREATE NEW GROUP...
                                      "Interest": [interestRecordId],
                                      "Area": userArea,
                                      "Users": [userRecordID]                       //...AND ADD NEW USER TO GROUP
                                    }, function(err, record) {
                                        if (err) { console.error(err); return; }
                                        console.log("New group:",record.get('Name'));
                                    });
                                });
                            });
                        } else {                                                    //ELSE IF GROUP FOUND...       
                            // console.log("Record found!");
                            records.forEach(function(record) {
                                var groupRecordId = record.getId();
                                var users = record.get('Users');                    //...GET CURRENT ARRAY OF USERS...
                                users.push(userRecordID);                           //...PUSH NEW USER INTO ARRAY...

                                base('Groups').update(groupRecordId, {
                                  "Users": users                                    //...AND UPDATE USER GROUP
                                }, function(err, record) {
                                    if (err) { console.error(err); return; }
                                    console.log("Updated:",record.get('Name'));
                                });
                            });
                        }
                    });
                });
                
                setTimeout(()=>{resolve(userArea[0])},6000);
                
            }
        });
    })
    .catch((err)=>{
      console.log('ERROR AT ADD USER TO GROUPS:',err); 
    });
};

