# GreenNav

This project aims to provide a reference implementation for a GreenNav (Green Navigation) front end. It makes use of the different polymer elements created for GreenNav.

## Getting Started 

### Prerequisites

#### Install the latest version of Node.js and npm 

  For Mac OS X or Windows you can download the pre-build installers from [nodejs.org](https://nodejs.org/en/download/) .
  If you use Linux we recommend to add Node.js to your sources. Eg. for Ubuntu based distributions the most up-to-date ppa
  is provided by `https://launchpad.net/~chris-lea/+archive/node.js/`

```zsh
sudo add-apt-repository ppa:chris-lea/node.js  
sudo apt-get update  
sudo apt-get install nodejs
```

#### Install dependencies

- Linux, OSX/macOS
```zsh
sudo npm install -g bower polymer-cli
```

- Windows
```
npm install -g bower polymer-cli
```

### Setup

- Clone the repository
- Install the dependencies
 
```zsh
bower install
```

:heavy_exclamation_mark: To see an example route with a button click, fetch the routing service from
[here](https://github.com/Greennav/service-routing) and run the local server (see corresponding 
README for instructions).

### Run

```zsh
cd /path/to/GreenNav
polymer serve
```

The web interface is now accessible at http://localhost:8080/ by default, see your terminal for details.

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

In order to create a new reusable custom element to use here, check out the official guide at 
[the polymer   website](https://www.polymer-project.org/1.0/docs/start/reusableelements.html)
and request a new repository. For examples, check out the different existing elements used in
this project.
