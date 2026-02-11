"use strict"
// unit 5, select Inv item Activity
// Get a list of vehicles in inventory based on the classification_id
let classificationList = document.querySelector("#classificationList")
classificationList.addEventListener("change", function () {
    let classification_id = classificationList.value
    console.log(`classificationId is: ${classification_id}`)
    let classIdURL = "/inv/getInventory/" + classification_id
    fetch(classIdURL)
        .then(function (response) {
            if (response.ok) {
                return response.json()
            }
            throw Error("Network response was not ok")
        })
        .then(function (data) {
            console.log(data)
            buildInventoryList(data)
        })
        .catch(function (error) {
            console.log("JSON fetch error:", error.message)
            throw Error('fetch of JSON data failed.')

        })
})

// build inventory items into HTML table components and inject DOM
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay")
    //  set up the table labels
    let dataTable = "<thead>"
    // set up the table body 
    dataTable += "<tbody>"
    // Iterate over all vehicles in the array and put each in a row
    data.forEach(function (element) {
        console.log(element.inv_id + ", " + element.inv_model)
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`
    })
    dataTable += "</tbody>"
    // Display the contents in the Inventory Management view
    inventoryDisplay.innerHTML = dataTable
}