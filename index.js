//const e = require('express');
var express = require('express')
var app = express();
var ejs = require("ejs");
var mongodbDAO = require('./mongodbDAO');
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
            res.render('edit', { edit: data })
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
        })
})

app.post("/edit/:eid", (req, res) => {

    mysql.updateEmployee(req.body.eid, req.body.ename, req.body.role, req.body.salary)
        .then((data) => {
            res.redirect("/employees")
            console.log(data + "Okay")


        }).catch((error) => {
            console.log(error)

        })

})

app.get('/depts', (req, res) => {
    mysql.getDepartments()
        .then((data) => {
            res.render('depts', { depts: data })
        })
        .catch((error) => {
            res.send(error)
        })
})
app.get('/depts/delete/:did', (req, res) => {

    mysql.deleteDepartment(req.params.did)
        .then((data) => {
            if (data.affectedRows == 0) {
                res.send("<h1>Error Message</h1><h2>" + req.params.did + " cannot be deleted.</h2><hr>" + "<a href='/'>Home</a>")
            } else {
                res.send("<h2> " + req.params.did + " Deleted.</h2>" + "<a href='/'>Home</a>")
            }
        })
        .catch((error) => {
            if (error.code == "ER_ROW_IS_REFERENCED_2") {
                res.send("<h2>Error Message: " + req.params.did + " has employee  and connot be deleted</h2><hr>" + "<a href='/'>Home</a>")
            }
            console.log(error)
        })
})
app.get('/depts/add', (req, res) => {
    res.render("addDepts")
})
//post request
app.post('/depts/add', (req, res) => {
    mysql.checkLocationID(req.body.lid).then((data) => {
        if (data[0] != null) {
            mysql.addDepartment(req.body.did, req.body.name, req.body.lid, req.body.budget)
                .then((data) => {
                    res.redirect("/department")
                })
                .catch((error) => {
                    console.log(error)
                    if (error.message.includes("11000")) {
                        res.send("<h1>_ID: " + req.body.did + " already exists</h1>" + "<a href='/'>Home</a>")
                    } else {
                        res.send(error.message)
                    }
                })
        } else {
            res.send("<h1>" + req.body.lid + " doesn't exist in mySQL </h1>" + "<a href='/'>Home</a>")
        }

    })
        .catch((error) => {
            console.log(error)
        })
})


app.get('/employeesMongodb', (req, res) => {
    mongodbDAO.findAll()
        .then((data) => {
            console.log("Looking for data>>>>");
            res.render('employeesMongodb', { employeesMongodb: data })
        })
        .catch((error) => {
            console.log("NOT Working..");
            console.log(error);
            res.send(error)
        })
})
app.get('/employeesMongoDB/add', (req, res) => {
    res.render("addEmployees")
})
app.post('/employeesMongodb/add', (req, res) => {
    mysql.getUpdate(req.body._id).then((data) => {
        if (data[0] != null) {
            mongodbDAO.addEmployees(req.body._id, req.body.phone, req.body.email)
                .then((data) => {
                    res.redirect("/employeesMongodb")
                })
                .catch((error) => {
                    if (error.message.includes("11000")) {
                        res.send("<h1>_ID: " + req.body._id + " already exists</h1>" + "<a href='/'>Home</a>")
                    } else {
                        res.send(error.message)
                    }
                })
            //That ID does not exist
        } else {
            res.send("<h1>Employee: " + req.body._id + " doesn't in mySQL</h1>" + "<a href='/'>Home</a>")
        }
    })
        .catch((error) => {
            console.log(error)
        })
})
// app.post('/employeesMongodb/add', (req, res) => {
//     mysql.getUpdate(req.body._id)
//         .then((e) => {
//             if (e.length == 0) {
//                 res.send("Unable to add");
//             }
//             else {
//                 console.log(req.body)

//                 mongodbDAO.addEmployees(req.body)
//                     .then((d) => {
//                         res.redirect('/')
//                     }).catch((error) => {
//                         console.log(error)
//                         res.render('error')
//                     })
//             }
//         }).catch((error) => {
//             console.log(error)
//         })
// })


