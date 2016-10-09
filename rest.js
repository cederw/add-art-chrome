function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get('/getData', function(req, res) {
        var sql = 'CALL getData(?, ?)';
        var params = [req.query.category, req.query.type]
        connection.query(sql, params, function(err, results) {
            console.log(results);
            if(!err) {
                res.json(results);
            }
        });
    });
}

module.exports = REST_ROUTER;