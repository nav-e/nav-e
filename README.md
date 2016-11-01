# GreenNav

This project aims to provide a reference implementation for the GreenNavigation front end. It makes use of the different polymer elements created for GreenNav.

## Getting Started 

### Prerequisites

- Install the latest version of Node.js and NPM 

  For Mac OS X or Windows you can download the pre-build installers from https://nodejs.org/en/download/ .
  If you use Linux we recommend to add Node.js to your sources. Eg. for Ubuntu based distributions the most up-to-date ppa   is provided by https://launchpad.net/~chris-lea/+archive/node.js/

```zsh
sudo add-apt-repository ppa:chris-lea/node.js  
sudo apt-get update  
sudo apt-get install nodejs
```

- Get bower

```zsh
sudo npm install -g bower
(Windows: just npm install -g bower)
```

### Setup

- Clone the repository
- Install the dependencies
 
```zsh
bower install
```
  
:heavy_exclamation_mark: To see an example route with a button click, fetch the routing service from [here](https://github.com/Greennav/service-routing) and run the local server (see corresponding README for instructions).

### Run

You need to install the Polymer CLI (command-line interface) to view a live demo of the app.

```zsh
sudo npm install -g polymer-cli
```
  
Now you can simply run 

```zsh
polymer serve
```

And the webapp is accessible at http://localhost:8080/.

### Development

#### Git Workflow

- Please fork the repository
- Clone the webapp repository from your github account
```zsh
git clone https://github.com/$(GITHUB_USER)/webapp.git
```
- Create a new feature branch
```zsh
cd webapp
git checkout -b your-feature
```
- Make local changes and implement your feature 
- Push your branch to GitHub
- Open a pull request

#### Create own elements

In order to create a new reusable custom element to use here, check out the official guide at [the polymer   website](https://www.polymer-project.org/1.0/docs/start/reusableelements.html) and request a new repository. For examples, check out the different existing elements used in this project.
