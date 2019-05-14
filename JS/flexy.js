// genera un mese come item contenente day1 ... day31 (limitato fino a n)
function MonthConstructor(n, firstDay, name){ // f-check: PURO JS
	let i;
	this["monthLength"] = n;
	this["firstDay"] = firstDay; // 0-6
	this["name"] = name;
	for(i=1; i<=n; i++){
		this["day"+ i] = [i, (firstDay - 1 + i)%7, null, null, 0, false]; // GG (1-n), giornosett (0-6), MM-in, MM-out, flex, ferie/problemi orario?
	}
	this["monthFlexy"] = 0;
}


function generaMese(force = false){ // f-check: PURO JS
	
	let userchoice = true;
	if (!force) { userchoice = confirm("Genera un nuovo mese? I dati del mese attuale, se presente, saranno persi.");}
	if (!userchoice) { return }
	
	let d = new Date();
	let nDays;
	let name;
	let monthID  = d.getMonth();
	let yearID   = d.getFullYear();
	let leapYear = (yearID % 4 == 0) ? 1 : 0;
	let firstDay = new Date(yearID,monthID,1).getDay(); // 0-6 = Dom - Sab
	
	
	switch(monthID + 1) {
		case 1:
			nDays = 31;
			name = "Gen";
			break;
		case 2:
			nDays = 28 + leapYear;
			name = "Feb";
			break;			
		case 3:
			nDays = 31;
			name = "Mar";
			break;		
		case 4:
			nDays = 30;
			name = "Apr";
			break;		
		case 5:
			nDays = 31;
			name = "Mag";
			break;		
		case 6:
			nDays = 30;
			name = "Giu";
			break;		
		case 7:
			nDays = 31;
			name = "Lug";
			break;		
		case 8:
			nDays = 31;
			name = "Ago";
			break;		
		case 9:
			nDays = 30;
			name = "Set";
			break;		
		case 10:
			nDays = 31;
			name = "Ott";
			break;		
		case 11:
			nDays = 30;
			name = "Nov";
			break;			
		case 12:
			nDays = 31;
			name = "Dic";
			break;			
	}
	
	name = name + " " + yearID;
	let meseCorr = new MonthConstructor(nDays, firstDay, name);
	
	debug && console.log(meseCorr);
	return meseCorr;
	
}

function clean(tab) {
	while (tab.firstChild) {
		tab.removeChild(tab.firstChild);
	}
	tab.textContent = "";
	return
}

function refresh(mese) {	// f-check: spurio

	// primo giorno del mese. 0= Dom , 6= Sab
	// se non c'è nessun mese definito, ESCE
	
	if (typeof(mese) == "undefined" || isNaN(mese.firstDay) || mese.firstDay == null) {return}
	
	node("month").textContent = mese.name;
	let day;
	let placeholder;
	let cella;
	
	let i, j;
	
	// svuota la visualizzazione precedente (elimina, non nasconde)
	clean(calendar);
	
	// ripopola il calendario ...
	
	// ... con 0-4 segnaposti vuoti ...
	if (mese.firstDay != 0 && mese.firstDay != 6) {
		for (i = 1; i < mese.firstDay; i++) {
			placeholder = document.createElement("div");
			placeholder.setAttribute("class"  , "placeholder");
			calendar.appendChild(placeholder);
		}
	}
	
	// ... e coi giorni Lun-Ven
	for (j = 1; j <= mese.monthLength; j++) {
		
		// se non è domenica e non è sabato...
		if (mese["day"+j][1] != 0 && mese["day"+j][1] != 6) {   
			cella = document.createElement("div");
			cella.setAttribute("class"  , "cell date");
			cella.setAttribute("id"     , "day" + j);
			cella.setAttribute("onclick", "activeCell = clickDay('day" + j + "')");
			cella.setAttribute("oncontextmenu", "resetDay('day" + j + "'); return false");			
			cella.textContent = j;
			calendar.appendChild(cella);
		}
	}
	
	// per ogni cella
	let allDays = calendar.querySelectorAll(".cell");
	
	allDays.forEach(
		function(el){
			let dayID = el.getAttribute("id");
			dayFlex(mese, dayID);
		}
	)
	
	if (activeCell && activeCell.id) { 
		activeCell = clickDay(activeCell.id); 
	} else {
		activeCell = clickDay(calendar.querySelector(".date").id);
	}
	
	let margin = mese.monthFlexy;
	
	margin = (margin >0) ? "+" + margin : margin;
	
	node("summary").textContent = margin;
	
	node("summary").classList.remove("txtred", "txtgreen", "txtblack")
	
	if (mese.monthFlexy > 0 ) {
		node("summary").classList.add("txtgreen");
	} else if (mese.monthFlexy < 0 ) {
		node("summary").classList.add("txtred");
	} else {
		node("summary").classList.add("txtblack");
	}
	
	logFiller(activeCell.id);
	
	canc(savekey);
	save(savekey, mese);
	
	
	return

}

function clickDay(cID){ // f-check: spurio
	if ( typeof(cID) == "unefined" ) {return}
	
	let newCell = node(cID);
	debug && console.log("newCell inizializzata: ", newCell);
	
	let oldCell = calendar.querySelector(".active");
	debug && console.log("oldCell esistente: ", oldCell);
	
	if (oldCell == newCell) { return newCell}
	
	oldCell && 	oldCell.classList.remove("active");
				newCell.classList.add("active");
	
	debug && console.log("new: ", newCell);
	
	logFiller(cID);
	
	return newCell
}

function logFiller(cID) {

	if ( typeof(cID) == "unefined" ) {return}
	
	let timeINaux  = activeMonth[cID][indexEnt];
	let timeOUTaux = activeMonth[cID][indexExt];
	
	let timeIN  = timeINaux  
		? pad(toHM(timeINaux).hh,  2, "0") + ":" + pad(toHM(timeINaux).mm,  2, "0")
		: "N / A";

	let timeOUT = timeOUTaux  
		? pad(toHM(timeOUTaux).hh, 2, "0") + ":" + pad(toHM(timeOUTaux).mm, 2, "0")
		: "N / A";
		
	node("logIN").textContent  = timeIN;
	node("logOUT").textContent = timeOUT;
	
	node("logIN" ).classList.remove("txtred", "txtblack");
	node("logOUT").classList.remove("txtred", "txtblack");
	
	if (timeINaux && timeINaux > mmEn + flexy) {
		node("logIN" ).classList.add("txtred");
	} else {
		node("logIN" ).classList.add("txtblack");
	}
	
	if (timeOUTaux && timeOUTaux < mmEx) {
		node("logOUT").classList.add("txtred");
	} else {
		node("logOUT").classList.add("txtblack");
	}
	
	return
}



function dayFlex(mese, cID) { // f-check: PURO JS
// calcola i vari margini giornalieri e aggiorna il totale mensile

	if ( typeof(cID) == "unefined" ) {return}
	
	let giorno = mese[cID];
	
	// se non ho timbratura in ingresso non ho giornata, resetta ed esci
	if (giorno[indexEnt] == null) { 
		giorno[4] = 0;
		giorno[indexErr] = false;
		return
	}
	
	// ritardo in ingresso (non può essere negativo, se entri prima non conta)
	let rit = Math.max(giorno[indexEnt] - mmEn, 0); 
	
	// se sfori troppo prenderai ferie e conta come entrato giusto, ma attiva la flag errore
	if (rit > flexy) {
		rit = 0;
		giorno[indexErr] = true;
	}
	
	let rec; 
	// se non ho timbratura in uscita, la giornata va completata
	if 			(giorno[indexExt] == null) { 
		rec = 0;
	} else if 	(giorno[indexExt] < mmEx) {
		rec = 0;
		giorno[indexErr] = true;
	} else {
		rec = Math.max(giorno[indexExt] - mmEx, 0); // recupero in uscita
	}
	
	let day = rec - rit;
	giorno[4] = day;
	
	// aggiornamenti globali, vedere se tenere qui o chiamare in refresh
	mese.monthFlexy = monthTotal(mese);
	updateCell(mese, cID);
	
	
	return day
}

function monthTotal(mese) { // f-check: PURO JS

	if ( typeof(mese) == "unefined" ) {return}
	
	let monthMargin = 0;
	let dayMargin = 0;
	
	for (let i = 1; i <= mese.monthLength; i++) {
		dayMargin = mese["day"+i][4];
		
		if ( !isNaN( dayMargin ) ) {
			monthMargin = monthMargin + dayMargin;
		}
	}
	
	debug && console.log(monthMargin);
	
	return monthMargin
}




function updateCell(mese, cID) { // f-check: PURO CSS

	if ( typeof(mese) == "unefined" || typeof(cID) == "unefined" ) {return}

	let cella  = node(cID);
	let giorno = mese[cID];
	
	let full = !!( giorno[indexEnt] && giorno[indexExt] ); //true se il giorno è completo
	
	cella.classList.remove("debit", "even", "credit", "unfinished", "error");
	
	// se il giorno non è sviluppato, pulisci ed esci
	if ( giorno[indexEnt] == null ) {
		return 
	}

	
	// se sei entrato ma non uscito, devi completare il giorno
	if ( giorno[indexEnt] != null && giorno[indexExt] == null ) {
		cella.classList.add("unfinished");
	}
	
	// se c'è un errore, aggiungi classe errore
	giorno[indexErr] && cella.classList.add("error");
	
	// se le timbrature sono ok, colora la cella in base al margine di minuti
	if        ( full && giorno[4] >  0 ) {
		cella.classList.add("credit");
	} else if ( full && giorno[4] <  0 ) {
		cella.classList.add("debit");	
	} else if ( full && giorno[4] == 0 ){
		cella.classList.add("even");	
	}
}

// fillTime viene chiamata dai pulsanti di timbratura ingresso e uscita
function fillTime(inout){
	if ( typeof(activeCell) == "unefined" || activeCell == null) {return}	
	
	let index;
	if 			(inout == "in") { 
		index = indexEnt;  //indice array in
	} else if 	(inout == "out") {
		index = indexExt; //indice array out
	}

	let day = activeCell.id;
	let orario = {hh: 0, mm: 0};
	let d = new Date();
	
	if (activeMonth[day][index] != null) {              // se esiste già, usa quello
		orario = toHM(activeMonth[day][index]);
	} else {                                            // se invece non esiste...
		if (day == ( "day" + d.getDate() ) ) {          // ...ed è oggi
			orario = now();
		} else {                                        // se no usa i default
			if (inout == "in")  {orario = timeEn}
			if (inout == "out") {orario = timeEx}
		}
	}
	
	show("back"+inout);
	setValue("hh"+inout, pad(orario["hh"], 2, "0"));
	setValue("mm"+inout, pad(orario["mm"], 2, "0"));
}

// chiamata dai pulsanti di incremento/decremento ore e minuti
function plusminus(tgt, incr, mini, maxi, tgt2 = false, mini2 = -Infinity, maxi2 = +Infinity) {

	let cell  = node(tgt);
	let delta2 = 0; 
	
	let val = parseInt(cell.textContent) + incr;

	if (val < mini) { 
		val = maxi + (val - mini) +1;
		delta2 = -1;
	}
	if (val > maxi) { 
		val = mini + (val - maxi) -1;
		delta2 = +1;
	}

	cell.textContent = pad(val,  2, "0");
	
	let cell2;
	let val2; 
	
	if (tgt2) {
		cell2 = node(tgt2);
		val2  = parseInt(cell2.textContent) + delta2;
		val2  = Math.min(val2, maxi2);
		val2  = Math.max(val2, mini2);
		cell2.textContent = pad(val2, 2, "0");
		}

	return val
}

// bip è la timbratura da settare nel giorno
function bip(inout) {
	
	let minOnly = toMM( {hh: parseInt(node("hh"+inout).textContent), mm: parseInt(node("mm"+inout).textContent) } )

	let index;
	if 			(inout == "in") { 
		index = 2;  //indice array in
	} else if 	(inout == "out") {
		index = 3; //indice array out
	}
	
	activeMonth[activeCell.id][index] = minOnly;
	hide("back" + inout);
	
	refresh(activeMonth);
	
	return minOnly
}

function resetDay(cID) {
	if ( typeof(cID) == "unefined" ) {return}
	
	let userchoice = confirm("Azzera i dati del giorno?");
	if (!userchoice) { return }
	
	activeMonth[cID][indexEnt] = null;
	activeMonth[cID][indexExt] = null;
	activeMonth[cID][4] = 0;
	activeMonth[cID][indexErr] = false;
	
	updateCell(activeMonth, cID);
	logFiller(cID);
	refresh(activeMonth);
	
	return
}

function resetMonth(mese) {
	if ( typeof(mese) == "unefined" ) {return}
	
	let userchoice = confirm("Azzera i dati del mese?");
	if (!userchoice) { return }
	
	let userconfirm = confirm("Sicuro? Operazione non annullabile");
	if (!userconfirm) { return }
	
	canc(savekey);
	activeMonth = null;
	activeCell  = null;
	
	clean(calendar);
	clean(node("logIN"));
	clean(node("logOUT"));
	clean(node("summary"));
}
	


function init(force = false) {
	calendar = node("table");
	activeMonth = load(savekey) || generaMese(force);
	refresh(activeMonth);
}


window.onload = function(){
	init();

	debug && console.log("Calendario: ");
	debug && console.log(calendar);
	debug && console.log(activeMonth);
	
	if (debug) {	// valido per maggio!
		// giorno perfetto
		activeMonth["day6"][indexEnt]= 465 +0;
		activeMonth["day6"][indexExt]= 990 +0;
		// giorno pareggio
		activeMonth["day7"][indexEnt]= 465 +10;
		activeMonth["day7"][indexExt]= 990 +10;
		// giorno ritardo
		activeMonth["day1"][indexEnt]= 465 +40;
		activeMonth["day1"][indexExt]= 990 +20;
		// giorno recupero
		activeMonth["day2"][indexEnt]= 465 +20;
		activeMonth["day2"][indexExt]= 990 +50;
		// giorno feriein
		activeMonth["day29"][indexEnt]= 465 +120;
		activeMonth["day29"][indexExt]= 990 +0;
		// giorno ferieout
		activeMonth["day3"][indexEnt]= 465 +30;
		activeMonth["day3"][indexExt]= 990 -45;
	}
}
