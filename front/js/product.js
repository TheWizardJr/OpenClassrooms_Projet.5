// On récupère l'id de la page en cours de lecture
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");
let itemPrice = 0
let imgUrl, altText, articleName, articleDescription

//On récupère les données de l'API pour l'id en cours de lecture
fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => res.json())
  .then((data) => kanapData(data));

//Création de l'élément "image"
function makeImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector(".item__img");
  parent.appendChild(image);
}

//Création du titre du produit
function makeTitle(name) {
  document.querySelector("#title").textContent = name;
}

//Création du prix du produit
function makePrice(price) {
  document.querySelector("#price").textContent = price;
}

//Création de la description du produit
function makeDescription(description) {
  document.querySelector("#description").textContent = description;
}

// Création de la selection de couleur
function makeColors(colors) {
  const select = document.querySelector("#colors");
  colors.forEach((color) => {
    //Pour chaque "couleur" récupéré de "couleurs"
    const option = document.createElement("option"); //On créé une option
    option.value = color; //On lui donne la valeur
    option.textContent = color; //Et le texte
    select.appendChild(option); // On rajoute "option" à notre "select"
  });
}

//Pour chaque canapé récupéré de notre API
function kanapData(sofa) {
  const { imageUrl, altTxt, name, description, price, colors } = sofa; //Un sofa contient : une imageUrl, un altTxt, un name, une description, un price et une colors
  //On créé les éléments suivants
  itemPrice = price;
  imgUrl = imageUrl
  altText = altTxt
  articleName = name
  articleDescription = description
  makeImage(imageUrl, altTxt);
  makeTitle(name);
  makePrice(price);
  makeDescription(description);
  makeColors(colors);
}

//Création de l'ajout des articles au panier au clic sur le button
const button = document.getElementById("addToCart")
button.addEventListener("click", handleClick)

//Au clic sur le bouton
function handleClick() {
  const color = document.getElementById("colors").value
  const quantity = document.getElementById("quantity").value
  //On vérifie si la commande est valide
  if (isOrderInvalid(color, quantity)) return //Si elle ne l'est pas, on recommence
  //On vérifie si la commande est valide
  if (isOrderValid(color,quantity))
  // Si elle l'est, on sauvegarder la commande 
  saveOrder(color, quantity)
  // redirectToCart()
}

//Création de la fonction pour savoir si la commande est invalide
function isOrderInvalid(color, quantity) {
  if (color == "" && quantity == "0") {
    alert("Veuillez selectionner une couleur et une quantité s'il vous plait.")
    return true
  } else if (color == "" && quantity > 0) {
    alert("Veuillez selectionner une couleur s'il vous plait.")
    return true
  } else if (quantity == "0" && color != "") {
    alert("Veuillez selectionner une quantité s'il vous plait.")
    return true
  }
}

//Création de la fonction pour savoir si la commande est valide
function isOrderValid(color, quantity) {
    if (color != "" && quantity > 0 && quantity <= 1) {
    alert("Votre article a bien été ajouté au panier.")
    return true
  } else if (color != "" && quantity >= 2) {
    alert("Vos articles ont bien été ajoutés au panier.")
    return true
  }
}

//On sauvegarde la commande si elle est valide avec les "datas"
function saveOrder(color, quantity) {
  const key = `${id}-${color}`
  const data = {
    id: id,
    color: color,
    quantity: Number(quantity),
    price: itemPrice,
    imageUrl: imgUrl,
    altTxt: altText,
    name: articleName,
    description: articleDescription
  }
  //On ajoute les "datas" dans le Local Storage
  localStorage.setItem(key, JSON.stringify(data))
}