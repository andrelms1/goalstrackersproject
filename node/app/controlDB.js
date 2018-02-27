var sqlite3 = require('sqlite3').verbose();

exports.createDB = function(path){

	var db = new sqlite3.Database(path+'/DB');

	db.run("CREATE TABLE IF NOT EXISTS visitors (endpoint VARCHAR(250), expirationTime VARCHAR(50), key256 VARCHAR(250), keyAuth VARCHAR(250)  )");

	db.close();
};

exports.insert = function(path, endpoint, expirationTime, key256, keyAuth){

	var db = new sqlite3.Database(path+'/DB');

	var stmt = db.prepare("INSERT INTO visitors VALUES (?,?,?,?)");

	stmt.run(endpoint,expirationTime,key256,keyAuth);

	stmt.finalize();

	db.close();
};

exports.select = function(path){

	var db = new sqlite3.Database(path+'/DB');

	db.serialize(function(){

		db.each("SELECT * from visitors", function(err, row){					console.log(row);
		});
	});	

	db.close();

};


exports.getUsers = function(path, callback){

	var db = new sqlite3.Database(path+'/DB');

        db.serialize(function() {

        db.all("SELECT * from visitors", function(err, allRows) {

            if(err != null){
                console.log(err);
                callback(err);
            }

            callback(allRows);
            db.close();

        });

    });

}