// funzioni di base
function node(id)          { return document.getElementById(id); }
function getValue(id)      { return node(id).textContent; }
function setValue(id, val) { return node(id).innerHTML = val; }	
function show(id)          {        node(id).classList.remove("hidden"); }
function hide(id)          {        node(id).classList.add("hidden"); }

function pad(n, width = 2, filler = 0) {
	if (filler.length == 0) { return "Error" }
	let num = n.toString();
	while (num.length < width) {
		num = "" + filler + num;
	}
	return num
}

// converte un item in formato {hh: mm: } in un valore numerico di minuti dopo la mezzanotte e viceversa
function toMM(a) { return (60 * a.hh) + a.mm }
function toHM(a) { return {hh: Math.floor(a/60), mm: a % 60} }


// restituisce il momento attuale { hh: , mm: }
function now() {
	let d   = new Date();
	return {hh: d.getHours(), mm: d.getMinutes()}
} 

// gestione localstorage
function save(key, item) {
	let temp = JSON.stringify(item);
	localStorage.setItem(key, temp);
}

function load(key) {
	let temp1 = localStorage.getItem(key);
	let temp2 = JSON.parse(temp1);
	return temp2
}

function canc(key) {
	localStorage.removeItem(key);
}
