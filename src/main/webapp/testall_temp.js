








    //Set sharable status of standing reservation from false to true
    TEST&_PASS:function(callback) {
    	query.setReservationShareable(ID, status, con, function(err, res){
		if(err)
			callback(null, false);
		else
			callback(null, res.message == "success");
	});
    },

    
        

    

   
     

