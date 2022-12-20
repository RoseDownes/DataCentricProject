//const e = require('express');
var express = require('express')
var app = express();
var ejs = require("ejs");
//var mongoDAO = require("./mongoDAO");
var mysql = require('./mySqlDAO')

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

app.set("view engine", "ejs")

app.listen(3004, () => {
    console.log("Server is listening on port 3004 :)");
});

app.get('/', (req, res) => {
    console.log("Get Request on /")
    res.render('about');
})
app.get('/deleteDept', (req, res) => {
    console.log("Get Request Recieved to delete depts info")
    res.render('deletedept')
})

app.get('/employees', (req, res) => {
    mysql.getEmployees()
        .then((data) => {
            res.render('employees', { employees: data })
        })
        .catch((error) => {
            res.send(error)

        })
})

app.get('/edit/:eid', (req, res) => {
    mysql.getUpdate(req.params.eid)
        .then((data) => {
            console.log(data)
            res.render('edit', { edit: data[0] })
        })
        .catch((error) => {
            console.log(error)
            if (error.errno == 1146) {
                res.send("Invalid table: " + error.sqlMessage)
            }
            else {
                res.send(error)
            }

        })

})

app.post("/edit/:eid", (req, res) => {

    mysql.updateEmployee(req.body)
        .then((data) => {
            console.log(data + "Okay")


        }).catch((error) => {
            console.log("Not Okay" + error)

        })
    res.redirect('/employees')

})

app.get('/dept', (req, res) => {
    mysql.getDept()
        .then((data) => {
            //res.send(data)
            res.render('depts', { depts: data })
        })
        .catch((error) => {
            if (error.errno == 1146) {
                res.send("Invalid table: " + error.sqlMessage)
            }
            else (
                res.send(error)
            )

        })
})

