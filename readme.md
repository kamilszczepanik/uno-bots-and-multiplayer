# UNO

This is an implementation of multi-player UNO.

**Code**: <a href="https://github.com/kamilszczepanik/uno-bots-and-multiplayer" target="_blank">https://github.com/kamilszczepanik/uno-bots-and-multiplayer</a>  
**Year**: 2024/2025  
**Timespan**: 3 weeks  

## Overview

1. Project for studies with 3 main parts:
2. 1 - Class based UNO implementation in Typescript using Test Driven Development.
3. 2 - Frontend interface implemented in Vue for gameplay with bots.
4. 3 - Multiplayer

## Tech Stack

- • **Language**: Typescript
- • **Frameworks/Libraries**: Vue.js, Pinia, Zod, Vue Router, Web Sockets
- • **Styling**: Tailwind
- • **Other tools**: Vite, JWT

## Key Features

- • Uno full gameplay
- • Bots automation
- • Schema validation, error handling
- • User account creation and login
- • Multiplayer
- • Re-usable components
- • Design & implementation
- • Seeded data for smooth testing
- • Web Sockets for real-time update
- • Multiple games at once
- • Secured path for games


## Running the application

Get the project from github

```
git clone https://github.com/TomaszGrzesiak/WEB3_UNO
```

### Change branch

There are multiple assignments solved in this project, change branch to assignment-3

```
git checkout assignment-3
```

### Install

This is an npm project, so install first.

```
npm install
```

### Start the application

The application has four workspaces

1. pubsub - responsible for sending updates to the client.
2. server - responsible for getting game updates from the client. Uses pubsub to broadcast updates.
3. client - responsible for letting the user play a game.
4. models - object oriented game engine

You can start the entire application by running the following commands.

```
npm start --workspace=pubsub
npm start --workspace=server
npm start --workspace=client
```

They block, so you need to run them in three different terminals or start them in the background.

You can access the client on http://localhost:3000/
