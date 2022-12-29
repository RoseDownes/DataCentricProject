var MongoClient = require('mongodb').MongoClient;

var db;
var coll;


MongoClient.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        db = client.db('employeesDB')
        coll = db.collection('employees')
    })
    .catch((error) => {
        console.log(error.message)
    })


var findAll = function () {
    return new Promise((resolve, reject) => {
        console.log(db)
        var cursor = coll.find();
        cursor.toArray()
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var addEmployees = function (employees) {
    return new Promise((resolve, reject) => {
        coll.insertOne(employees)
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

module.exports = { addEmployees, findAll }