

function enterSite() {
    // document.addEventListener("keypress", function(e) {
    //     if(e.key === 'Enter') {
    //         let input = document.querySelector("nav input");
    //         input.click();
    //     }
    // })

    const navText = document.querySelector("nav p");
    navText.innerHTML = "Solicitando entrada ao servidor...";

    const username = document.querySelector("nav input").value;
    const newUser = {
        name: username
    };

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", newUser);
    promise.then(permittedEntry);
    promise.catch(deniedEntry);

    setInterval(() => checkIfUserOnline(newUser), 5000);
    setInterval(getMessages, 3000);
}

function permittedEntry(response) {   
    const nav = document.querySelector("nav");
    nav.classList.add("hidden");
}

function deniedEntry(error) {
    console.log(error);

    const navText = document.querySelector("nav p");
    navText.innerHTML = "No momento já existe um usuário online com o seu nome. Troque de nome ou espere!";
}

function checkIfUserOnline(User) {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", User);
    promise.then(isOnline);
    promise.catch(isOffline);
}

function isOnline(response) {
}

function isOffline(error) {
    alert("Usuário offline!");
    window.location.reload();
}

function getMessages() {
    const promiseMessage = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promiseMessage.then(getMessagesOK);
    promiseMessage.catch(didntGetMessages);
}

// PAREI AQUI, DESENVOLVER O RECEBIMENTO DAS MENSAGENS
function getMessagesOK(response) {
    console.log(response);
    // const name = response.data.from;
    // const time = 
}

function didntGetMessages(error) {
    console.log(error);
    alert("Deu xabu com as mensagens, tente reiniciar");
}

function checkAside() {
    const aside = document.querySelector("aside");

    aside.classList.remove("hidden");
}

function uncheckAside() {
    const aside = document.querySelector("aside");
    aside.classList.add("hidden");
}