/* LOAD PARTICLE JS */
particlesJS.load("particles-js", "js/particles.json", function() {
  console.log("callback - particles.js config loaded");
});

/*
	LANGUAGE HANDLING AND DETECTION
*/

const availableLocales = ['en', 'it'];
const defaultLanguage = 'en';

// Function to get user's preferred language
function getPreferredLanguage() {
    const languages = navigator.languages || [navigator.language || navigator.userLanguage];
    for (let lang of languages) {
        lang = lang.substring(0, 2); // Get the two-letter language code
        if (translations.hasOwnProperty(lang)) {
            return lang;
        }
    }
    return 'en'; // Default to English if no match found
}

// Define the translations
const translations = {
	en: {
		language: {
            current: "English",
            english: "English",
            italian: "Italian"
        },
		buttons: {
			source: "Source"
		},
		overlay: {
			about: 'About &nbsp;<i class="fas fa-info-circle"></i>',
			experience: 'Experience &nbsp;<i class="fas fa-briefcase"></i>',
			education: 'Education &nbsp;<i class="fas fa-graduation-cap"></i>',
			projects: 'Projects &nbsp;<i class="far fa-clipboard"></i>',
			contact: 'Contact &nbsp;<i class="fas fa-user"></i>'
		},
		nav: {
			contact: 'Contact',
			projects: 'Projects',
			education: 'Education',
			about: 'About me',
			home: 'Home'
		},
		home: {
			title: "Graduate with a master's degree in AI",
			resume: "Download my resume"
		},
		about: {
			title: 'About Me <i class="fas fa-info-circle"></i>',
			description: "Hey there, I'm Daniele! I'm currently diving deep into the world of Artificial Intelligence as a Master's degree student. I love learning about new software technologies and apply them to solve problems and create new projects. I'm currently interested in NLP, Deep Learning and anything related to AI. In my free time, I like to engage in sports 🏃, read books 📖 and play the guitar 🎸."
		},
		experience: {
			title: 'Professional experience <i class="fas fa-briefcase"></i>',
			dienneaCompany: 'Diennea - Faenza',
			dienneaPeriod: 'Dec 2023 - Present',
			dienneaRole: 'AI Engineer',
			dienneaDescription: '- Design, implementation, and maintenance of Artificial Intelligence applications for internal and external clients. Integration of AI functionalities into existing software by collaborating with the respective corporate development teams.<br>- Preparation, management, and manipulation of data necessary for training and running AI systems in collaboration with the areas/clients that produce them.',
			datareplyCompany: 'Data Reply - Bologna',
			datareplyPeriod: 'Apr 2023 - Aug 2023',
			datareplyPosition: 'Data Scientist Intern',
			datareplyDescription: '- Development of my thesis project, which aimed to process custom data of various types (textual and tabular data) to make them usable by LLMs.<br>- Throughout this period, I used the OpenAI API and extensively tested numerous open-source language models.<br>- Conducted fine-tuning experiments and compared their effectiveness with a retrieval augmented generation approach.'
		},
		education: {
			title: 'Education <i class="fas fa-graduation-cap"></i>',
			mastersDegree: "Master's Degree in Artificial Intelligence",
			mastersPeriod: 'Sept 2021 - Oct 2023',
			mastersSchool: 'Alma Mater Studiorum - University of Bologna',
			mastersDescription: "It's a two-year Master in Artificial Intelligence which provides solid competence and expertise in the founding areas and innovative applications of Artificial Intelligence. Graduated with a final score of <b>110/110 with honors</b>.",
			bachelorDegree: "BSc in Computer Science",
			bachelorPeriod: 'Oct 2018 - Jul 2021',
			bachelorSchool: 'Alma Mater Studiorum - University of Bologna',
			bachelorDescription: "I made a lot of projects during the degree course and I learnt to work in a team to achieve a common goal and by comparing my ideas with others. Graduated with a final score of <b>108/110</b>.",
			highschoolDegree: 'High School Diploma',
			highschoolPeriod: 'Sept 2013 - Jul 2018',
			highschoolSchool: 'Liceo Scientifico F. Alberghetti',
			highschoolDescription: 'In the last 2 years of High School I became passionate about Computer Science and I decide to go on studying this topic.'
		},
		projects: {
			title: 'Projects <i class="far fa-clipboard"></i>',
			university: 'University projects',
			aiii: {
				title: 'Counterfactual explanations',
				description: 'The work concerns the development of a model combining Machine Learning and Optimization for Counterfactual Explanations using OMLT and DiCE Python packages. We generated counterfactuals considering the GSM Arena dataset.'
			},
			songsRec: {
				title: 'Songs recommendation based on lyrics',
				description: 'I first performed an analysis of the lyrics using LSA and other techniques in R. Then I implemented different GNNs, on a narrow subset of songs, that are able to recommend the most similar songs to a given one.'
			},
			argRetrieval: {
				title: 'Argument retrieval for comparative questions',
				description: 'We implemented different pipelines in order to retrieve the most relevant documents, from a subset of ClueWeb12, given some comparative questions. In another task we performed stance classification on these documents.'
			},
			posQA: {
				title: 'POS tagging &amp; QA',
				description: 'In one assignment we implemented different models for POS tagging, in the other one some models for abstractive QA on CoQA.'
			},
			vlsi: {
				title: 'VLSI Design',
				description: "We implemented 3 different models for the 'Combinatorial and Decision Making Optimization' exam using CP, SMT and MIP techniques to solve the VLSI design problem."
			},
			bis: {
				title: 'Blind Image Separation',
				description: "I implemented a deep learning model, for the 'Deep Learning' exam, that allows to separate 2 mixed images taken from MNIST and FASHION MNIST datasets."
			},
			bachelorDissert: {
				title: 'Blockchain-based anti-counterfeiting system',
				description: "The system has been developed as my graduation project. The aim of the project is to fight and avoid clothing's counterfeit thanks to the use of blockchain technology.",
				src: 'Dissertation'
			},
			mm: {
				title: 'M&amp;M - Mistery at the museum',
				description: 'The aim of the project was to <a href="https://en.wikipedia.org/wiki/Gamification" target="_blank"><u>gamify</u></a> the visit to a museum to entertain children. The project is composed by 3 web applications: Player, Editor and Evaluator.'
			},
			twitterTracker: {
				title: 'Twitter-Tracker',
				description: 'Twitter-tracker is a web app created for collecting published tweets from around the world and viewing them in various representations. The application was developed using <a href="https://en.wikipedia.org/wiki/Agile_software_development" target="_blank"><u>Agile</u></a> methodologies.'
			},
			bikaya: {
				title: 'BiKaya OS',
				description: 'BiKaya is an educational-purpose, cross-architecture operating system compatible with <a href="https://github.com/acsor/BiKaya/blob/master/contrib/uARM-Informal-Specifications.pdf" target="_blank"><u>uARM</u></a> and <a href="https://github.com/acsor/BiKaya/blob/master/contrib/uMPS2-Principles-of-Operation.pdf" target="_blank"><u>uMPS2</u></a>, two micro ISAs derived from ARM and MIPS, respectively.'
			},
			personal: 'Personal projects',
			scoreboard: {
				title: 'Generic scoreboard',
				description: 'This is a generic scoreboard that you can use for any game you are playing with your friends. You can choose how many points to reach and whether who has more or who has less wins',
				analysis: "Game analysis"
			},
			telegram: {
				title: 'Telegram messages checker',
				description: "A simple script to check if messages containing certain words arrive on your telegram account. A song is played to alert you or to wake you up in case you are waiting for an important message during the night."
			}
		},
		contact: {
			title: 'Contact me'
		}
	},
	it: {
		language: {
            current: "Italiano",
            english: "Inglese",
            italian: "Italiano"
        },
		buttons: {
			source: "Codice"
		},
		overlay: {
			about: 'Chi sono &nbsp;<i class="fas fa-info-circle"></i>',
			experience: 'Esperienze &nbsp;<i class="fas fa-briefcase"></i>',
			education: 'Formazione &nbsp;<i class="fas fa-graduation-cap"></i>',
			projects: 'Progetti &nbsp;<i class="far fa-clipboard"></i>',
			contact: 'Contatti &nbsp;<i class="fas fa-user"></i>'
		},
		nav: {
			contact: 'Contatti',
			projects: 'Progetti',
			education: 'Formazione',
			about: 'Chi sono',
			home: 'Home'
		},
		home: {
			title: "Laureato in Artificial Intelligence",
			resume: "Download del mio CV"
		},
		about: {
			title: 'Chi sono <i class="fas fa-info-circle"></i>',
			description: "Ciao, sono Daniele! Mi sono laureato nel corso di Laurea Magistrale in Artificial Intelligence. Mi piace imparare nuove tecnologie e applicarle per risolvere dei problemi e creare nuovi progetti.<br>Attualmente sono interessato a NLP, Deep Learning e tutto ciò che riguarda l'Intelligenza Artificiale. Nel tempo libero mi piace fare sport 🏃‍♂️, leggere libri 📖 e suonare la chitarra 🎸."
		},
		experience: {
			title: 'Esperienze lavorative <i class="fas fa-briefcase"></i>',
			dienneaCompany: 'Diennea - Faenza',
			dienneaPeriod: 'Dic 2023 - Presente',
			dienneaRole: 'AI Engineer',
			dienneaDescription: "- Progettazione, implementazione e mantenimento di applicazioni di Intelligenza Artificiale per clienti interni ed esterni. Integrazione di funzionalità AI nel software esistente, collaborando con i relativi team di sviluppo aziendale.<br>- Preparazione, gestione e manipolazione dei dati necessari all'addestramento e all'esecuzione dei sistemi AI in collaborazione con le aree/clienti che li producono.",
			datareplyCompany: 'Data Reply - Bologna',
			datareplyPeriod: 'Apr 2023 - Ago 2023',
			datareplyPosition: 'Data Scientist Intern',
			datareplyDescription: '- Sviluppo del mio progetto di tesi, il cui scopo era quello di processare dati personalizzati di diversi tipi (dati testuali e tabulari), per renderli utilizzabili da Large Language Models.<br>- Durante questo periodo, ho utilizzato le API di OpenAI e testato ampiamente numerosi modelli di linguaggio open-source.<br>- Condotti esperimenti di fine-tuning e confrontata la loro efficacia con un approccio RAG.'
		},
		education: {
			title: 'Istruzione e formazione <i class="fas fa-graduation-cap"></i>',
			mastersDegree: "Laurea magistrale in Artificial Intelligence",
			mastersPeriod: 'Sett 2021 - Ott 2023',
			mastersSchool: 'Alma Mater Studiorum - Università di Bologna',
			mastersDescription: "È una laurea magistrale in lingua inglese che ha come tema di studio l'intelligenza artificiale. Fornisce solide competenze e abilità nelle aree fondanti e nelle applicazioni innovative dell'intelligenza artificiale. Laureato con voto <b>110/110 e lode</b>.",
			bachelorDegree: "Laurea triennale in Informatica",
			bachelorPeriod: 'Ott 2018 - Lug 2021',
			bachelorSchool: 'Alma Mater Studiorum - Università di Bologna',
			bachelorDescription: "Ho creato molti progetti durante il corso di laurea ed ho imparato a lavorare in un team per raggiungere un obiettivo comune confrontando le mie idee con quelle degli altri. Laureato con voto <b>108/110</b>.",
			highschoolDegree: 'Diploma di maturità',
			highschoolPeriod: 'Set 2013 - Lug 2018',
			highschoolSchool: 'Liceo Scientifico F. Alberghetti',
			highschoolDescription: "Negli ultimi anni delle scuole superiori mi sono appassionato all'informatica e per questo ho deciso di continuare gli studi proprio in questo campo."
		},
		projects: {
			title: 'Progetti <i class="far fa-clipboard"></i>',
			university: 'Progetti universitari',
			aiii: {
				title: 'Counterfactual explanations',
				description: 'Il lavoro riguarda lo sviluppo di un modello che combina ML e ottimizzazione per spiegazioni controfattuali utilizzando le librerie Python OMLT e DiCE. Abbiamo generato spiegazioni considerando il dataset GSM Arena.'
			},
			songsRec: {
				title: 'Songs recommendation based on lyrics',
				description: "Ho prima eseguito un'analisi dei testi delle canzoni utilizzando LSA e altre tecniche in R. In seguito ho implementato diverse GNN, utilizzando un insieme ristretto di canzoni, che raccomandano le canzoni più simili ad una data in input."
			},
			argRetrieval: {
				title: 'Argument retrieval for comparative questions',
				description: "Abbiamo implementato vari sistemi per ottenere i documenti più rilevanti, presi da un sottoinsieme di ClueWeb12, date delle domande comparative. In un'altra task abbiamo eseguito stance detection sui documenti."
			},
			posQA: {
				title: 'POS tagging &amp; QA',
				description: "In un assignment abbiamo implementato diversi modelli per eseguire POS tagging, nell'altro invece abbiamo usato dei modelli per rispondere alle domande del dataset CoQA."
			},
			vlsi: {
				title: 'VLSI Design',
				description: "Abbiamo implementato 3 diversi modelli per l'esame di 'Combinatorial and Decision Making Optimization' utilizzando CP, SMT e MIP per risolvere il problema di VLSI design."
			},
			bis: {
				title: 'Blind Image Separation',
				description: "Ho implementato una rete convoluzionale, per l'esame di 'Deep Learning', che permette di separare 2 immagini sovrapposte prese dai dataset MNIST e FASHION MNIST."
			},
			bachelorDissert: {
				title: 'Sistema anticontraffazione basato su blockchain',
				description: "Il sistema è stato sviluppato come mio progetto di laurea. L'obiettivo del progetto è di combattere ed evitare la contraffazione nel mondo della moda utilizzando la tecnologia blockchain.",
				src: "Tesi"
			},
			mm: {
				title: 'M&amp;M - Mistero al museo',
				description: 'Lo scopo del progetto era quello di <a href="https://it.wikipedia.org/wiki/Gamification" target="_blank"><u>gamificare</u></a> le visite al museo per intrattenere i ragazzi. Il progetto è composto da 3 applicazioni web: Player, Editor e Valutatore.'
			},
			twitterTracker: {
				title: 'Twitter-Tracker',
				description: `Twitter-tracker è un'applicazione web creata per collezionare i tweet pubblicati in tutto il mondo e mostrarli in diverse modalità. L'applicazione è stata sviluppata utilizzando metodologie <a href="https://en.wikipedia.org/wiki/Agile_software_development" target="_blank"><u>agili</u></a>.`
			},
			bikaya: {
				title: 'Sistema operativo Bikaya',
				description: 'BiKaya è un sistema operativo progettato a scopo educativo e compatibile con 2 architetture, <a href="https://github.com/acsor/BiKaya/blob/master/contrib/uARM-Informal-Specifications.pdf" target="_blank"><u>uARM</u></a> e <a href="https://github.com/acsor/BiKaya/blob/master/contrib/uMPS2-Principles-of-Operation.pdf" target="_blank"><u>uMPS2</u></a>, due micro ISA derivate rispettivamente da ARM e MIPS.'
			},
			personal: 'Progetti personali',
			scoreboard: {
				title: 'Segnapunti generico',
				description: 'Ho creato un segnapunti generico utilizzabile per ogni gioco. Si può inserire il titolo del gioco, il numero di giocatori, il punteggio massimo e se vince chi ha più punti oppure chi ne ha meno.',
				analysis: "Analisi partita"
			},
			telegram: {
				title: 'Sveglia per messaggi Telegram',
				description: "Composto da alcuni semplici script che controllano se i messaggi ricevuti su Telegram contengono le parole scelte dall'utente. Nel caso in cui siano presenti, verrà riprodotta una canzone per avvisare o svegliare l'utente."
			}
		},
		contact: {
			title: 'Contattami'
		}
	}
};

// Function to change the language
function changeLanguage(lang) {
	// Set document language
    document.documentElement.lang = lang;
	// Iterate over all elements that need translation
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getNestedTranslation(translations[lang], key);
        if (translation) {
            element.innerHTML = translation;
        }else {
            console.warn(`No translation found for key: ${key} in language: ${lang}`);
        }
    });

    // Update language switcher UI
    const currentFlag = document.getElementById('current-flag');
    const currentLanguage = document.getElementById('current-language');
    currentFlag.src = `ref/images/${lang}.png`;
    currentFlag.alt = `${lang} flag`;
    currentLanguage.textContent = translations[lang].language.current;

    // Update dropdown options
    const dropdownOptions = document.querySelectorAll('.language-option');
    dropdownOptions.forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        if (optionLang !== lang) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    });

    // Store the selected language
    localStorage.setItem('preferredLanguage', lang);
}

function getNestedTranslation(obj, path) {
    return path.split('.').reduce((p, c) => p && p[c] || null, obj);
}

// Function to initialize the page language
function initializeLanguage() {
    const storedLang = localStorage.getItem('preferredLanguage');
    const preferredLang = storedLang || getPreferredLanguage();
    changeLanguage(preferredLang);
}

// Event listeners for language options
document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', (e) => {
        const lang = e.currentTarget.getAttribute('data-lang');
        changeLanguage(lang);
    });
});

// Initialize language when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    // Set the current year in the footer
    document.getElementById('copyrightFooter').innerHTML = `© ${new Date().getFullYear()} by Daniele Morotti`;
});

/* 
  	Openable menu management 
*/
let menu_icon = $('#menu-icon');
let icon_change = $('#open-icon');
let nav = $('#myNav');
let is_on = true;
//fontawsome link
let lines = "fas fa-bars fa-2x";
let cross = "fas fa-times fa-2x";

menu_icon.click(()=>{
	openNav();
	return false;
});

// Called if one item of the list is clicked 
function closer() {
	openNav();
	toggle_icon("lines");
}

// Open when someone clicks on the span element
function openNav() {
	if (is_on) {
		document.getElementById("myNav").style.height = "100%";
		is_on = false;
		toggle_icon("cross");
	} else {
		document.getElementById("myNav").style.height = "0%";
		is_on = true;
		toggle_icon("lines");
	}
}
// Change between lines and cross menu icon
function toggle_icon(type){
	if(type == "cross"){
		icon_change.removeClass(lines);
		icon_change.addClass(cross);
	}
	else{
		icon_change.removeClass(cross);
		icon_change.addClass(lines);
	}
}

/*
	Scrolling with arrow management
*/

let home_height = $("#particles-js").outerHeight();
let arrow = $("#arrow i");
let up_arr = "fas fa-angle-up";
let down_arr = "fas fa-angle-down";
//change the arrow direction
$(document).on( 'scroll', function(){
	let curr_pos = document.documentElement.scrollTop || document.body.scrollTop;
	if(curr_pos >= home_height){
		arrow.removeClass(down_arr);
		arrow.addClass(up_arr);
	}
	else{
		arrow.removeClass(up_arr);
		arrow.addClass(down_arr);
	}
 });

// Scroll the page when the user clicks on the arrow
$("#arrow span").click(() => {
	let curr_pos = document.documentElement.scrollTop || document.body.scrollTop;
	//if the user is after the homepage it returns to the homepage
	if(curr_pos >= home_height){
		let scrollDistance = $("#particles-js").offset().top;
		$("html, body").animate(
			{
			scrollTop: scrollDistance + "px"
			},
			500
		); 
	}
	//if the user is in the homepage, it scrolls down to the about section
	else{
		let scrollDistance = $("#about").offset().top;
		$("html, body").animate(
			{
			scrollTop: scrollDistance + "px"
			},
			500
		); 
	}
});


/*
	Opening projects list management
*/
let univ_summ = $('#univ_summ');
let pers_summ = $('#pers_summ');

//fontawsome link
let open = "fas fa-caret-down";
let close = "fas fa-caret-up";

univ_summ.click(()=>{
	toggle_projects("#univ_summ ");
});

pers_summ.click(()=>{
	toggle_projects('#pers_summ ');
});

// Change the icon of the clicked menu
function toggle_projects(which){
	if($(which + ' > i').attr('class') == open){
		$(which + '> i').removeClass();
		$(which + '> i').addClass(close);
	}
	else{
		$(which + '> i').removeClass();
		$(which + '> i').addClass(open);
	}
}
