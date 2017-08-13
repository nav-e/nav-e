# GreenNav

This project aims to provide a reference implementation for a GreenNav (Green Navigation) front end. It makes use of the different react elements created for GreenNav.

![Screenshot](https://cloud.githubusercontent.com/assets/1525818/20647282/91a869c0-b490-11e6-9fda-ff542229dade.gif)

## TL;DR

- Clone `GreenNav` and `rt-library`
- `npm install` and `npm start` for both
- Chose `Hector-Otto` to `Parc Princesse Antoinette` from suggestions -> `GET ROUTE`
- Contribute :wink:

## Getting Started

### Prerequisites

#### Install the latest version of Node.js and npm

```zsh
sudo apt install nodejs npm

# optional:
# we recommend to set a symlink from nodejs to node
# if you get a command not found error
#
# sudo ln -s /usr/bin/nodejs /usr/bin/node

npm --version
3.10.8
node --version
v7.0.0

```

In some distributions Node.js and npm are a little bit outdated, but *don't panik* :wink: <br />
you can use npm itself to update Node.js and npm to the latest versions.

```zsh
sudo npm install -g npm
sudo npm install -g n

sudo n stable
# or
# sudo n latest
```

### Setup

```zsh
git clone https://github.com/Greennav/GreenNav.git
cd GreenNav
npm install
```

### :heavy_exclamation_mark: Don't forget the back-end

We are currently working on new back-end in Java. Until then, there is a working [demo](https://github.com/Greennav/rt-library) that offers address search and routing functionality using Node.js.

```zsh
git clone https://github.com/Greennav/rt-library.git
cd rt-library
npm install
npm start
```

To show a route, you have to pick a suggestion. `Hector-Otto` to `Parc Princesse Antoinette` is one example.

### Run

```zsh
npm start
```

The web interface is now accessible at http://localhost:3000/ by default, see your terminal for details.


## Docker Setup

[Docker](https://www.docker.com/) allows packaging an application with all of its dependencies into a container.

```zsh
git clone https://github.com/Greennav/GreenNav.git
cd GreenNav
```

#### Build
We will start by building a Docker image for the application (```Dockerfile``` contains the command-line instructions).

```
docker build -t greennav-web-interface .
```

##### Run
Finally we run the image as a container, making the web interface available at http://localhost:3000/.

```
docker run -d --rm -p 3000:3000 --name greennav-web-interface greennav-web-interface:latest
```


### Development

#### Git Workflow

- Please fork the repository
- Clone the webapp repository from your github account
```zsh
git clone https://github.com/$(GITHUB_USER)/GreenNav.git
```
- Create a new feature branch
```zsh
cd GreenNav
git checkout -b your-feature
```
- Make local changes and implement your feature
- Push your branch to GitHub
- Open a pull request

#### Code Quality

Please use eslint before contributing to the project.
Consider using an editor-plugin like [linter-eslint](https://atom.io/packages/linter-eslint) for Atom, [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for VS Code...


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
