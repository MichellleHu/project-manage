module.exports = function(app) {
  var mongoDs = app.dataSources.mongodb;
  mongoDs.automigrate('AccessToken', function(err){
    if(err) throw err;
  });
  // mongoDs.automigrate('Ouser', function(err){
  //   if(err) throw err;

  //   var Ouser = app.models.Ouser;
  //   var Role = app.models.Role;
  //   var RoleMapping = app.models.RoleMapping;

  //   Ouser.create([
  //     {username: 'admin', email: 'admin@e.com', password: '12345', emailVerified: true}
  //     ], function(err, users) {
  //     if (err) throw err;
  //     mongoDs.automigrate('Role', function(err){
  //       if(err) throw err;
  //       mongoDs.automigrate('RoleMapping', function(err){
  //         if(err) throw err;
  //         var userid = users[0].id;
  //         Role.create({
  //         name: 'admin'
  //         }, function(err, role) {
  //           console.log('Created role:', role);

  //           role.principals.create({
  //           principalType: RoleMapping.USER
  //           , principalId: userid
  //           }, function(err, principal) {
  //           if (err) throw err;
  //             console.log('Created principal:', principal);
  //           });
  //         });
  //       });
  //     });
  //   });
  // });
};
