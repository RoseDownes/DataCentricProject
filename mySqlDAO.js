var pMySQL = require('promise-mysql');
var connection;
pMySQL.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2022',
    insecureAuth: true
}).then((p) => {
    connection = p;
}).catch((e) => {
    console.log('Pool Error ' + e);
});

var getEmployees = function () {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM employee')
            .then((data) => {
                //console.log(data);
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    })
}
var getUpdate = function (eid) {
    return new Promise((resolve, reject) => {
        pool.query(`select * from employee where eid like "${eid}";`)
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

        pool.query(myQuery)
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





module.exports = { getEmployees, updateEmployee, getUpdate, getDepartments }