localStorage.clear();

let url = new URL(window.location.href);
console.log(url);
let id = url.searchParams.get("id");

document.getElementById("orderId").innerHTML = `${id}`;