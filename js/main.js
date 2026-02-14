/*
	LANGUAGE HANDLING AND DETECTION
*/

const availableLocales = ['en', 'it'];
const defaultLanguage = 'en';
let activeLanguage = defaultLanguage;
let refreshProjectExpandLabel = null;

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
			projects: 'Projects &nbsp;<i class="fas fa-clipboard"></i>',
			contact: 'Contact &nbsp;<i class="fas fa-user"></i>'
		},
		nav: {
			contact: 'Contact &nbsp;<i class="fas fa-user"></i>',
			projects: 'Projects',
			education: 'Education',
			about: 'About me',
			home: 'Home&nbsp;<i class="fas fa-home"></i>'
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
			title: 'Projects <i class="fas fa-clipboard"></i>',
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
            showMore: 'Show more projects',
            showLess: 'Show fewer projects',
			showscoutai: {
				title: 'ShowScout AI',
				description: 'A webapp to be always updated on the latest news from the movies and tv shows you are waiting for. Create a list of titles and the AI will find news for you.'
			},
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
			title: 'Contact me <i class="fas fa-user"></i>'
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
			projects: 'Progetti &nbsp;<i class="fas fa-clipboard"></i>',
			contact: 'Contatti &nbsp;<i class="fas fa-user"></i>'
		},
		nav: {
			contact: 'Contatti &nbsp;<i class="fas fa-user"></i>',
			projects: 'Progetti',
			education: 'Formazione',
			about: 'Chi sono',
			home: 'Home &nbsp;<i class="fas fa-home"></i>'
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
			title: 'Progetti <i class="fas fa-clipboard"></i>',
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
            showMore: 'Mostra altri progetti',
            showLess: 'Mostra meno progetti',
			showscoutai: {
				title: 'ShowScout AI',
				description: "La webapp per essere sempre aggiornati sulle ultime novità dei film e serie tv che stai aspettando. Crea una lista di titoli e l'IA cercherà le ultime novità per te."
			},
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
			title: 'Contattami <i class="fas fa-user"></i>'
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
    if (typeof refreshProjectExpandLabel === 'function') {
        refreshProjectExpandLabel();
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

function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('[data-project-filter]');
    const cards = document.querySelectorAll('[data-project-group]');
    const expandButton = document.getElementById('projects-expand');
    const expandWrap = expandButton ? expandButton.parentElement : null;
    const maxVisible = 4;
    const expandedState = {
        university: false,
        personal: false
    };
    let activeGroup = 'university';

    if (!filterButtons.length || !cards.length) {
        return;
    }

    const localize = (translationKey) => {
        const localeObject = translations[activeLanguage] || translations[defaultLanguage];
        return getNestedTranslation(localeObject, translationKey) || translationKey;
    };

    const updateExpandButtonLabel = () => {
        if (!expandButton || !expandWrap) {
            return;
        }

        const cardsInGroup = Array.from(cards).filter((card) => card.getAttribute('data-project-group') === activeGroup);
        if (cardsInGroup.length <= maxVisible) {
            expandWrap.hidden = true;
            return;
        }

        expandWrap.hidden = false;
        const key = expandedState[activeGroup] ? 'projects.showLess' : 'projects.showMore';
        expandButton.setAttribute('data-translate', key);
        expandButton.innerHTML = localize(key);
    };

    refreshProjectExpandLabel = updateExpandButtonLabel;

    const applyFilter = (group) => {
        activeGroup = group;
        const isExpanded = expandedState[group];
        let indexInGroup = 0;

        cards.forEach((card) => {
            const belongsToGroup = card.getAttribute('data-project-group') === group;
            if (!belongsToGroup) {
                card.hidden = true;
                return;
            }

            card.hidden = !isExpanded && indexInGroup >= maxVisible;
            indexInGroup += 1;
        });

        updateExpandButtonLabel();
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((item) => item.classList.remove('is-active'));
            button.classList.add('is-active');
            applyFilter(button.getAttribute('data-project-filter'));
        });
    });

    if (expandButton) {
        expandButton.addEventListener('click', () => {
            expandedState[activeGroup] = !expandedState[activeGroup];
            applyFilter(activeGroup);
        });
    }

    const initiallyActive = document.querySelector('.project-filter.is-active');
    applyFilter(
        initiallyActive
            ? initiallyActive.getAttribute('data-project-filter')
            : filterButtons[0].getAttribute('data-project-filter')
    );
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
    setupProjectFilters();
    setupResponsiveHeroFocus();
    setupRevealAnimations();

    const footer = document.getElementById('copyrightFooter');
    if (footer) {
        footer.textContent = `\u00A9 ${new Date().getFullYear()} by Daniele Morotti`;
    }
});
