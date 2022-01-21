const client = require("./dbConn")

async function executeQuery(query) {
    try {
        client.query("BEGIN");
        let rows = client.query(query);
        await client.query("COMMIT");
        return rows;
    }
    catch (ex) {
        console.log(`Failed to execute somthing ${ex}`);
        client.query("ROLLBACK");
    }
    finally {
        
    }
}

module.exports = {
    executeQuery
};