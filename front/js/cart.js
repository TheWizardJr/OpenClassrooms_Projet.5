const cart = [];

retrieveItemsFromLocalStorage();
cart.forEach((item) => displayItem(item));

function retrieveItemsFromLocalStorage() {
  const numberOfItems = localStorage.length;
  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i));
    const itemObject = JSON.parse(item);
    cart.push(itemObject);
  }
}

//______________________________________________________________________________//
//Création de la fonction pour trier le panier
function sortCart() {
  cart.sort(function (a, b) {
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });
}

//Création de la fonction pour afficher notre article sur la page
function displayItem(item) {
  const article = makeArticle(item);
  displayArticle(article);
  const divImg = makeImageDiv(item);
  article.appendChild(divImg);
  const cartItemContent = makeCartItemContent(item);
  article.appendChild(cartItemContent);
  displayTotalQuantity(item);
  displayTotalPrice(item);
  sortCart();
}

//Création de l'article
function makeArticle(item) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}

//Ajout de l'article à la section "cart__items"
function displayArticle(article) {
  document.getElementById("cart__items").appendChild(article);
}

//Création de la div contenant l'image
function makeImageDiv(item) {
  const divImg = document.createElement("div");
  divImg.classList.add("cart__item__img");
  const image = document.createElement("img");
  image.src = item.imageUrl;
  image.alt = item.altTxt;
  divImg.appendChild(image);
  return divImg;
}

//Création de la div contenant la div "description" et la div "settings"
function makeCartItemContent(item) {
  const divContent = document.createElement("div");
  divContent.classList.add("cart__item__content");
  const divDescription = makeDivDescription(item);
  const divSettings = makeDivSettings(item);
  divContent.appendChild(divDescription);
  divContent.appendChild(divSettings);
  return divContent;
}

//Création de la div "description"
function makeDivDescription(item) {
  const divDescription = document.createElement("div");
  divDescription.classList.add("cart__item__content__description");
  const h2 = document.createElement("h2");
  h2.textContent = item.name;
  const p = document.createElement("p");
  p.textContent = item.color;
  const p2 = document.createElement("p");
  p2.textContent = item.price + " €";
  divDescription.appendChild(h2);
  divDescription.appendChild(p);
  divDescription.appendChild(p2);
  return divDescription;
}

//Création de la div settings contenant la div "settings quantity" et la div "settings delete"
function makeDivSettings(item) {
  const divSettings = document.createElement("div");
  divSettings.classList.add("cart__item__content__settings");
  makeDivSettingsQuantity(divSettings, item);
  makeDivSettingsDelete(divSettings, item);
  return divSettings;
}

//Création de la div "settings quantity"
function makeDivSettingsQuantity(divSettings, item) {
  const divSettingsQuantity = document.createElement("div");
  divSettingsQuantity.classList.add("cart__item__content__settings__quantity");
  const p = document.createElement("p");
  p.textContent = "Qté :";
  divSettingsQuantity.appendChild(p);
  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("itemQuantity");
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = item.quantity;
  input.addEventListener("input", () =>
    updatePriceAndQuantity(input.value, item)
  );
  divSettingsQuantity.appendChild(input);
  divSettings.appendChild(divSettingsQuantity);
}

// Création de la div "settings delete"
function makeDivSettingsDelete(divSettings, item) {
  const divSettingsDelete = document.createElement("div");
  divSettingsDelete.classList.add("cart__item__content__settings__delete");
  divSettingsDelete.addEventListener("click", () => deleteItem(item));
  const p = document.createElement("p");
  p.classList.add("deleteItem");
  p.textContent = "Supprimer";
  divSettingsDelete.appendChild(p);
  divSettings.appendChild(divSettingsDelete);
}

//Création de la fonction pour la quantité totale du panier
function displayTotalQuantity(item) {
  const totalQuantity = document.getElementById("totalQuantity");
  let total = 0;
  cart.forEach((item) => {
    total += item.quantity;
  });
  totalQuantity.textContent = total;
}

//Création de la fonction pour le total du prix du panier
function displayTotalPrice() {
  const totalPrice = document.getElementById("totalPrice");
  let total = 0;
  cart.forEach((item) => {
    const totalUnitPrice = item.price * item.quantity;
    total += totalUnitPrice;
  });
  totalPrice.textContent = total;
}

//Création de la fonction pour mettre à jour le prix et la quantité du panier au clic sur l'input
function updatePriceAndQuantity(newValue, item) {
  const itemToUpdate = cart.find(
    (product) => product.id === item.id && product.color === item.color
  );
  itemToUpdate.quantity = Number(newValue);
  item.quantity = itemToUpdate.quantity;
  displayTotalQuantity();
  displayTotalPrice();
  saveNewDataToLocalStorage(item);
}

//Création de la fonction pour sauvegarder le nouveau panier dans le local storage
function saveNewDataToLocalStorage(item) {
  const dataToSave = JSON.stringify(item);
  const key = `${item.id}-${item.color}`;
  localStorage.setItem(key, dataToSave);
}

//Création de la fonction pour supprimer du panier
function deleteItem(item) {
  const itemToDelete = cart.findIndex(
    (product) => product.id === item.id && product.color === item.color
  );
  cart.splice(itemToDelete, 1);
  displayTotalPrice();
  displayTotalQuantity();
  deleteDataToLocalStorage(item);
  deleteArticleFromPage(item);
}

//Fonction qui supprime l'item du local storage
function deleteDataToLocalStorage(item) {
  const key = `${item.id}-${item.color}`;
  localStorage.removeItem(key);
}

//Fonction qui supprime l'item de la page panier
function deleteArticleFromPage(item) {
  const articleToDelete = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  );
  articleToDelete.remove();
}

//___________________________________________________________________________________________________

const orderButton = document.querySelector("#order");
let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let address = document.querySelector("#address");
let city = document.querySelector("#city");
let email = document.querySelector("#email");

orderButton.addEventListener("click", regCheck);

// Verification RegEx
function regCheck(click) {
  if (
    /^(?=.{2,20}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/.test(firstName.value) ===
    false
  ) {
    click.preventDefault();
    msgError("firstNameErrorMsg");
    return;
  } else msgOk("firstNameErrorMsg");
  if (
    /^(?=.{2,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/g.test(lastName.value) ===
    false
  ) {
    click.preventDefault();
    msgError("lastNameErrorMsg");
    return;
  } else msgOk("lastNameErrorMsg");
  if (
    /^(?=.{2,40}$)(?:\w+[_+-.,!@#$%^&*();/|<>"]\w+)*$/.test(address.value) ===
      true ||
    address.value === ""
  ) {
    click.preventDefault();
    msgError("addressErrorMsg");
    return;
  } else msgOk("addressErrorMsg");
  if (
    /^(?=.{2,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/.test(city.value) === false
  ) {
    click.preventDefault();
    msgError("cityErrorMsg");
    return;
  } else msgOk("cityErrorMsg");
  if (
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?=.{2,6}$)(?:\w+[.][a-zA-Z]+)*$/.test(
      email.value
    ) === false ||
    email.value === ""
  ) {
    click.preventDefault();
    msgError("emailErrorMsg");
    return;
  } else {
    click.preventDefault();
    msgOk("emailErrorMsg");
  }
  if (cart.length === 0) {
    alert("Veuillez selectionner un article à acheter");
  } else {
    let isComplete = confirm("Voulez vous valider votre panier ?");
    if (isComplete === true) {
      click.preventDefault();
      submitForm();
    } else click.preventDefault();
  }
}

// Message d'erreur si le champ est incorrect
function msgError(location) {
  document.getElementById(location).innerText = "Verifier votre saisie";
}

// Message vide si le champ est correct
function msgOk(location) {
  document.getElementById(location).innerText = "";
}

// Requete fetch pour envoyer le formulaire
function submitForm() {
  const body = makeRequestBody();
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      location.href = `confirmation.html?id=${data.orderId}`;
    })
    .catch((err) => console.log(err));
}

// Le corps de la demande
function makeRequestBody() {
  const form = document.querySelector(".cart__order__form");
  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;
  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdsFromCache(),
  };
  return body;
}

// Récupération des id des articles via le local storage
function getIdsFromCache() {
  const numberOfProducts = localStorage.length;
  const ids = [];
  for (let i = 0; i < numberOfProducts; i++) {
    const key = localStorage.key(i);
    const id = key.split("-")[0];
    ids.push(id);
  }
  return ids;
}
