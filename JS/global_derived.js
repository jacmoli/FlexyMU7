const mmEn    = toMM(timeEn);		// 465m   ingresso in soli minuti
const mmEx    = toMM(timeEx);		// 990m   uscita in soli minuti
const mmLB    = toMM(lunchB);		// 780m   inizio pausa in soli minuti
const mmLE    = toMM(lunchE);		// 825m   fine pausa in soli minuti
	
const giorno  = (mmEx - mmEn) - (mmLE - mmLB);  //480 minuti
