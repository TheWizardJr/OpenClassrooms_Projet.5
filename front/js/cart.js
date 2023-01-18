const cart = []

retrieveItemsFromLocalStorage()
cart.forEach((item) => displayItem(item))

function retrieveItemsFromLocalStorage() {
    const numberOfItems = localStorage.length
    for (let i = 0; i < numberOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i))
        const itemObject = JSON.parse(item)
        cart.push(itemObject)
    }
}

//______________________________________________________________________________//
//Création de la fonction pour trier le panier
function sortCart() {
    cart.sort(function(a,b) {
        return a.id.localeCompare(b.id, undefined, {numeric: true})
    })
}

//Création de la fonction pour afficher notre article sur la page
function displayItem(item) {
    const article = makeArticle(item)
    displayArticle(article)
    const divImg = makeImageDiv(item)
    article.appendChild(divImg)
    const cartItemContent = makeCartItemContent(item)
    article.appendChild(cartItemContent)
    displayTotalQuantity(item)
    displayTotalPrice(item)
    sortCart()
}

//Création de l'article
function makeArticle(item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}

//Ajout de l'article à la section "cart__items"
function displayArticle(article) {
    document.getElementById("cart__items").appendChild(article)
}

//Création de la div contenant l'image
function makeImageDiv(item) {
    const divImg = document.createElement("div")
    divImg.classList.add("cart__item__img")
    const image = document.createElement("img")
    image.src = item.imageUrl
    image.alt = item.altTxt
    divImg.appendChild(image)
    return divImg
}

//Création de la div contenant la div "description" et la div "settings"
function makeCartItemContent(item) {
    const divContent = document.createElement("div")
    divContent.classList.add("cart__item__content")
    const divDescription = makeDivDescription(item)
    const divSettings = makeDivSettings(item)
    divContent.appendChild(divDescription)
    divContent.appendChild(divSettings)
    return divContent
}

//Création de la div "description"
function makeDivDescription(item) {
    const divDescription = document.createElement("div")
    divDescription.classList.add("cart__item__content__description")
    const h2 = document.createElement("h2")
    h2.textContent = item.name
    const p = document.createElement("p")
    p.textContent = item.color
    const p2 = document.createElement("p")
    p2.textContent = item.price + " €"
    divDescription.appendChild(h2)
    divDescription.appendChild(p)
    divDescription.appendChild(p2)
    return divDescription
}

//Création de la div settings contenant la div "settings quantity" et la div "settings delete"
function makeDivSettings (item) {
    const divSettings = document.createElement("div")
    divSettings.classList.add("cart__item__content__settings")
    makeDivSettingsQuantity(divSettings, item)
    makeDivSettingsDelete(divSettings, item)
    return divSettings
}

//Création de la div "settings quantity"
function makeDivSettingsQuantity(divSettings, item) {
    const divSettingsQuantity = document.createElement("div")
    divSettingsQuantity.classList.add("cart__item__content__settings__quantity")
    const p = document.createElement("p")
    p.textContent = "Qté :"
    divSettingsQuantity.appendChild(p)
    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = item.quantity
    input.addEventListener("input", () => updatePriceAndQuantity(input.value, item))
    divSettingsQuantity.appendChild(input)
    divSettings.appendChild(divSettingsQuantity)
}

// Création de la div "settings delete"
function makeDivSettingsDelete(divSettings, item) {
    const divSettingsDelete = document.createElement("div")
    divSettingsDelete.classList.add("cart__item__content__settings__delete")
    divSettingsDelete.addEventListener("click", () => deleteItem(item))
    const p = document.createElement ("p")
    p.classList.add("deleteItem")
    p.textContent = "Supprimer"
    divSettingsDelete.appendChild(p)
    divSettings.appendChild(divSettingsDelete)
}

//Création de la fonction pour la quantité totale du panier
function displayTotalQuantity(item) {
    const totalQuantity = document.getElementById("totalQuantity")
    let total = 0
    cart.forEach(item => {
        total += item.quantity
    })
    totalQuantity.textContent = total
}

//Création de la fonction pour le total du prix du panier
function displayTotalPrice() {
    const totalPrice = document.getElementById("totalPrice")
    let total = 0
    cart.forEach(item => {
        const totalUnitPrice = item.price * item.quantity
        total += totalUnitPrice
    })
    totalPrice.textContent = total
}

//Création de la fonction pour mettre à jour le prix et la quantité du panier au clic sur l'input
function updatePriceAndQuantity(newValue, item) {
    const itemToUpdate = cart.find(product => product.id === item.id && product.color === item.color)
    itemToUpdate.quantity = Number(newValue)
    item.quantity = itemToUpdate.quantity
    displayTotalQuantity()
    displayTotalPrice()
    saveNewDataToLocalStorage(item)
}

//Création de la fonction pour sauvegarder le nouveau panier dans le local storage
function saveNewDataToLocalStorage(item) {
     const dataToSave = JSON.stringify(item)
     const key = `${item.id}-${item.color}`
     localStorage.setItem(key, dataToSave)
}

//Création de la fonction pour supprimer du panier
function deleteItem(item) {
    const itemToDelete = cart.findIndex(product => product.id === item.id && product.color === item.color)
    cart.splice(itemToDelete, 1)
    displayTotalPrice()
    displayTotalQuantity()
    deleteDataToLocalStorage(item)
    deleteArticleFromPage(item)
}

//Fonction qui supprime l'item du local storage
function deleteDataToLocalStorage(item) {
    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)
}

//Fonction qui supprime l'item de la page panier
function deleteArticleFromPage(item) {
    const articleToDelete = document.querySelector(`article[data-id="${item.id}"][data-color="${item.color}"]`)
    articleToDelete.remove()
}