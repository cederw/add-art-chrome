jQuery(function ($){
  var howMany = 3
  var tried = 0
  artAdder.getSelectors()
  .then(function (obj){
    var selectors = obj.selectors
    var host = R.path(['location', 'host'],parent)
    var skips = []
    if (host) {
      skips = obj.whitelist
        .filter(R.pipe(R.nth(0), R.split(','), R.contains(host.replace('www.', ''))))
        .map(R.nth(1))
    }
    ;(function checkIFrames() {
      var elem;
      var ratio = 0; //h/w
      
      var found = $(selectors.join(',')).each(function (){
        var $this = $(this)
        var successfulSkips = skips.filter(function (sel){
                                      return $this.is(sel)
                                    })
        if (successfulSkips.length > 0) {
          return
        }
        var origW = elem.offsetWidth;
        var origH = elem.offsetHeight;
        if(Math.abs(origW/origH - 0.75) < Math.abs(ratio - 0.75)){

        }
        //artAdder.processAdNode(this)
      })

      artAdder.processAdNode(elem);
      if (++tried < howMany) {
        setTimeout(checkIFrames, 3000)
      }
    })()
  })
})
