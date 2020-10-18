Oye Application

Tech Stack :

Mongodb, Express, Node

Project Setup :

1. Clone the repo using git clone https://github.com/shubhamk1998/oyeassigment.git
2. npm install to install dependencies
3. node index.js to run the server
4. You can make use of Postman Json present With the code to test api and use default users

Key Terminologies:
Rider=Driver
User=Passenger

Architecture:

Application is built on top of Node And Nosql mongodb for supporting and faster scaling of application and we can also use microservices at later stage.


### Key Features:
Added token authentication to application to secure end point and prevent cross role access of api
Added Api's to signup and login user and driver

Db Approach and Assumptions:

Tables (Collections)

##Rides Model:
1. start : Starting Point(Constant for now)
2. end: Starting Point(Constant for now)
3. rrating: driver rating by user , null by default
4. urating: user rating by user , null by default
5. rider: driver key id
6. user : passenger key id


##Rider(Driver) Model:
1. name
2. mobile: Primary Key
3. password


##User(Passenger) Model:
1. name
2. mobile: Primary Key
3. password

Flow of Program:

User and driver signup using api.

User can request ride and by default for constant driver is picked

User can rate the ride

User can view ratings

Driver can rate the user

Driver can view ratings

Default Rating is 1 in case no rating is there.
