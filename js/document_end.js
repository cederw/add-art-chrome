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
      var ratio = 100;

      var found = $(selectors.join(',')).each(function (){
        console.log("looping");
        var $this = $(this)
        var successfulSkips = skips.filter(function (sel){
                                      return $this.is(sel)
                                    })
        if (successfulSkips.length > 0) {
          return
        }
      var origW = this.offsetWidth;
      var origH = this.offsetHeight;
      console.log("width" + origW + "he"+ origH);
      if(origH>200 && (Math.abs(origW/origH - 0.8) < Math.abs(ratio-0.8))){
        console.log("passed the if");
        elem = this;
        ratio = origW/origH;
      }
        //artAdder.processAdNode(this);
      })

      artAdder.processAdNode(elem);

      chrome.storage.sync.get({
        ads: 0

      }, function(items) {
        chrome.storage.sync.set({
          ads: items.ads+1
        }, function() {
         
        });
      });

      if (++tried < howMany) {
        setTimeout(checkIFrames, 3000)
      }
    })()
  })
})
