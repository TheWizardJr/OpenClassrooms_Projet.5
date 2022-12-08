// On récupère l'id de la page en cours de lecture
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

//On récupère les données de l'API pour l'id en cours de lecture
fetch(`https://kanapi.gtnsimon.dev/api/products/${id}`)
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
  makeImage(imageUrl, altTxt);
  makeTitle(name);
  makePrice(price);
  makeDescription(description);
  makeColors(colors);
}