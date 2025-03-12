function addContent() {
    // Add a list of items to the content div
    let items = ["hewey", "dewey", "louie"];
    
    // Build the HTML string for a <ul> list
    let items_html = "<ul>";
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        items_html += "<li>" + item + "</li>";
    }
    items_html += "</ul>";
    
    // Find the content div and modify its HTML
    let contentDiv = document.getElementById("content");
    contentDiv.innerHTML = items_html;
}

function itemsList() {
    return document.getElementById("content").getElementsByTagName("ul")[0];
}

function addNewItem() {
    let newItem = document.getElementById("newItem").value;
    if (newItem) {
        let ul = itemsList();
        if (!ul) {
            ul = document.createElement("ul");
            document.getElementById("content").appendChild(ul);
        }
        let li = document.createElement("li");
        li.textContent = newItem;
        ul.appendChild(li);
        document.getElementById("newItem").value = ""; // Clear the input box
    }
}

function removeLastItem() {
    let ul = itemsList();
    if (ul && ul.lastElementChild) {
        ul.removeChild(ul.lastElementChild);
    }
}
