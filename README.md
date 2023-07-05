# Project Title

PAYEVER | BACK-END ASSIGNMENT

## Description

This project was developed as part of the back-end engineer position challenge proposed by Payever. It involves creating a simple REST application from scratch using Nest.js, Typescript, MongoDB, RabbitMQ, and communicating with an external API (https://cloud.mongodb.com/) witch is equivalent to use the external API.

## Table of Contents

1. [Getting Started](#getting-started)
   1. [Requirements](#requirements)
2. [Download and Installation](#download-and-installation)
3. [API Resources](#api-resources)
   1. [Endpoints](#endpoints)
4. [Automated Tests](#automated-tests)
5. [Technologies](#technologies)
6. [Acknowledgments](#acknowledgments)

## Getting Started

Follow the instructions below to get a copy of this project up and running on your local machine for testing and development purposes. It provides details about the necessary requirements and how to download and install the project.

### Requirements

To run this project locally, you need to have the following technologies installed on your machine:

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [RabbitMQ](https://www.rabbitmq.com/download.html)

PS.: If you prefer, you can use MongoDB Atlas instead of installing MongoDB locally. You can access MongoDB Atlas at https://www.mongodb.com/atlas/database.

## Download and Installation

To download and install this project, follow the steps below:

1. Make sure you have Git installed on your machine.
2. Open a terminal or command prompt and run the following command to clone the project:

   ```bash
   git clone https://github.com/vithorluc/payever-assignment.git
   ```

   Alternatively, if you have downloaded the project as a .zip file, extract the contents to a folder.

3. Modify the environment variables by creating a `.env` file based on the `.env.example` file provided. Follow the instructions in the `.env.example` file to set up your environment variables.

4. In the project's root directory, run the following command to install the project dependencies:

   ```bash
   npm install
   ```

5. To start the application in development mode, run the following command:

   ```bash
   npm run start:dev
   ```

   The application will run on port 3000, and you can start sending requests or running tests.

## API Resources

The following section describes the available API resources (endpoints) and their functionalities.

### Endpoints

- **POST /api/users**

  This endpoint creates a new user entry in the database. After the user is created, an email with a welcome message is sent to the user's email address, and a RabbitMQ event is triggered.

- **GET /api/user/{userId}**

  This endpoint retrieves data from an external API in my case was MONGODB ATHLAS API and returns a user in JSON representation with dummy information.

- **GET /api/user/{userId}/avatar**

  This endpoint retrieves an image from the `user.data`, which is initially a URL. Upon the first request, the image is stored in the file system with a generated hash as the file name and the `user.avatar` value. Subsequent requests retrieve the image from the file system.

- **DELETE /api/user/{userId}/avatar**

  This endpoint removes the image file from the file system storage and deletes the `user.avatar` entry in the database.

Note that the unit tests for the `users.service.ts` file methods are not yet implemented.

## Technologies

The main technologies used in this project are:

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Nest.js**: A progressive Node.js framework for building scalable and testable applications.
- **MongoDB**: A document-oriented database program.
- **Typescript**: A strongly typed programming language that builds on JavaScript.
- **RabbitMQ**: An open-source message-broker software.

## Acknowledgments

I would like to thank Payever and its representatives for providing me with this challenge and their support throughout the process. Although this project was not complex, working with some of the technologies was new to me, which required additional time for development.
