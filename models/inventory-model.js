const pool = require("../database/")

/* Get all classification data  */

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function isClassificationValid(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.classification WHERE classification_id = $1`,
            [classification_id]
        );
        return data.rowCount > 0;
    } catch (error) {
        throw error;
    }
}


// Get all  inventory items and classification_id
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(`
            SELECT * FROM public.inventory AS i
        JOIN public.classification AS c
        ON i.classification_id = c.classification_id
        WHERE i.classification_id = $1`,
            [classification_id])

        return data.rows
    } catch (error) {
        console.error("getInventoryByClassificationId error " + error)
    }
}


/* ***************************
 *  Get inventory and classification data by inv_id
 *  Assignment 3, Task 1
 * ************************** */
async function getInventoryById(invId) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1",
            [invId]
        )
        return data.rows[0]
    } catch (error) {
        console.error(error, 'getInventoryById error');
    }
}

async function getDetailsByInventoryId(inv_id) {
    try {
        const data = await pool.query("SELECT * FROM public.inventory AS i WHERE i.inv_id = $1",
            [inv_id]
        );
        console.log(inv_id, 'get inv by id');

        return data.rows[0];
    } catch (error) {
        throw Error("getdetailsbyclassificationid error " + error);
    }
}

/* ***************************
 *  Get all inventory details by inv_id
 * ************************** */
async function getInventoryByInvId(inv_id) {
    try {
        const data = await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1",
            [inv_id]
        );
        console.log(inv_id, 'get inv by id');

        return data.rows[0]; //Returns one row with vehicle details
    } catch (error) {
        throw Error("getInventoryByInvID error " + error);
    }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
    try {
        const sql =
            "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
        return await pool.query(sql, [classification_name]);
    } catch (error) {
        throw error;
    }
}

/* ***************************
 *  Add new inventory
 * ************************** */
async function addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
) {
    try {
        const sql =
            "INSERT INTO public.inventory (classification_id, " +
            "inv_make, inv_model, inv_description, inv_image, inv_thumbnail, " +
            "inv_price, inv_year, inv_miles, inv_color) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) " +
            "RETURNING *";

        return await pool.query(sql, [
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
        ]);
    } catch (error) {
        return error.message;
    }
}

/* ***************************
 *  Edit inventory
 * ************************** */
async function editInventory(
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
) {
    try {
        const sql =
            "UPDATE public.inventory SET inv_make = $1, " +
            "inv_model = $2, inv_description = $3, inv_image = $4, " +
            "inv_thumbnail = $5, inv_price = $6, inv_year = $7, " +
            "inv_miles = $8, inv_color = $9, classification_id = $10 " +
            "WHERE inv_id = $11 RETURNING *";
        const data = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            inv_id,
        ]);
        return data.rows[0];
    } catch (error) {
        console.error("model error: " + error);
        throw error;
    }
}

/* ***************************
 *  Edit inventory
 * ************************** */
async function deleteInventory(inv_id) {
    try {
        const sql = "DELETE FROM public.inventory WHERE inv_id = $1";
        const data = await pool.query(sql, [inv_id]);
        return data;
    } catch (error) {
        new Error("Delete Inventory Error");
    }
}

module.exports = {
    getInventoryById,
    getClassifications,
    getInventoryByClassificationId,
    getDetailsByInventoryId,
    addClassification,
    addInventory,
    editInventory,
    getInventoryByInvId,
    isClassificationValid,
    deleteInventory,
}