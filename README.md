#Projet IFT pour le Ministère de l'Agriculture

##Pré-requis

- [NodeJS](https://nodejs.org/en/) >= 6.9.0
- [Angular CLI](https://github.com/angular/angular-cli) >= 1.7.2

##Développement

Installer les dépendances
```
    npm install
```

Lancer l'application Angular avec la commande
```
    ng serve
```
Se connecter à l'application à l'adresse `http://localhost:4200/`

##Tests

`ng test` exécute les tests unitaires via [Karma](https://karma-runner.github.io).
`ng e2e` exécute les tests end-to-end via [Protractor](http://www.protractortest.org/).
Avant de lancer les tests end-to-end, s'assurer de lancer le serveur de développement avec la commande `ng serve`.

##Déploiements

###Avec docker
 
 ```
    ng build --target=production --environment=docker
    docker-compose -f stack.yml up -d --build
 ```

###Sur l'environnement CTRL

Sur GIT, créer une branche de release : release/x.y
Puis lancer les commandes :
```
    ./prepare_frontend.sh
    git add .
    git commit -a -m "update frontend distribution"
    cd packaging
    mvn clean release:prepare
    mvn clean release:perform
```

Lancer les 2 scripts de déploiement via Rundeck:
- [livraison-moe-war-vers-repo](https://cdp.national.agri/rundeck-zsi/project/ORDO_ENV_ZSI/job/show/cac9ac31-9e8a-4809-a93e-c1b4fa3ceba2)
- [deploiement-rpm-tomcat](https://cdp.national.agri/rundeck-zsi/project/ORDO_ENV_ZSI/job/show/49f1c183-b0ed-4c6c-ac4a-8487b594f6e7)

Fermer la branche release (merge sur master et develop).
Pousser les branches `master` et `develop` sur `Github` et `Gitlab`

## Troubleshootings

1. ### Node Sass does not yet support your current environment
Cette erreur peut subvenir après un `npm install`. Pour résoudre cette erreur:
Supprimer le dossier nodes-module
- Télécharger la version de binding.node correspondant à votre version de node sur le [repository officiel de node-saas](https://github.com/sass/node-sass/releases).
- Mettre le fichier télécharger dans le node_modules sous l'arborescence suivante: */node_modules/node-sass/vendor/linux-x**64-64**/binding.node* (la partie en gras doit être remplacer par la version du binding.node que vous avez télécharger.
Puis relancer un `npm install`
- Ou, lancer directement un npm install avec le chemin du fichier binding.node télécharger: `npm i --sass-binary-path="/home/geraudbonou/linux-x64-64_binding.node" `
- Lancer un ng serve ou `npm start --sass-binary-path="/home/geraudbonou/linux-x64-64_binding.node"  `
 
2.  ### leveldown@2.1.1 install: `prebuild-install || node-gyp rebuild`
Cette erreur peut subvenir après un npm install. Elle est dû à la dépendence pouch-db qui essaye d'installer une bibliothèque c++ native *leveldown*. Un workaround serait de remplacer la dépendance pouchdb par **pouchdb-browser** ou **pouchdb-core** comme discuter [ici](/node_modules/node-sass/vendor/linux-x64-64/).
- Remplacer la dépendance pouchdb par pouchdb-browser dans le fichier package.json
- Remplacer pouchdb par pouchdb-browser dans tous les imports du projet (notamment dans `ift-db.service.ts`) 
- Supprimer le dossier node-modules
- Relancer un npm install et un npm start en précisant ou non le chemin vers le fichier binding.node.
