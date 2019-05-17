// genera un mese come item contenente day1 ... day31 (limitato fino a n)
function MonthConstructor(n, firstDay, name){ // f-check: PURO JS
	let i;
	this["monthLength"] = n;
	this["firstDay"] = firstDay; // 0-6
	this["name"] = name;
	for(i=1; i<=n; i++){
		this["day"+ i] = [
			i,						// 0: GG (da 1 a n)
			(firstDay - 1 + i)%7,	// 1: giorno settimana (da 0 a 6)
			null,					// 2: orario ingresso (MM)
			null,					// 3: orario uscita (MM)
			0,						// 4: flessibilita del giorno
			false, 					// 5: giorno problematico (prendere ferie ecc)
			false					// 6: vacanza o non lavorativo
		]; 
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
	
	switch(monthID + 1) {
		case 1:
			meseCorr["day1"][6] = true;
			meseCorr["day6"][6] = true;
			break;
		case 2:

			break;			
		case 3:

			break;		
		case 4:
			meseCorr["day25"][6] = true;
			break;		
		case 5:
			meseCorr["day1"][6] = true;
			break;		
		case 6:
			meseCorr["day2"][6] = true;
			break;		
		case 7:

			break;		
		case 8:
			meseCorr["day15"][6] = true;
			break;		
		case 9:

			break;		
		case 10:

			break;		
		case 11:
			meseCorr["day1"][6] = true;
			break;			
		case 12:
			meseCorr["day8"][6] = true;
			meseCorr["day25"][6] = true;
			meseCorr["day26"][6] = true;
			break;			
	}	
	
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
			cella.setAttribute("ondblclick", "resetDay('day" + j + "')");			
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
	
	activeCell = node(load(saveACell));
	
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
	
	canc(saveMonth);
	canc(saveACell);
	
	save(saveMonth, mese);
	save(saveACell, activeCell.id);
	
	
	return

}

function clickDay(cID){ // f-check: spurio
	if ( typeof(cID) == "undefined" ) {return}
	
	let newCell = node(cID);
	debug && console.log("newCell inizializzata: ", newCell);
	
	let oldCell = calendar.querySelector(".active");
	debug && console.log("oldCell esistente: ", oldCell);
	
	save(saveACell, newCell.id);
	
	if (oldCell == newCell) { return newCell}
	
	oldCell && 	oldCell.classList.remove("active");
				newCell.classList.add("active");
	
	debug && console.log("new: ", newCell);
	
	logFiller(cID);
	
	if (activeMonth[cID][indexHolid] == true) {
		hide("getIN");
		hide("getOUT");
	} else {	
		show("getIN");
		show("getOUT");		
	}
	
	return newCell
}

function logFiller(cID) {

	if ( typeof(cID) == "undefined" ) {return}
	
	let timeINaux  = activeMonth[cID][indexEnt];
	let timeOUTaux = activeMonth[cID][indexExt];
	let dayMarginaux  = activeMonth[cID][indexFlex];
	let dayMargin;
	
	let timeIN  = timeINaux  
		? pad(toHM(timeINaux).hh,  2, "0") + ":" + pad(toHM(timeINaux).mm,  2, "0")
		: "N / A";

	let timeOUT = timeOUTaux  
		? pad(toHM(timeOUTaux).hh, 2, "0") + ":" + pad(toHM(timeOUTaux).mm, 2, "0")
		: "N / A";
		
	if (timeINaux) {
		dayMargin = dayMarginaux > 0 
			? "+" + dayMarginaux
			:       dayMarginaux
	}
	
		
	node("logIN").textContent   = timeIN;
	node("logOUT").textContent  = timeOUT;
	node("dayFlex").textContent = dayMargin;
	
	node("logIN"  ).classList.remove("txtred", "txtblack");
	node("logOUT" ).classList.remove("txtred", "txtblack");
	node("dayFlex").classList.remove("txtred", "txtgreen", "txtblack");
	
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
	
	if (dayMarginaux > 0) { 
		node("dayFlex").classList.add("txtgreen"); 
	} else if (dayMarginaux < 0) {
		node("dayFlex").classList.add("txtred");
	} else {
		node("dayFlex").classList.add("txtblack");
	}
	
	return
}



function dayFlex(mese, cID) { // f-check: PURO JS
// calcola i vari margini giornalieri e aggiorna il totale mensile

	if ( typeof(cID) == "undefined" ) {return}
	
	let giorno = mese[cID];
	
	if (giorno[indexHolid] == true) {
		updateCell(mese, cID);
		return
	}
	
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

	if ( typeof(mese) == "undefined" ) {return}
	
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

	if ( typeof(mese) == "undefined" || typeof(cID) == "undefined" ) {return}

	let cella  = node(cID);
	let giorno = mese[cID];
	
	
	cella.classList.remove("debit", "even", "credit", "unfinished", "error", "holiday");

	
	debug && console.log("giorno indexHolid= ", giorno[indexHolid]);
	// se ferie o vacanza, oscura ed esci	
	if ( giorno[indexHolid] == true ) {
		cella.classList.add("holiday");
		hide("getIN");
		hide("getOUT");
		return 
	}
	
		show("getIN");
		show("getOUT");	
	// se il giorno non è sviluppato, esci (hai pulito prima)
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
	let full = !!( giorno[indexEnt] && giorno[indexExt] ); //true se il giorno è completo
	
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
	if ( typeof(activeCell) == "undefined" || activeCell == null) {return}	
	
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

function resetDay(cID, forced = false) {
	if ( typeof(cID) == "undefined" ) {return}
	
	if (
		activeMonth[cID][indexEnt] == null &&
		activeMonth[cID][indexExt] == null &&
		activeMonth[cID][4] == 0 &&
		activeMonth[cID][indexErr] == false &&
		activeMonth[cID][indexHolid] == false
	) {
		return
	}
	
	let userchoice = forced || confirm("Azzera i dati del giorno?");
	if (userchoice) 
	{ 
		activeMonth[cID][indexEnt] = null;
		activeMonth[cID][indexExt] = null;
		activeMonth[cID][4] = 0;
		activeMonth[cID][indexErr] = false;
		activeMonth[cID][indexHolid] = false;
	}
	
	
	updateCell(activeMonth, cID);
	logFiller(cID);
	refresh(activeMonth);
	
	return
}

function toggleHoliday(cID) {

	let userchoice;
	
	if (activeMonth[cID][indexHolid] == false) {
		if (
			activeMonth[cID][indexEnt] == null &&
			activeMonth[cID][indexExt] == null &&
			activeMonth[cID][4] == 0 &&
			activeMonth[cID][indexErr] == false 
		) {
			activeMonth[cID][indexHolid] = true;
			updateCell(activeMonth, cID);
			logFiller(cID);
			refresh(activeMonth);
			return
		} else {

			userchoice = confirm("Azzera i dati del giorno e impostare come festivo o assenza?");
		
			if (!userchoice) { 
				return 
			} else {		
				resetDay(cID, true);
				activeMonth[cID][indexHolid] = true;
				updateCell(activeMonth, cID);
				logFiller(cID);
				refresh(activeMonth);
				return
			}
		}		
	} else {
		activeMonth[cID][indexHolid] = false;
		updateCell(activeMonth, cID);
		logFiller(cID);
		refresh(activeMonth);
		return
	}
}

function resetMonth(mese) {
	if ( typeof(mese) == "undefined" ) {return}
	
	let userchoice = confirm("Azzera i dati del mese?");
	if (!userchoice) { return }
	
	let userconfirm = confirm("Sicuro? Operazione non annullabile");
	if (!userconfirm) { return }
	
	canc(saveMonth);
	activeMonth = null;
	activeCell  = null;
	
	clean(calendar);
	clean(node("logIN"));
	clean(node("logOUT"));
	clean(node("summary"));
	show("getIN");
	show("getOUT");
}
	


function init(force = false) {
	calendar = node("table");
	activeMonth = load(saveMonth) || generaMese(force);
	activeCell  = load(saveACell);
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
