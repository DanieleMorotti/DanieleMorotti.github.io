/*
	LANGUAGE HANDLING AND DETECTION
*/

const availableLocales = ['en', 'it'];
const defaultLanguage = 'en';
let activeLanguage = defaultLanguage;
let refreshProjectsUI = null;

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
		nav: {
			contact: 'Contact',
			projects: 'Projects',
			education: 'Education',
			experience: 'Experience',
			about: 'About me',
			home: 'Home'
		},
		home: {
			title: "Graduate with a master's degree in AI",
			resume: "Download my resume",
			focus: {
				first: 'Interested in <strong>AI</strong> broadly, and recently working on <strong>agent-based systems</strong>',
				second: 'Always <strong>learning</strong> and exploring new technologies',
				third: 'Passionate about <strong>contributing</strong> to open-source projects'
			}
		},
		about: {
			title: 'About Me',
			description: "Hi, I'm <b>Daniele</b>! I graduated with a Master's degree in <b>Artificial Intelligence</b>. I enjoy learning new technologies and applying them to solve problems and build new projects.<br>Currently, I'm interested in <i>Agents</i>, <i>NLP</i>, <i>Deep Learning</i>, and everything related to Artificial Intelligence. In my free time, I play tennis 🎾, play the guitar 🎸, and code 👨‍💻.<br>Happy to be a <strong>contributor</strong> in the <a href='https://github.com/openai/openai-agents-python' target='_blank'><u>openai-agents</u></a> package."
		},
		experience: {
			title: 'Professional experience',
			dienneaCompany: 'Diennea - Faenza',
			dienneaPeriod: 'Dec 2023 - Present',
			dienneaRole: 'AI Engineer',
			dienneaDescription: "- Design, implementation, and maintenance of Artificial Intelligence applications. <strong>Integration</strong> of AI capabilities into existing software, collaborating with the relevant internal development teams.<br>- Definition and drafting of <strong>functional and technical specifications</strong> for AI features, coordinating with stakeholders and product/development teams.<br>- <strong>Design</strong> and management of the implementation of an <strong>agent system</strong> integrated into the company software to identify and analyze data and perform operational actions.<br>- Implementation of an <strong>MCP (Model Context Protocol)</strong> server for the integration and orchestration of tools and data sources.<br>- Implementation and production deployment of a <strong>FastAPI server</strong> to handle requests from AI tools integrated into the software.<br>- Development of a <strong>recommendation algorithm</strong> to suggest products to purchase, using sparse matrices to optimize efficiency and ensure scalability.<br>- Experimentation and validation of additional <strong>machine learning</strong> tasks to extract value from customer data.",
			datareplyCompany: 'Data Reply - Bologna',
			datareplyPeriod: 'Apr 2023 - Aug 2023',
			datareplyPosition: 'Data Scientist Intern',
			datareplyDescription: '- Development of my <strong>thesis project</strong>, which aimed to process custom data of various types (textual and tabular data) to make them usable by LLMs.<br>- Throughout this period, I used the OpenAI API and extensively tested numerous open-source language models.<br>- Conducted <strong>fine-tuning</strong> experiments and compared their effectiveness with a <strong>retrieval augmented generation</strong> approach.'
		},
		education: {
			title: 'Education',
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
			title: 'Projects',
			university: 'University projects',
			aiii: {
				title: 'Counterfactual explanations',
				description: 'The work concerns the development of a model <strong>combining Machine Learning and Optimization</strong> for Counterfactual Explanations using OMLT and DiCE Python packages. We generated counterfactuals considering the GSM Arena dataset.'
			},
			songsRec: {
				title: 'Songs recommendation based on lyrics',
				description: 'I first performed an analysis of the lyrics using <strong>LSA</strong> and other techniques in R. Then I <strong>implemented different GNNs</strong>, on a narrow subset of songs, that are able to recommend the most similar songs to a given one.'
			},
			argRetrieval: {
				title: 'Argument retrieval for comparative questions',
				description: 'We implemented different pipelines in order to retrieve the <strong>most relevant documents</strong>, from a subset of ClueWeb12, given some comparative questions. In another task we performed <strong>stance classification</strong> on these documents.'
			},
			posQA: {
				title: 'POS tagging &amp; QA',
				description: 'In one assignment we implemented different models for <strong>POS tagging</strong>, in the other one some models for abstractive QA on CoQA.'
			},
			vlsi: {
				title: 'VLSI Design',
				description: "We implemented 3 different models for the 'Combinatorial and Decision Making Optimization' exam using <strong>CP, SMT and MIP</strong> techniques to solve the <strong>VLSI design</strong> problem."
			},
			bis: {
				title: 'Blind Image Separation',
				description: "I implemented a <strong>convolutional network</strong>, for the 'Deep Learning' exam, that allows to <strong>separate</strong> 2 mixed images taken from MNIST and FASHION MNIST datasets."
			},
			bachelorDissert: {
				title: 'Blockchain-based anti-counterfeiting system',
				description: "The system has been developed as my <strong>graduation project</strong>. The aim of the project is to fight and avoid clothing's <strong>counterfeit</strong> thanks to the use of <strong>blockchain</strong> technology.",
				src: 'Dissertation'
			},
			mm: {
				title: 'M&amp;M - Mistery at the museum',
				description: 'The aim of the project was to <a href="https://en.wikipedia.org/wiki/Gamification" target="_blank"><u>gamify</u></a> the visit to a museum to entertain children. The project is composed by 3 <strong>web applications</strong>: Player, Editor and Evaluator.'
			},
			twitterTracker: {
				title: 'Twitter-Tracker',
				description: 'Twitter-tracker is a web app created for collecting published <strong>tweets</strong> from around the world and viewing them in various representations. The application was developed using <a href="https://en.wikipedia.org/wiki/Agile_software_development" target="_blank"><u>Agile</u></a> methodologies.'
			},
			bikaya: {
				title: 'BiKaya OS',
				description: 'BiKaya is an educational-purpose, cross-architecture <strong>operating system</strong> compatible with <a href="https://github.com/acsor/BiKaya/blob/master/contrib/uARM-Informal-Specifications.pdf" target="_blank"><u>uARM</u></a> and <a href="https://github.com/acsor/BiKaya/blob/master/contrib/uMPS2-Principles-of-Operation.pdf" target="_blank"><u>uMPS2</u></a>, two micro ISAs derived from ARM and MIPS, respectively.'
			},
			personal: 'Personal projects',
            showMore: 'Show more projects',
            showLess: 'Show fewer projects',
            previous: 'Previous projects',
            next: 'Next projects',
			showscoutai: {
				title: 'ShowScout AI',
				description: 'A <strong>webapp</strong> to be always updated on the latest <strong>news from the movies and tv shows</strong> you are waiting for. Create a list of titles and the <strong>AI</strong> will find news for you.'
			},
			scoreboard: {
				title: 'Generic scoreboard',
				description: 'This is a <strong>generic scoreboard</strong> that you can use for any game you are playing with your friends. You can choose how many points to reach and whether who has more or who has less wins',
				analysis: "Game analysis"
			},
			telegram: {
				title: 'Telegram messages checker',
				description: "A simple script to check if messages containing <strong>certain words</strong> arrive on your <strong>Telegram</strong> account. A song is played to alert you or to wake you up in case you are waiting for an important message during the night."
			}
		},
		contact: {
			title: 'Get in touch'
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
		nav: {
			contact: 'Contatti',
			projects: 'Progetti',
			education: 'Formazione',
			experience: 'Esperienze',
			about: 'Chi sono',
			home: 'Home'
		},
		home: {
			title: "Laureato in Artificial Intelligence",
			resume: "Download del mio CV",
			focus: {
				first: "Interessato all'<strong>AI</strong> in generale, ultimamente lavoro a <strong>sistemi di agenti</strong>",
				second: "<strong>Imparo</strong> cose nuove ed esploro tecnologie emergenti",
				third: 'Felice di <strong>contribuire</strong> a progetti open-source.'
			}
		},
		about: {
			title: 'Chi sono',
			description: "Ciao, sono <b>Daniele</b>! Mi sono laureato nel corso di Laurea Magistrale in <b>Artificial Intelligence</b>. Mi piace imparare nuove tecnologie e applicarle per risolvere dei problemi e creare nuovi progetti.<br>Attualmente sono interessato agli <i>agenti</i>, <i>NLP</i>, <i>Deep Learning</i> e tutto ciò che riguarda l'Intelligenza Artificiale. Nel tempo libero gioco a tennis 🎾, suono la chitarra 🎸 e programmo 👨‍💻.<br>Felice di aver <strong>contribuito</strong> alla libreria python <a href='https://github.com/openai/openai-agents-python' target='_blank'><u>openai-agents</u></a>."
		},
		experience: {
			title: 'Esperienze lavorative',
			dienneaCompany: 'Diennea - Faenza',
			dienneaPeriod: 'Dic 2023 - Presente',
			dienneaRole: 'AI Engineer',
			dienneaDescription:"- Progettazione, implementazione e mantenimento di applicazioni di Intelligenza Artificiale. <strong>Integrazione</strong> di funzionalità AI nel software esistente, collaborando con i relativi team di sviluppo aziendale.<br>- Definizione e stesura delle <strong>specifiche funzionali e tecniche</strong> delle feature AI, coordinandosi con stakeholder e team di prodotto/sviluppo.<br>- <strong>Progettazione</strong> e gestione dell'implementazione di un <strong>sistema di agenti</strong> integrato nel software aziendale per individuare e analizzare dati e svolgere azioni operative.<br>- Implementazione di un server <strong>MCP (Model Context Protocol)</strong> per l'integrazione e l'orchestrazione di tool e sorgenti dati.<br>- Implementazione e rilascio in produzione di un <strong>server FastAPI</strong> per gestire le richieste dei tool AI integrati nel software.<br>- Sviluppo di un <strong>algoritmo di recommendation</strong> per suggerire prodotti da acquistare, utilizzando matrici sparse per ottimizzare l'efficienza e garantire scalabilità.<br>- Sperimentazione e validazione di ulteriori task di <strong>machine learning</strong> per valorizzare i dati dei clienti.",
			datareplyCompany: 'Data Reply - Bologna',
			datareplyPeriod: 'Apr 2023 - Ago 2023',
			datareplyPosition: 'Data Scientist Intern',
			datareplyDescription: '- Sviluppo del mio <strong>progetto di tesi</strong>, il cui scopo era quello di processare dati personalizzati di diversi tipi (dati testuali e tabulari), per renderli utilizzabili da Large Language Models.<br>- Durante questo periodo, ho utilizzato le API di OpenAI e testato ampiamente numerosi modelli di linguaggio open-source.<br>- Condotti esperimenti di <strong>fine-tuning</strong> e confrontata la loro efficacia con un approccio <strong>RAG</strong>.'
		},
		education: {
			title: 'Istruzione e formazione',
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
			title: 'Progetti',
			university: 'Progetti universitari',
			aiii: {
				title: 'Counterfactual explanations',
				description: 'Il lavoro riguarda lo sviluppo di un modello che <strong>combina ML e ottimizzazione</strong> per spiegazioni controfattuali utilizzando le librerie Python OMLT e DiCE. Abbiamo generato spiegazioni considerando il dataset GSM Arena.'
			},
			songsRec: {
				title: 'Songs recommendation based on lyrics',
				description: "Ho prima eseguito un'analisi dei testi delle canzoni utilizzando <strong>LSA</strong> e altre tecniche in R. In seguito ho <strong>implementato diverse GNN</strong>, utilizzando un insieme ristretto di canzoni, che raccomandano le canzoni più simili ad una data in input."
			},
			argRetrieval: {
				title: 'Argument retrieval for comparative questions',
				description: "Abbiamo implementato vari sistemi per ottenere i <strong>documenti più rilevanti</strong>, presi da un sottoinsieme di ClueWeb12, date delle domande comparative. In un'altra task abbiamo eseguito <strong>stance detection</strong> sui documenti."
			},
			posQA: {
				title: 'POS tagging &amp; QA',
				description: "In un assignment abbiamo implementato diversi modelli per eseguire <strong>POS tagging</strong>, nell'altro invece abbiamo usato dei modelli per rispondere alle domande del dataset CoQA."
			},
			vlsi: {
				title: 'VLSI Design',
				description: "Abbiamo implementato 3 diversi modelli per l'esame di 'Combinatorial and Decision Making Optimization' utilizzando <strong>CP, SMT e MIP</strong> per risolvere il problema di <strong>VLSI design</strong>."
			},
			bis: {
				title: 'Blind Image Separation',
				description: "Ho implementato una <strong>rete convoluzionale</strong>, per l'esame di 'Deep Learning', che permette di <strong>separare</strong> 2 immagini sovrapposte prese dai dataset MNIST e FASHION MNIST."
			},
			bachelorDissert: {
				title: 'Sistema anticontraffazione basato su blockchain',
				description: "Il sistema è stato sviluppato come mio <strong>progetto di laurea</strong>. L'obiettivo del progetto è di combattere ed evitare la <strong>contraffazione</strong> nel mondo della moda utilizzando la tecnologia <strong>blockchain</strong>.",
				src: "Tesi"
			},
			mm: {
				title: 'M&amp;M - Mistero al museo',
				description: 'Lo scopo del progetto era quello di <a href="https://it.wikipedia.org/wiki/Gamification" target="_blank"><u>gamificare</u></a> le visite al museo per intrattenere i ragazzi. Il progetto è composto da 3 <strong>applicazioni web</strong>: Player, Editor e Valutatore.'
			},
			twitterTracker: {
				title: 'Twitter-Tracker',
				description: `Twitter-tracker è un'applicazione web creata per collezionare i <strong>tweet</strong> pubblicati in tutto il mondo e mostrarli in diverse modalità. L'applicazione è stata sviluppata utilizzando metodologie <a href="https://en.wikipedia.org/wiki/Agile_software_development" target="_blank"><u>agili</u></a>.`
			},
			bikaya: {
				title: 'Sistema operativo Bikaya',
				description: 'BiKaya è un <strong>sistema operativo</strong> progettato a scopo educativo e compatibile con 2 architetture, <a href="https://github.com/acsor/BiKaya/blob/master/contrib/uARM-Informal-Specifications.pdf" target="_blank"><u>uARM</u></a> e <a href="https://github.com/acsor/BiKaya/blob/master/contrib/uMPS2-Principles-of-Operation.pdf" target="_blank"><u>uMPS2</u></a>, due micro ISA derivate rispettivamente da ARM e MIPS.'
			},
			personal: 'Progetti personali',
			showMore: 'Mostra altri progetti',
			showLess: 'Mostra meno progetti',
			previous: 'Progetti precedenti',
			next: 'Progetti successivi',
			showscoutai: {
				title: 'ShowScout AI',
				description: "La <strong>webapp</strong> per essere sempre aggiornati sulle ultime <strong>novità dei film e serie tv</strong> che stai aspettando. Crea una lista di titoli e l'<strong>IA</strong> cercherà le ultime novità per te."
			},
			scoreboard: {
				title: 'Segnapunti generico',
				description: 'Ho creato un <strong>segnapunti generico</strong> utilizzabile per ogni gioco. Si può inserire il titolo del gioco, il numero di giocatori, il punteggio massimo e se vince chi ha più punti oppure chi ne ha meno.',
				analysis: "Analisi partita"
			},
			telegram: {
				title: 'Sveglia per messaggi Telegram',
				description: "Composto da alcuni semplici script che controllano se i messaggi ricevuti su <strong>Telegram</strong> contengono le <strong>parole scelte</strong> dall'utente. Nel caso in cui siano presenti, verrà riprodotta una canzone per avvisare o svegliare l'utente."
			}
		},
		contact: {
			title: 'Contattami'
		}
	}
};

// Function to change the language
function changeLanguage(lang) {
    if (!translations[lang]) {
        return;
    }

    activeLanguage = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-translate]').forEach((element) => {
        const key = element.getAttribute('data-translate');
        const translation = getNestedTranslation(translations[lang], key);
        if (translation) {
            element.innerHTML = translation;
        } else {
            console.warn(`No translation found for key: ${key} in language: ${lang}`);
        }
    });

    const currentFlag = document.getElementById('current-flag');
    const currentLanguage = document.getElementById('current-language');
    if (currentFlag && currentLanguage) {
        currentFlag.src = `ref/images/${lang}.png`;
        currentFlag.alt = `${lang} flag`;
        currentLanguage.textContent = translations[lang].language.current;
    }

    document.querySelectorAll('.language-option').forEach((option) => {
        option.style.display = option.getAttribute('data-lang') === lang ? 'none' : 'flex';
    });

    updateResumeButton(lang);
    if (typeof refreshProjectsUI === 'function') {
        refreshProjectsUI();
    }
    localStorage.setItem('preferredLanguage', lang);
}

function updateResumeButton(lang) {
    const resumeBtn = document.getElementById('resume-button');
    if (!resumeBtn) {
        return;
    }

    const isItalian = lang === 'it';
    resumeBtn.href = isItalian ? 'ref/docs/resume_it.pdf' : 'ref/docs/resume_en.pdf';
    resumeBtn.setAttribute('download', isItalian ? 'Daniele-Morotti-cv.pdf' : 'Daniele-Morotti-resume.pdf');
}

function getNestedTranslation(obj, path) {
    return path.split('.').reduce((p, c) => p && p[c] || null, obj);
}

function initializeLanguage() {
    const storedLang = localStorage.getItem('preferredLanguage');
    const preferredLang = storedLang || getPreferredLanguage() || defaultLanguage;
    changeLanguage(preferredLang);
}

function setupLanguageDropdown() {
    const dropdownToggle = document.getElementById('language-dropdown');
    const dropdownMenu = document.getElementById('language-menu');
    const nav = document.getElementById('site-nav');
    const menuButton = document.getElementById('menu-icon');
    const body = document.body;
    if (!dropdownToggle || !dropdownMenu) {
        return;
    }

    dropdownToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        if (window.innerWidth <= 860 && nav && nav.classList.contains('is-open')) {
            nav.classList.remove('is-open');
            if (menuButton) {
                menuButton.setAttribute('aria-expanded', 'false');
                menuButton.classList.remove('is-open');
            }
            body.classList.remove('no-scroll');
        }
        const isOpen = dropdownMenu.classList.toggle('is-open');
        dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.language-picker')) {
            dropdownMenu.classList.remove('is-open');
            dropdownToggle.setAttribute('aria-expanded', 'false');
        }
    });

    document.querySelectorAll('.language-option').forEach((option) => {
        option.addEventListener('click', (e) => {
            const lang = e.currentTarget.getAttribute('data-lang');
            changeLanguage(lang);
            dropdownMenu.classList.remove('is-open');
            dropdownToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function setupMobileNavigation() {
    const menuButton = document.getElementById('menu-icon');
    const nav = document.getElementById('site-nav');
    const languageMenu = document.getElementById('language-menu');
    const languageToggle = document.getElementById('language-dropdown');
    const body = document.body;

    if (!menuButton || !nav) {
        return;
    }

    const closeMenu = () => {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.classList.remove('is-open');
        body.classList.remove('no-scroll');
    };

    menuButton.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        menuButton.classList.toggle('is-open', isOpen);
        body.classList.toggle('no-scroll', isOpen && window.innerWidth <= 860);
        if (isOpen && languageMenu && languageToggle) {
            languageMenu.classList.remove('is-open');
            languageToggle.setAttribute('aria-expanded', 'false');
        }
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    nav.addEventListener('click', (event) => {
        if (event.target === nav) {
            closeMenu();
        }
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-shell')) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) {
            closeMenu();
        } else if (nav.classList.contains('is-open')) {
            body.classList.add('no-scroll');
        }
    });

    closeMenu();
}

function setupNavScrollState() {
    const navWrap = document.querySelector('.top-nav-wrap');
    if (!navWrap) {
        return;
    }

    const toggleScrolledState = () => {
        navWrap.classList.toggle('is-scrolled', window.scrollY > 16);
    };

    toggleScrolledState();
    window.addEventListener('scroll', toggleScrolledState, { passive: true });
}

function setupProjectsCarousel() {
    const filterButtons = Array.from(document.querySelectorAll('[data-project-filter]'));
    const cards = Array.from(document.querySelectorAll('[data-project-group]'));
    const viewport = document.querySelector('.projects-viewport');
    const track = document.getElementById('projects-track');
    const prevButton = document.getElementById('projects-prev');
    const nextButton = document.getElementById('projects-next');
    const pagination = document.getElementById('projects-pagination');
    let currentIndex = 0;
    let slidesPerView = 1;
    let visibleCards = [];
    let touchStartX = 0;

    if (!filterButtons.length || !cards.length || !viewport || !track || !prevButton || !nextButton || !pagination) {
        return;
    }

    const localize = (translationKey) => {
        const localeObject = translations[activeLanguage] || translations[defaultLanguage];
        return getNestedTranslation(localeObject, translationKey) || translationKey;
    };

    const getSlidesPerView = () => {
        if (window.innerWidth <= 560) {
            return 1;
        }
        if (window.innerWidth <= 980) {
            return 2;
        }
        return 3;
    };

    const getTrackGap = () => {
        const styles = window.getComputedStyle(track);
        const rawGap = styles.columnGap !== 'normal' ? styles.columnGap : styles.gap;
        const parsedGap = parseFloat(rawGap);
        return Number.isFinite(parsedGap) ? parsedGap : 0;
    };

    const getMaxIndex = () => Math.max(visibleCards.length - slidesPerView, 0);

    const updateButtons = () => {
        const maxIndex = getMaxIndex();
        prevButton.disabled = currentIndex <= 0;
        nextButton.disabled = currentIndex >= maxIndex;
    };

    const buildPagination = () => {
        const maxIndex = getMaxIndex();
        const totalPages = maxIndex + 1;
        pagination.hidden = totalPages <= 1;
        pagination.innerHTML = '';

        for (let i = 0; i < totalPages; i += 1) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'projects-dot';
            dot.setAttribute('aria-label', `${localize('projects.title')} ${i + 1}`);
            dot.classList.toggle('is-active', i === currentIndex);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateLayout();
            });
            pagination.appendChild(dot);
        }
    };

    const updateLayout = () => {
        slidesPerView = getSlidesPerView();
        visibleCards = cards.filter((card) => !card.hidden);
        const maxIndex = getMaxIndex();
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        prevButton.setAttribute('aria-label', localize('projects.previous'));
        nextButton.setAttribute('aria-label', localize('projects.next'));

        const viewportWidth = viewport.clientWidth;
        const gap = getTrackGap();
        const cardWidth = (viewportWidth - gap * (slidesPerView - 1)) / slidesPerView;

        visibleCards.forEach((card) => {
            card.style.flex = cardWidth > 0 ? `0 0 ${cardWidth}px` : '';
        });

        const offset = (cardWidth + gap) * currentIndex;
        track.style.transform = `translateX(-${Math.max(0, offset)}px)`;

        updateButtons();
        buildPagination();
    };

    const applyFilter = (group) => {
        currentIndex = 0;

        cards.forEach((card) => {
            card.hidden = card.getAttribute('data-project-group') !== group;
        });

        filterButtons.forEach((button) => {
            button.classList.toggle('is-active', button.getAttribute('data-project-filter') === group);
        });

        requestAnimationFrame(updateLayout);
    };

    const move = (direction) => {
        const maxIndex = getMaxIndex();
        if (direction === 'prev' && currentIndex > 0) {
            currentIndex -= 1;
        } else if (direction === 'next' && currentIndex < maxIndex) {
            currentIndex += 1;
        } else {
            return;
        }
        updateLayout();
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            applyFilter(button.getAttribute('data-project-filter'));
        });
    });

    prevButton.addEventListener('click', () => move('prev'));
    nextButton.addEventListener('click', () => move('next'));

    viewport.setAttribute('tabindex', '0');
    viewport.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            move('prev');
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            move('next');
        }
    });

    viewport.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    viewport.addEventListener('touchend', (event) => {
        const deltaX = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) < 35) {
            return;
        }
        move(deltaX > 0 ? 'prev' : 'next');
    }, { passive: true });

    window.addEventListener('resize', updateLayout);
    refreshProjectsUI = updateLayout;

    const initiallyActive = document.querySelector('.project-filter.is-active');
    const initialGroup = initiallyActive
        ? initiallyActive.getAttribute('data-project-filter')
        : filterButtons[0].getAttribute('data-project-filter');

    applyFilter(initialGroup);
}

function setupRevealAnimations() {
    const revealItems = document.querySelectorAll('.reveal');
    if (!revealItems.length) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealItems.forEach((item) => observer.observe(item));
}

function setupResponsiveHeroFocus() {
    const heroText = document.querySelector('.hero-text');
    const siteHeader = document.querySelector('.site-header');
    const mobileBreakpoint = 860;
    const safetyGap = 8;
    let rafId = null;

    if (!heroText || !siteHeader) {
        return;
    }

    const evaluate = () => {
        rafId = null;

        if (window.innerWidth > mobileBreakpoint) {
            heroText.classList.remove('show-mobile-focus');
            return;
        }

        heroText.classList.add('show-mobile-focus');

        const headerStyle = window.getComputedStyle(siteHeader);
        const paddingTop = parseFloat(headerStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(headerStyle.paddingBottom) || 0;
        const availableHeight = window.innerHeight - paddingTop - paddingBottom - safetyGap;

        if (heroText.scrollHeight > availableHeight) {
            heroText.classList.remove('show-mobile-focus');
        }
    };

    const scheduleEvaluate = () => {
        if (rafId !== null) {
            window.cancelAnimationFrame(rafId);
        }
        rafId = window.requestAnimationFrame(evaluate);
    };

    scheduleEvaluate();
    window.addEventListener('resize', scheduleEvaluate);
    window.addEventListener('orientationchange', scheduleEvaluate);
    window.addEventListener('load', scheduleEvaluate);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(scheduleEvaluate).catch(() => {});
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    setupLanguageDropdown();
    setupMobileNavigation();
    setupNavScrollState();
    setupProjectsCarousel();
    setupResponsiveHeroFocus();
    setupRevealAnimations();

    const footer = document.getElementById('copyrightFooter');
    if (footer) {
        footer.textContent = `\u00A9 ${new Date().getFullYear()} by Daniele Morotti`;
    }
});
