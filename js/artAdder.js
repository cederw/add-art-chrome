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



  var artAdder = {
    replacedCount : '',
    processAdNode : function (elem) {
      var goodBye = false;
      if (elem.tagName !== 'IFRAME'
            && elem.tagName !== 'IMG'
            && elem.tagName !== 'DIV'
            && elem.tagName !== 'OBJECT'
            && elem.tagName !== 'A'
            && elem.tagName !== 'INS'
            ) {
          goodBye = true;
      }

      if ($(elem).data('replaced')) {
        goodBye = true;
      }
      $(elem).data('replaced', true);
      if (goodBye)  {
        return;
      }

      var origW = elem.offsetWidth;
      var origH = elem.offsetHeight;

      var $wrap = $('<div>').css({
        width: origW,
        height: origH,
        position : 'relative'
      })
  
      var zooAd = $("<div/>")
        .addClass("adContainer")
        .css({
          width: origW,
          //height: origH,
          cursor: "pointer",
          border: "1px rgba(0,0,0,0.70) solid",
          "border-radius" : "0.25rem"
        })
        .click(function() {
          window.open("http://dankmeme.website", "_blank");
        });

      var textDiv;;
      var textContent;
      var textSrc;

      var sponsorDiv = $("<div/>").css({
          "padding-right" : "0.75em"
        });

      var sponsorFormat = $('<p/>')
        .css({
          color: "rgba(0,0,0,0.30)",
          "margin-top": 18,
          "margin-bottom" : 7
        });

      var sponsorText = $("<p/>", {
          text: "Microsoft"
        }).css({
            color: "rgba(0,0,0,0.50)",
            "margin-bottom" : 18
        });

      var adType = "Text";
      switch(adType) {
        case "Basic Text" : {
          sponsorDiv.css({
            "text-align" : "center"
          });

          sponsorFormat
            .text("Thank you,")
            .css({
              fontSize : 18
            });
          
          sponsorText.css({
            fontSize : 24
          });
          break;
        }

        case "Text" : {
          textDiv = $("<div/>")
            .css({
              "text-align" : "right",
              "padding-top" : "1em"
            })
            .appendTo(zooAd);
          
          textContent = $("<p/>")
            .text('"An elephant dies every 15 minutes"')
            .css({
              fontSize : 30,
              color: "rgba(0,0,0,0.60)",
            })
            .appendTo(textDiv);

          textSrc = $("<p/>")
            .text("Wildheart Wildlife Foundation")
            .css({
              fontSize : 16,
              color: "rgba(0,0,0,0.40)",
            })
            .appendTo(textDiv);

          sponsorDiv.css({
            "text-align" : "right"
          });

          sponsorFormat
            .text("ad made possible by,")
            .css({
              fontSize : 14
            });

          sponsorText.css({
            fontSize : 16
          });
          break;
        }

        default: {
          var adText = $('<p/>', {
                text : "Dank Memes"
              })
              .appendTo(zooAd);

            var adTextSrc = $('<p/>', {
                text : "Wildheart Wildlife Foundation"
              })
              .appendTo(zooAd);

          var adImage = $('<img/>', {
              src : "https://s-media-cache-ak0.pinimg.com/236x/eb/5c/78/eb5c78657282a7c7715939aac4553dcb.jpg"
            })
            .width(origW)
            .height(origH - 75)
            .appendTo(zooAd);
            break;
        }
      }
      
      sponsorFormat.appendTo(sponsorDiv);
      sponsorText.appendTo(sponsorDiv);
      sponsorDiv.appendTo(zooAd)

      $wrap.append(zooAd);
      $(elem.parentElement).append($wrap);
      $(elem).remove();

      return true;
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
    }

  }

  window.artAdder = artAdder
})();


