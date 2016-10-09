(function() {

  'use strict';

  /******************************************************************************/



  var currentExhibition;


  function getParentUrl() {
    var isInIframe = (parent !== window),
        parentUrl = window.location.href;

    if (isInIframe) {
        parentUrl = document.referrer;
    }
    return parentUrl;
  }

  function pieceLink (piece) {
    if (!piece.link) return false
    if ($.isArray(piece.link)) return piece.link[Math.floor(Math.random() * piece.link.length)]
    return piece.link
  }

  var artAdder = {
    replacedCount : '',
    processAdNode : function (elem) {
      var goodBye = false
      if (elem.tagName !== 'IFRAME'
          && elem.tagName !== 'IMG'
          && elem.tagName !== 'DIV'
          && elem.tagName !== 'OBJECT'
          && elem.tagName !== 'A'
          && elem.tagName !== 'INS'
          ) goodBye = true

      if ($(elem).data('replaced')) goodBye = true
      $(elem).data('replaced', true)
      if (goodBye) return

      //console.log(elem);

        var that = this,exhibition
    
        var origW = elem.offsetWidth
        var origH = elem.offsetHeight

        var $wrap = $('<div>').css({
          width: origW,
          height: origH,
          position : 'relative'
        })
      
        var sampleJson = {             
          "id": 1,
          "text": "This is sample text",
          "textSrc": "google.com",
          "imgSrc": "wikipedia.com"
        };

        var dankMeme = $('<a/>', {
          href : "http://dankmeme.website"
        });
        //dankMeme.href = 'http://dankmeme.website';

        var adImage = $('<img/>', {
          src : "https://s-media-cache-ak0.pinimg.com/236x/eb/5c/78/eb5c78657282a7c7715939aac4553dcb.jpg"
        }).appendTo(dankMeme);
        
        var sampleText = $('<p/>', {
          text : "Dank Memes"
        })
        .appendTo(dankMeme);
        
        $wrap.append(dankMeme)
        $(elem.parentElement).append($wrap)
        $(elem).remove()

      return true
    },
    getPieceI : function (){
      var topUrl = getParentUrl(),savedUrl,savedPieceI
      var d = Q.defer()
      artAdder.localGet('url')
      .then(function (url){
        savedUrl = url && url.url
        return artAdder.localGet('pieceI')
      })
      .then(function (pieceI) {
        savedPieceI = pieceI && pieceI.pieceI
        return artAdder.getExhibitionObj()
      })
      .then(function (ex){
        var pieceI = savedPieceI || 0
        if (!savedUrl) artAdder.localSet('url', topUrl)
        if (savedUrl === topUrl) return d.resolve(pieceI)

        // there's no pieceI - choose 0 
        if (!savedPieceI && savedPieceI !== 0) {
          artAdder.localSet('pieceI', pieceI)
          return d.resolve(pieceI)
        }

       // a new url
       pieceI++
       if (pieceI > ex.works.length - 1) {
         pieceI = 0
       }
       artAdder.localSet('url', topUrl)
       artAdder.localSet('pieceI', pieceI)
       return d.resolve(pieceI)
      }).done()
      return d.promise
    },
    exhibition : function (name) {
      return artAdder.setExhibition(name)
    },
    setExhibition : function (exhibition) {
      currentExhibition = Q(exhibition)
      artAdder.localSet('exhibitionUpdated', Date.now())
      return artAdder.localSet('exhibition', exhibition)
    },
    getExhibition : function () {
      if (currentExhibition) return currentExhibition
      var d = Q.defer()
      artAdder.localGet('exhibition')
      .then(function (exhibition) {
        currentExhibition = Q(exhibition.exhibition)
        d.resolve(exhibition.exhibition)
      })
      return d.promise
    },
    getExhibitionObj : function (){
      var exhibitions
      return artAdder.getAllExhibitions()
      .then(function (all){
        exhibitions = all
        return artAdder.getExhibition()
      })
      .then(function (title){
        return R.find(R.propEq('title', title), exhibitions)
      })
    },
    chooseMostRecentExhibition : function () {
      artAdder.localGet('defaultShowData')
      .then(function (feeds) {
        var latest = feeds.defaultShowData[0].title
        artAdder.exhibition(latest)
      })
    },
    getCustomExhibitions : function (){
      var d = Q.defer()
      artAdder.localGet('customExhibitions')
      .then( function (obj){
        var customExhibitions = obj['customExhibitions'] || []
        d.resolve(customExhibitions.filter(function (e){ return e  })) // get rid of blanks 
      })
      return d.promise
    },
    getAllExhibitions : function () {
      var d = Q.defer()
      var exhibs = []
      artAdder.localGet('defaultShowData')
      .then(function (obj){
        exhibs = R.map(artAdder.addPropToObj('addendum', true), exhibs.concat(obj.defaultShowData))
        return artAdder.getCustomExhibitions()
      })
      .then(function (customExhibitions){
        d.resolve(exhibs.concat(customExhibitions).sort(artAdder.exhibitionsSort)) 
      })
      .done()
      return d.promise
    },
    addExhibition : function (customExhibition){
      return artAdder.getCustomExhibitions()
      .then( function (customExhibitions){
        customExhibitions.push(customExhibition)
        customExhibitions = R.uniq(customExhibitions)
        return artAdder.localSet('customExhibitions', customExhibitions)
      })
    },
    // abstract storage for different browsers
    localSet : function (key, thing) {
      var d = Q.defer()
      if (typeof chrome !== 'undefined') {
        var save = {}
        save[key] = thing
        chrome.storage.local.set(save, d.resolve)
      }
      return d.promise
    },
    localGet : function (key) {
      var d = Q.defer()
      if (typeof chrome !== 'undefined') {
        chrome.storage.local.get(key, d.resolve)
      }
      return d.promise
    },
    fetchSelectorList : function () {
      $.ajax({
        url : 'https://easylist-downloads.adblockplus.org/easylist.txt',
        type : 'get',
        success : function (txt){
          var txtArr = txt.split("\n").reverse() 
          var selectors = txtArr 
                .filter(function (line) {
                  return /^##/.test(line)
                })
                .map(function (line) {
                  return line.replace(/^##/, '')
                })

          var whitelist = txtArr
                .filter(function (line){
                  return /^[a-z0-9]/.test(line) && !/##/.test(line)
                })
                .map(R.split('#@#'))
          artAdder.localSet('selectors', {
            selectors : selectors,
            whitelist : whitelist
          })
        }
      })
    },
    getSelectors : function () {
      return artAdder.localGet('selectors')
      .then(function (obj) {
        return obj.selectors
      })
    },
    formatDate : function (t){
      var dateObj = new Date(parseInt(t))
      var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
      var day = dateObj.getDate()
      var month = months[dateObj.getMonth()]
      var year = dateObj.getUTCFullYear()
      var date = month + ' ' + day + ', ' + year
      return date
    },
    verifyExhibition : function (exhib){
      return ['artist','description','title','thumbnail','works'].reduce(function (prev, curr){
        if (!prev) return prev
        return exhib[curr] !== undefined
      }, true)
    },
    exhibitionsSort : function (a,b) {
      if (a.date > b.date) return -1
      if (a.date < b.date) return 1
      return 0
    },
    addPropToObj : R.curry(function (prop, fn){
      return function (obj) {
        return R.set(R.lensProp(prop), typeof fn === 'function' ? fn(obj) : fn, R.clone(obj))
      }
    })

  }

  window.artAdder = artAdder
})();


