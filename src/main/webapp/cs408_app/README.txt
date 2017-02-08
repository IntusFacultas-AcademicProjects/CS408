Instructions on setting up backend:
1. You must have node and its dependencies loaded on you machine. Download here: https://nodejs.org/en/
2. In backend dir run command 'npm install'
3. Start backend by running command 'node start.js'


Responsibilities:
Both Micheal and Ben will reseach how to connect frontend to backend

Micheal:
	getAllRooms(day)
    	getRoomSchedule(room, week)
    	getRoomSchedule(room, day)
    	setRoomSchedule(room, day)
    
Ben:
	cancelReservation(room,user,day,time)
	getReservation(user)
	setBlockStatus(room,bool,user)
	authUser(user,pass)
	addUser(user,pass)
	
