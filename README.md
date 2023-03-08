# Ecoliday

## The App

Ecoliday has been developed to enable people to make a more environmentally informed decision when planning a holiday.

It provides users with estimated CO2e emissions for different destinations and vehicle types as well as suggesting local alternatives.

## Project Goal

In the last two weeks of the Makers Software Engineering Bootcamp, we were tasked to work in a team on a final project of our choosing with the goal to be able to answer "yes" to the week's primary question:

- Can you use high-quality processes to build an extended project in a team?

See full project details [here](https://github.com/makersacademy/course/tree/main/final_projects).

## Meet the Team:

- [Chris Hutchinson](https://github.com/ChrisHutchinson1982)
- [Graeme Paterson](https://github.com/ghpaterson)
- [Marina Papapetrou](https://github.com/marinapapap)
- [Robbie Kirkbride](https://github.com/rkirkbride13)
- [Thomas Seleiro](https://github.com/ThomasSel)

# Project/Learning Outcomes

### Planning and Project Management

- Mapped out the application as a set of user stories before writing any code.
- Applied Agile methodologies throughout the project, incrementally developing the App through a series of 2 day sprints.
- Identified and implemented Minimum Viable Product by Day 3.
- Implemented a successful workflow using a git.
- Maintained daily stand-up's and retro's to regularly check in on each other from a project and personal level.

See project [Trello](https://trello.com/b/xs11BMfE/ecoliday) and [Excalidraw](https://excalidraw.com/#room=f8bbdbcc91f237e3ef39,SqHFMgoQRtON_2ZdzQh5JA) boards.

### Distributon of work / Team work

Every member of the team:

- Worked on both the front-end and back-end
- Paired with each member of the team
- Made commits
- Can explain why any part of the application exists and how it works
- Felt like they made a good contribution to the overall success of the project
- Learned a lot and had fun!

### Quality of work

- Adopted Test Driven Design
- Adopted Pair Programmning
- Adopted Clean Code design principles
- Commit messages were clear and frequent

### Testing

- Used user stories as the basis for writing feature tests
- Unit and E2E tested all features
- Achieved over 90% coverage

# Set-up and Testing

## Installation

To download and initialise the project:

```js
$ git clone https://github.com/ThomasSel/Ecoliday.git
$ cd Ecoliday
$ cd frontend
$ npm install
$ cd ..
$ cd api
$ npm install
```

Register and get API keys for the following:

1. [Climatiq](https://auth.climatiq.io/login?state=hKFo2SBQSVRRNlJkOW9nOTBNaEZ4SE1WZEVRUTlCWnFQNFNPb6FupWxvZ2luo3RpZNkgdVBSa0J0LW1LZ3BzTVJlTWRBWlR6WVVnZ1Jwa0MtMESjY2lk2SB4YUZPelhha3M4TmRwdkRUdDVIQjZCSWJTd2dlNFFVQw&client=xaFOzXaks8NdpvDTt5HB6BIbSwge4QUC&protocol=oauth2&scope=openid%20profile%20email&response_type=code&redirect_uri=https%3A%2F%2Fapp.climatiq.io%2Fapi%2Fauth%2Fcallback&screen_hint=signup&nonce=rN62ZZVzYJhS5lDQKnAshqknTdrXR8g7vCtPuOROICY&code_challenge=GPwm8IRDgkORGUvNacYhGvWQGT-6gPYqN-Cv3fk85bo&code_challenge_method=S256)
2. [Geoapify](https://myprojects.geoapify.com/projects)
3. [Google Maps](https://developers.google.com/maps/documentation/distance-matrix/cloud-setup)

Create a new .env file in the api folder:

```js
$ cd api
$ touch  .env
```

Copy the below code into the .env file and update:

```js
# .env

CLIMATIQ_KEY = "add your API key here"
GEOAPIFY_KEY = "add your API key here"
GOOGLE_MAPS_KEY = "add your API key here"
JWT_SECRET = "add any random string here"
```

## Using the App

From the main project directory...

Start running the front-end server:

```js
$ cd frontend
$ npm run start
```

Open a new terminal and start running the back-end server:

```js
$ cd api
$ npm run start
```

Open http://localhost:3000 to view and use the Ecoliday app in your browser.

## Testing the App

From the main project directory...

### Front-end

```js
$ cd frontend
$ npm run test
```

**Important:** Ensure you are running both front-end and back-end servers before running the tests.

### Back-end

```js
$ cd api
$ npm run test
```

# Technologies

Here's an overview of the technologies used to build the application.

- **M** - MongoDB
- **E** - Express
- **R** - React
- **N** - Node

We also used...

- [Jest](https://jestjs.io/) for unit testing on the back-end.
- [Cypress](https://www.cypress.io/) for end-to-end testing and component testing, on the front-end.
- [Mongoose](https://mongoosejs.com) to model objects in MongoDB.
- [Prettier](https://prettier.io) for code formatting.
- [Tailwind](https://tailwindcss.com) and [DaisyUi](https://daisyui.com) for styling.
- [Nodemon](https://nodemon.io/) to reload the server automatically.
- [PostMan](https://www.postman.com) for testing http requests.

## Architecture

The application is comprised of two distinct pieces.

- A backend API built with Express
- A front end built with React

The React front end sends HTTP requests to the backend API.

### Api's

To calculate the emissions based on user selection, the back-end fetches information from the following Api's.

- [Geoapify - Geocoding API](https://www.geoapify.com/geocoding-api) finds the longitude and latitude information for selected destinations to enable distance calculation
- [Google Maps - Distance Matrix Api](https://developers.google.com/maps/documentation/distance-matrix) finds road and train routes and calculates distance
- [Climatiq Api](https://www.climatiq.io) calculates CO2e emissions for the Plane, Petrol Car, Electric Car and Train based on distance and number of passengers

# Screens

## Homepage

![Homepage](./images/Search.png)

## Emission Results with context

![Emissions](./images/Emissions.png)

## Login

![Login](./images/Login.png)

## Signup

![Signup](./images/Signup.png)

## Trips

![Trips](./images/Trips.png)
