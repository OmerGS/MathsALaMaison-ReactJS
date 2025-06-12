# Documentation du Serveur de Jeu de MathsALaMaison

Documentation du serveur pour gérer l'application de MathsALaMaison, permettant aux utilisateurs de s'enregistrer, se connecter, et jouer en ligne via WebSocket. Le serveur inclut des fonctionnalités telles que la gestion des utilisateurs, la mise à jour des informations, la gestion des erreurs, et l'envoi d'alertes en cas d'erreurs critiques.


## Les Routes API

La documentation complète des routes API est disponible à l’adresse suivante : 

-> [Documentation de l'API](https://mathsalamaison-backend.omergs.com/api-docs/)

## Securité

Le serveur traite ou envoie des informations uniquement lorsqu'une clé API spécifique est présent dans l'entête du paquet.
Si la clé API n'est pas correcte, alors le message : {"error":"Accès refusé : clé API invalide"} sera envoyé. 

## Alertes SMS

Le serveur utilise l'API de **Free Mobile** pour envoyer des alertes SMS en cas d'erreurs critiques. Les alertes sont envoyées à
Omer GUNES, via des SMS.

## Gestion des erreurs

Le serveur gère les erreurs critiques en les consignant dans les logs et en envoyant des alertes par SMS. L'envoi d'alertes est effectué via l'API de **Free Mobile**, et les erreurs sont loguées dans un fichier `logs/{date}.log` pour une consultation ultérieure.

### Exemple d'alerte SMS

- **Message** : "Erreur critique : {message d'erreur}"
- **Destinataire** : Administrateur configuré via les variables d'environnement (`FREE_MOBILE_USER`, `FREE_MOBILE_TOKEN`)

## Journalisation 

Le serveur met en place un système de **journalisation** (logging) pour suivre et enregistrer les événements importants qui se produisent pendant son fonctionnement. Ce système permet de diagnostiquer les problèmes, surveiller l'état du serveur et analyser l'historique des requêtes.

### Fonctionnement de la journalisation

1. **Fichier de log par jour** :
   Le serveur génère un fichier de log distinct pour chaque jour. Le nom du fichier de log inclut la date au format `app-AAAA-MM-JJ.log`, ce qui permet d'identifier rapidement les logs d'un jour donné. Par exemple :

2. **Contenu du fichier de log** :
Chaque entrée dans le fichier de log contient les informations suivantes :
- **Heure** : La date et l'heure de l'événement.
- **Type d'événement** : Le type de l'événement (par exemple, requêtes reçues, erreurs serveur).
- **Détails de l'événement** : Des informations supplémentaires concernant l'événement

#### Exemple d'entrée de log :

- [2024-11-21 00:07:16] INFO: [21/11/2024 00:07:16] GET request from ::ffff:37.170.125.4 to /questions
- [2024-11-21 00:07:22] INFO: [21/11/2024 00:07:22] GET request from ::ffff:37.170.125.4 to /users

- [2024-11-12 10:18:03] INFO: Starting server.......
- [2024-11-12 10:18:03] INFO: Connecting to database: mathsALaMaison with user: app at host: omergs.com:XXXXXX
- [2024-11-12 10:19:06] INFO: Starting server.......
- [2024-11-12 10:19:06] INFO: Connecting to database: mathsALaMaison with user: app at host: omergs.com:XXXXXX
- [2024-11-12 10:19:29] INFO: RotakZZ added to waiting list.
- [2024-11-12 10:19:33] INFO: Patrique added to waiting list.
- [2024-11-12 10:19:35] INFO: Romain added to waiting list.
- [2024-11-12 10:19:35] INFO: Creating game with ID game-1731403175422 and players: RotakZZ, Patrique, Romain
- [2024-11-12 10:19:35] INFO: Game created
- [2024-11-12 10:19:39] INFO: Mael added to waiting list.
- [2024-11-12 10:19:50] INFO: Le nombre de partie joué de Romain a été mis à jour.
- [2024-11-12 10:19:50] INFO: Le score du joueur Patrique a été mis à jour.
- [2024-11-12 10:19:51] INFO: Le nombre de partie joué de RotakZZ a été mis à jour.
- [2024-11-12 10:19:51] INFO: Le nombre de partie joué de Patrique a été mis à jour.
- [2024-11-12 10:19:51] INFO: La partie game-1731403175422 est terminée. Patrique a gagné !
   
## Technologies et Package utilisées

- **Node.js** : Environnement d'exécution pour le serveur.
- **Serveur MySQL** : Base de données relationnelle pour stocker les utilisateurs et les questions.
- **Winston** : Pour la journalisation des évenements. 
- **Winston Daily Rotate File** : Pour la rotation automatique et pour archiver les logs antérieurs. 
- **WebSocket** : Communication en temps réel pour le jeu.
- **Free Mobile API** : Pour envoyer des alertes par SMS.
- **dotenv** : Pour la gestion des variables d'environnement.
- **crypto-js** : Pour le chiffrement des mots de passes utilisateur.
- **readline** : Permettant l'execution des commandes dans le terminal.

## Contact

Si vous avez des questions ou des problèmes avec le serveur de jeu, veuillez me contactez.
**Email** : [Omer GUNES](mailto:gunes.e2300540@etud.univ-ubs.fr)