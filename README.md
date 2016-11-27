# GreenNav

This project aims to provide a reference implementation for a GreenNav (Green Navigation) front end. It makes use of the different react elements created for GreenNav.

![Screenshot](https://cloud.githubusercontent.com/assets/1525818/20647282/91a869c0-b490-11e6-9fda-ff542229dade.gif)

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

### Setup

- Clone the repository
- Install the dependencies
 
```zsh
npm install
```

:heavy_exclamation_mark: To see an example route with a button click, fetch the routing service from
[here](https://github.com/Greennav/service-routing) and run the local server (see corresponding 
README for instructions).

### Run

```zsh
cd /path/to/GreenNav
npm start
```

The web interface is now accessible at http://localhost:3000/ by default, see your terminal for details.

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


## Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!
