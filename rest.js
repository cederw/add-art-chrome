function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get('/getData', function(req, res) {
    	var sql = 'Select * FROM ad';
    	connection.query(sql, function(err, results) {
    		if (results.RowDataPacket = null) {
    			res.json({"Error" : "Error Receiving Response"});
    		} else {
    			res.json(results);
    		}
    	});
    });
}

module.exports = REST_ROUTER;