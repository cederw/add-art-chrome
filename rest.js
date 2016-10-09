function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get('/getData', function(req, res) {
        var sql = 'CALL getData(?, ?)';
        var params = [req.query.category, req.query.type]
        connection.query(sql, params, function(err, results) {
            if(!err) {
                res.json(results);
            }
        });
    });

    router.post('/addData', function(req, res) {
        var sql = 'INSERT INTO ad(??, ??, ??) Values(?, ?, ?)';
        var params = ['text', 'textSrc', 'imageSrc', req.query.text, req.query.textSrc, req.query.imageSrc];
        connection.query(sql, params, function(err, results) {
            if(!err) {
                res.json({ 'Result': 'Data Successfully Added' });
            }
        });
    });

    router.get('/getAdID', function(req, res) {
        var sql = 'CALL getIDFromText(?)';
        var params = [req.query.text]
        connection.query(sql, params, function(err, results) {
            if(!err) {
                res.json(results);
            }
        });
    });

    router.get('/getCategoryID', function(req, res) {
        var sql = 'CALL getIDfromCategory(?)';
        var params = [req.query.category]
        connection.query(sql, params, function(err, results) {
            if(!err) {
                res.json(results);
            }
        });
    });

    router.get('/getTypeID', function(req, res) {
        var sql = 'CALL getIDfromType(?)';
        var params = [req.query.type]
        connection.query(sql, params, function(err, results) {
            if(!err) {
                res.json(results);
            }
        });
    });

    router.post('/linkCategory', function(req, res) {
        var sql = 'CALL linkCategory(?, ?)';
        var params = [req.query.categoryID, req.query.adID];
        connection.query(sql, params, function(err, results) {
            if(!err) {
                res.json({ 'Result': 'Data Successfully Added' });
            }
        });
    });

    router.post('/linkType', function(req, res) {
        var sql = 'CALL linkType(?, ?)';
        var params = [req.query.adID, req.query.typeID];
        connection.query(sql, params, function(err, results) {
            if(!err) {
                res.json({ 'Result': 'Data Successfully Added' });
            }
        });
    });

    router.get('/getSponsor', function(req, res) {
        var sql = 'CALL getRandomSponsors';
        connection.query(sql, function(err, results) {
            if(!err) {
                res.json(results);
            }
        });
    })
}

module.exports = REST_ROUTER;