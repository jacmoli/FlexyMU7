// DEBUG FLAG
const debug = false;


// parametri iniziali
const timeEn  = {hh:  7, mm: 45};	//        ora ingresso
const timeEx  = {hh: 16, mm: 30};	//        ora uscita
const flexy   = 75;					//        elasticità (1h15m)
const lunchB  = {hh: 13, mm: 00};	//        inizio pausa
const lunchE  = {hh: 13, mm: 45};	//        fine pausa

const indexEnt = 2;
const indexExt = 3;
const indexErr = 5;
const indexHolid = 6;

const savekey = "C81_flexy7MU";


// Var globali
let calendar;
let activeMonth;
let activeCell;