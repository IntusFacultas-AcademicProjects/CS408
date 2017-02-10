add unit tests here

usernameExists

emailExists

addAccount

authAccount

deleteAccount

getAllRooms

getRoomSchedule

addReservation

cancelReservation



Tests:

Wipe test_reservations and test_users database

addAccount - legitimate - good
addAccount - legit name, bad pass - fail
addAccount - bad name, good pass - fail
addAccount - bad name, bad pass - fail

usernameExists - name from first attempt - true
usernameExists - name from second - false

emailExists - email from first attempt - true
emailExists - email from second - false

authAccount - first user - good
authAccount - second - fail

addReservation - room1, firstName, today, 0800, 0900, sharable - success
addReservation - room1, firstName, today, 1000, 1500, sharable - success
addReservation - room1, firstName, today, 0830, 0930, sharable - failure: overlap

addReservation - room1, firstName, firstEmail, 1600, 1700, sharable - failure: too many hours

getRoomSchedule - room1, today - returns 2 reservations and compare to original times
getAllRooms - today - returns 2 reservations
getAllRooms - tomorrow - returns 0 reservations

cancelReservation - first reservation - success
cancelReservation - second reservation - success
cancelReservation - nonexistent reservation - failure

addReservation - room1, firstName, today, 0800, 0900, sharable - success
addReservation - room1, firstName, tomorrow, 0800, 0900, sharable - success

getRoomSchedule - room1, today - return 1 reservation
getRoomSchedule - room1, tomorrow - return 0 reservations
getRoomSchedule - room1, today - return 0 reservation
getRoomSchedule - room1, tomorrow - return 1 reservations

getAllRooms - today - returns 1 reservation
getAllRooms - tomorrow - returns 1 reservation