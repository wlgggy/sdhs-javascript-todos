function storageInit(storageKey, initValue) {
    let storage = JSON.parse(localStorage.getItem(storageKey)) ?? initValue;
    function setStorage() {
        localStorage.setItem(storageKey, JSON.stringify(storage));
    }
    return [storage, setStorage];
}

function createElement(element) {
    return document.createElement(element);
}
function find(query, parentElement) {
    return (parentElement ?? document).querySelector(query);
}
function findAll(query, parentElement) {
    return [...(parentElement ?? document).querySelectorAll(query)];
}
