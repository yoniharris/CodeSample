#!/bin/bash 

## All code by Yoni Harris

## Main functions for in/out movements of bats in colony ##

cd /
cd opt/cdm

# Reader 102 (192.168.0.205) - inside reader
function reader_102 () {

# Saves all action history in log file (> clears the txt file first)
> logs/log_102.txt
LOG_102=logs/log_102.txt
#exec > >(tee -a ${LOG_102} )
#exec 2> >(tee -a ${LOG_102} >&2)

	while  true ; do

		# set date and hour		
		current_date=$(date +%d-%m-%y)
		filename=$current_date
		hour=$(date +%H)
		min=$(date +%M)

		printf "\n 		Run inside UHF reader (102)\n"
		
		# Check time and start system if night between 17:00 pm - 07:00 am (next day)
		
		if [ "$hour" -lt 24 -a "$hour" -ge 17 ] ||  [ "$hour" -lt 07 -a "$hour" -ge 00 ]; then
   			# run for the 14 hours (50400 seconds) 
			sudo timeout 50400 ./MonsoonReader --serial_host 192.168.0.205 --serial_port 10002 --cmux --mxa 2 --read_time_ms 1000 --sleep 0 --csv bat_data/$filename.csv
		else
			printf "\n Time is $hour:$min - Readers are shut down. \n"
			echo " System hours: 17:00 PM - 07:00 AM "
			sleep 60s
		fi

	done
exit
}
