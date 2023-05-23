/************************************************************
 ************************ VARIABLES *************************
 ************************************************************/
let audio = {
  succes: new Audio("sons/son-bonneReponse.mp3"),
  echec: new Audio("sons/son-mauvaiseReponse.mp3"),
};

// Numéro de la question courante
let noQuestion = 0;

// Nombre de réponses justes
let nombreReponsesJustes = 0;

// Zone d'affichage du quiz
let zoneQuiz = document.querySelector(".main-quiz");

// Zone d'affichage du quiz
let bulleIntro = document.querySelector(".bulle-intro");

// Section contenant une question du quiz et sa position sur l'axe des X
let sectionQuestion = document.querySelector("section");

// Conteneurs des titres des questions et des choix de réponse
let titreQuestion = document.querySelector(".titre-question");
let lesChoixDeReponses = document.querySelector(".les-choix-de-reponse");

// Section  de l'intro
let sectionIntro = document.querySelector(".intro");
// Sesction qui représente la bulle de départ
let titreIntro = document.querySelector(".bulle-intro-anim");

// Zone de fin du quiz
let zoneFin = document.querySelector(".finDuQuiz");

// Le meilleur score
let meilleurScore;
let nouveauMeilleurScore;
//L'élément de la page pour indiquer le meilleur score
let elmMeilleurScore = document.querySelector("#meilleur-score");

/************************************************************
 ************************ ÉVÈNEMENTS ************************
 ************************************************************/

//Gestionnaire d'événement pour détecter la fin de l'animation d'intro
titreIntro.addEventListener("animationend", afficherConsignePourDebuterLeJeu);
// Pour ajouter l'évènement qui va controler le curseur personnalisé
zoneQuiz.addEventListener("mouseover", bougerCurseur);

//On stocke localement le nombre de visites
localStorage.setItem("meilleurScore", meilleurScore);
meilleurScore = localStorage.getItem("meilleurScore");
localStorage.setItem("meilleurScore", nouveauMeilleurScore);

let scoreActuel = localStorage.getItem("meilleurScore");
// Enlever l'ancien meilleur score si le nb de réponses justes est plus grande
if (nombreReponsesJustes > scoreActuel) {
  localStorage.removeItem("meilleurScore");
}
/************************************************************
 ************************ LES FONCTIONS *********************
 ************************************************************/

/**
 * @param {Event} event : objet AnimationEvent de l'événement distribué
 */
function afficherConsignePourDebuterLeJeu(event) {
  //console.log(event.animationName);
  //On affiche la consigne si c'est la fin de la deuxième animation: etirer-mot
  if (event.animationName == "bulle-intro-anim") {
    //On met un écouteur sur la fenêtre pour enlever l'intro et commencer le quiz
    titreIntro.addEventListener("click", commencerLeQuiz);
  }
  if (event.type == "animationend") {
    // Ajouter une transition de 1 seconde sur la propriété de couleur, background-color et taille de police
    titreIntro.style.transition = "color 1s,  font-size 1s";
    titreIntro.style.color = "#07c607";
    titreIntro.style.fontSize = "3rem";
    titreIntro.innerText = "Cliquez sur moi pour commencer!";
  }
}

/* Enlever les éléments de l'intro et commencer le quiz*/
function commencerLeQuiz() {
  //On enlève le conteneur de l'intro
  document.querySelector(".bulle-intro-anim").remove();

  //On enlève l'écouteur qui gère le début du quiz
  titreIntro.removeEventListener("click", commencerLeQuiz);

  //On enlève le conteneur de la section de l'intro
  sectionIntro.style.display = "none";
  //On met le conteneur du quiz visible
  zoneQuiz.style.display = "flex";

  //On affiche la première question
  afficherQuestion();
}

/* Afficher la question courante*/
function afficherQuestion() {
  // Récupérer l'objet de la question en cours dans le tableau des questions
  let objetQuestion = lesQuestions[noQuestion];

  // Affecter le texte dans le titre de la question
  titreQuestion.innerText = objetQuestion.titre;

  // Créer et afficher les balises des choix de réponse :
  // On commence par vider le conteneur des choix de réponses.
  lesChoixDeReponses.innerHTML = "";

  // Puis on le remplit de nouveau avec les choix de réponses de la question
  let unChoix;
  for (let i = 0; i < objetQuestion.choix.length; i++) {
    //On crée la balise et on y affecte une classe CSS
    unChoix = document.createElement("div");
    unChoix.classList.add("choix");
    //On intègre la valeur du choix de réponse
    unChoix.innerText = objetQuestion.choix[i];

    //On affecte dynamiquement l'index de chaque choix
    unChoix.indexChoix = i;

    //On met un écouteur pour vérifier la réponse choisie
    unChoix.addEventListener("mousedown", verifierReponse);

    //Enfin on affiche ce choix
    lesChoixDeReponses.append(unChoix);
  }

  // Modifier la valeur de la position de la section sur l'axe des X pour son animation
  positionX = 100;

  //Partir la première requête pour l'animation de la section
  requestAnimationFrame(animerSection);
}

/* Animer l'arrivée de la section contenant la question*/
function animerSection() {
  // Ajoute une transition de 1 seconde sur la propriété d'opacité
  zoneQuiz.style.transition = "opacity 3s";
  zoneQuiz.style.opacity = "100%";
}

/**
 * Vérifier la réponse cliquée et gerer le passage à la prochaine question.
 *
 * @param {object} event Informations sur l'événement MouseEvent distribué
 */
function verifierReponse(event) {
  lesChoixDeReponses.classList.toggle("desactiver");
  // Capturer et valider la réponse.
  let reponseUtilisateur = event.target.indexChoix;
  let laReponse = lesQuestions[noQuestion].bonneReponse;
  let choix = event.target;
  if (reponseUtilisateur == laReponse) {
    // Associer les effets de l'interface (animation, transition, sons)
    // Incrémenter le nombre de réponses justes
    audio.succes.play();
    choix.classList.add("bonne-reponse-anim");
    nombreReponsesJustes++;
  } else {
    audio.echec.play();
    choix.classList.add("mauvaise-reponse-anim");
  }
  event.target.addEventListener("animationend", gererProchaineQuestion);
}

/**
 * Fonction permettant de gérer l'affichage de la prochaine question
 *
 */
function gererProchaineQuestion(event) {
  // On réactive les clics sur les choix de réponse
  lesChoixDeReponses.classList.toggle("desactiver");

  // On incrémente noQuestion pour la  prochaine question à afficher
  noQuestion++;

  //S'il reste une question on l'affiche, sinon c'est la fin du quiz...
  if (noQuestion < lesQuestions.length) {
    afficherQuestion();
  } else {
    afficherFinQuiz();
  }
}

/************************************************************
 ************************ CURSEUR *************************
 ************************************************************/

function bougerCurseur(event) {
  // Modifiez les valeurs des propriétés personnalisées définis sur la racine du document HTML
  let racine = document.querySelector(":root");
  // Pour gérer la position du curseur personnalisé
  console.log("client X, Y : ", event.clientX, event.clientY);
  racine.style.setProperty("--mouse-x", event.clientX + "px");
  racine.style.setProperty("--mouse-y", event.clientY + "px");
}

/************************************************************
 ********************** FIN DU QUIZ *************************
 ************************************************************/
function recommencer() {
  // Remettre les variables numériques du quiz à leurs valeurs initiales
  nombreReponsesJustes = 0;
  // On réaffiche le conteneur de la zone du quiz (son affichage initial était "flex")
  zoneQuiz.style.display = "flex";
  // Et on retire la zone de "fin du quiz" de l'affichage
  zoneFin.style.display = "none";
  // Finalement, on peut afficher la première question..
  commencerLeQuiz();
}
function afficherFinQuiz() {
  // Retirer la zone du quiz de l'affichage
  zoneQuiz.style.display = "none";

  // Créer dynamiquement la section qui contiendra le score (résultat)
  let sectionResultat = document.createElement("section.sectionResultat");

  // Ajouter dans la sectionResultat le texte correspondant au score obtenu
  sectionResultat.innerText =
    "Votre score: " + nombreReponsesJustes * 10 + " /100%";
  // Ajouter la classe d'animation pour animer le résultat du quiz
  zoneFin.classList.add("animer-resultat");
  nombreReponsesJustes = localStorage.getItem("#meilleurScore");

  // Ajouter la sectionResultat à la zoneFin
  zoneFin.append(sectionResultat);

  // Afficher la zoneFin
  zoneFin.style.display = "flex";
}

function gererLocalStorage() {
  if (nombreReponsesJustes > meilleurScore) {
    meilleurScore.replace();
  }
}
