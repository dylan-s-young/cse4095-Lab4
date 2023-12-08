const express = require('express')
const app = express();
const PORT = 5001;

const sql = require('mssql');

const config = {
    host: 'myserverdsy1.database.windows.net',
    user: 'azureuser',
    password: 'azureServerAdmin1',
    server: 'myserverdsy1.database.windows.net',
    database: 'dsyDB',
    port: 1433,
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

function no_cors_setup(res) {

    //Access-Control-Allow-Origin
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);
    //console.log("no-cors done");
}

app.get('/select', async (req, res, next) => {
    no_cors_setup(res);
    try {
        var returnTable = []
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(`SELECT * from poi`);

        console.log(`${resultSet.recordset.length} rows returned.`);

        // output column headers
        var columns = "";
        for (var column in resultSet.recordset.columns) {
            columns += column + ", ";
        }
        console.log("%s\t", columns.substring(0, columns.length - 2));

        // ouput row contents from default record set

        resultSet.recordset.forEach(row => {
            console.log("%s\t%s", row.name, row.address);
            returnTable.push({
                "Name": row.name,
                "id": row.id,
                "address": row.address
            })
        });

        // close connection only when we're certain application is finished
        poolConnection.close();
        res.send(returnTable)
    } catch (err) {
        console.error(err.message);

        //Send Error Code
        res.status(500).send()
    }
});

//Should be post 
app.get('/insert/:Name/:id/:address', async (req, res, next) => {
    no_cors_setup(res)
    try {
        // Connect to DB
        var poolConnection = await sql.connect(config);

        const command = "INSERT into poi (name, id, address) VALUES " + `('${req.params.Name}', '${req.params.id}', '${req.params.address}')`;

        console.log(command)

        await poolConnection.request().query(command, (err, results, fields) => {
            if (err) {
                console.error('Error inserting data:', err);
            } else {
                console.log('Data inserted successfully');
            }
            // close connection only when we're certain application is finished
            poolConnection.close();
        });

    } catch (err) {
        console.error(err.message);
    }
})



app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})