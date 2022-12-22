var pMySQL = require('promise-mysql');
var connection;
pMySQL.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2022',
    insecureAuth: true
}).then((data) => {
    connection = data;
}).catch((e) => {
    console.log('Pool Error ' + e);
});

var getEmployees = function () {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM employee')
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    })
}
var getUpdate = function (eid) {
    return new Promise((resolve, reject) => {
        var mySqlQuery = {
            sql: 'select * from employee where eid=?',
            values: [eid]
        }
        connection.query(mySqlQuery)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

var updateEmployee = function (employee) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: `Update employee set ename =?, role =?, salary = ? where eid like "${employee.eid}";`,
            values: [employee.ename, employee.role, employee.salary]
        }

        connection.query(myQuery)
            .then((data) => {
                console.log(data)
            })
            .catch(error => {
                console.log(error)
            })
    })
}


var getDepartments = function () {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM dept')
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

var deleteDepartment = function (did) {
    return new Promise((resolve, reject) => {
        var mySqlQuery = {
            sql: 'delete from dept where did = ?',
            values: [did]
        }

        connection.query(mySqlQuery)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var addDepartment = function (did, dname, lid, budget) {
    return new Promise((resolve, reject) => {
        var mySqlQuery = {
            sql: 'INSERT INTO dept (did, dname, lid, budget) values (?,?,?,?)',
            values: [did, dname, lid, budget]
        }

        connection.query(mySqlQuery)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}




module.exports = { getEmployees, updateEmployee, getUpdate, getDepartments, deleteDepartment, addDepartment }