# Lancer les Tests

Ce guide explique comment exécuter les tests pour le projet. Suivez les étapes ci-dessous pour garantir le bon fonctionnement.

## Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre système :

1. **Node.js**  
   Téléchargez et installez Node.js depuis [nodejs.org](https://nodejs.org). Cela installera également npm (Node Package Manager), nécessaire pour gérer les dépendances.

2. **TypeScript**  
   Installez TypeScript globalement si ce n'est pas encore fait :
   ```bash
   npm install -g typescript

3. **TypeScript**  
   Installez TypeScript globalement si ce n'est pas encore fait :
   ```bash
   npm install -g typescript

## Étapes pour exécuter les tests

1. **Stratégie d'exécution**

   Ouvrez un terminal PowerShell et exécutez la commande suivante :
   ```bash
   Get-ExecutionPolicy
2. **Sortie de la commande**
    Si la sortie indique Restricted, vous devez modifier la stratégie d'exécution temporairement. Exécutez cette commande pour autoriser l'exécution des scripts :
    ```bash
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
3. **Naviguez vers le dossier des tests**
    À partir de la racine du projet, accédez au dossier contenant les fichiers de tests :
    ```bash
    cd ./components/__tests__/
4. **Lancez les tests**
    Exécutez le fichier principal des tests avec ts-node :
    ```bash
    ts-node MainTest.ts