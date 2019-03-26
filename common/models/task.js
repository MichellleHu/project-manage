'use strict';

module.exports = function(Task) {
  Task.test = function(content, cb){
    var dataSource = Task.app.datasources.db;
    // dataSource.Task.find({}).sort({"name":-1})
  	cb(null, content);
  };

  Task.remoteMethod(
    'test', {
      description: '输入一个字符串，返回它',
      accepts: [
        {arg: 'content', type: 'string',required: true}
       ],
       http: {path:'/test', verb: 'get'},
       returns : { arg: 'ret', type:"string", root: true,required: true}
    }
  );

};
