# GreenNav Web-App

This project aims to be reference for the GreenNavigation front end. It makes use of the different polymer elements created for GreenNav.

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
  ```

### Setup

- Clone the repository

  ```zsh
cd /path/to/your/workspace
git clone https://github.com/Greennav/webapp.git
  ```

- Install the dependencies
 
  ```zsh
cd webapp
bower install
  ```

### Run

You can use ```python -m SimpleHTTPServer``` but we prefer to use ```polyserve```

  ```zsh
sudo npm install polyserve -g 
  ```
  
Now you can simply run 

  ```zsh
polyserve -p 8000
  ```
  
And the front end is now accessible at http://localhost:8000/

### Development

#### Workflow

- Please fork the repository
- Clone the webapp repository from your github account
  ```zsh
git clone https://github.com/$(GUTHUB_USER)/webapp.git
  ```
- Create a new feature branch
  ```zsh
cd webapp
git checkout -b your-feature
  ```
- Make local changes and implement your feature 
- Push your brach to GitHub
  ```zsh
git push
  ```
- Use the ```Pull Request``` button to send us your features or changes.

#### Create own elements

In order to create a new reusable custom element to use here, check out the official guide at [the polymer   website](https://www.polymer-project.org/1.0/docs/start/reusableelements.html) and request a new repository. For examples, check out the different existing elements used in this project.
