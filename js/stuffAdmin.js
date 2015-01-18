
$(document).ready(function () {

    var $container = $('.tilesContainer');
    // get Isotope instance
    var iso = $container.data('isotope');

    var startIndex;
    var endIndex;
    // Make the list sortable
    $container.sortable({
        cursor: 'move'
        //, tolerance: 'intersection'  //'pointer' is too janky
        , start: function(event, ui) {                        
            //add grabbing and moving classes as user has begun
            //REMOVE isotopey so that isotope does not try to sort our item,
            //resulting in the item moving around and flickering on 'change'
            ui.item.addClass('grabbing moving').removeClass('isotopey');
    
            ui.placeholder
              .addClass('starting') //adding the 'starting' class removes the transitions from the placeholder.
              //remove 'moving' class because if the user clicks on a tile they just moved,
              //the placeholder will have 'moving' class and it will mess with the transitions
              .removeClass('moving')
              //put placeholder directly below tile. 'starting' class ensures the
              //placeholder simply appears and does not 'fly' into place
              .css({
                  top: ui.originalPosition.top
                , left: ui.originalPosition.left
              })
            ;

            // get the current index of the item
            iso.$allAtoms.each(function (i, elem) {
                if ($(elem).is(ui.item)) {
                    startIndex = i;
                }
            });

            //reload the items in their current state to override any previous
            //sorting and to include placeholder, but do NOT call a re-layout
            $container.isotope('reloadItems');


            
        }                
    , change: function(event, ui) {
        //change only fires when the DOM is changed. the DOM changes when 
        //the placeholder moves up or down in the document order 
        //within the sortable container
    
        //remove 'starting' class so that placeholder can now move smoothly
        //with the interface
        ui.placeholder.removeClass('starting');
        //reload items to include the placeholder's new position in the DOM. 
        //then when you sort, everything around the placeholder moves as 
        //though the item were moving it.
        $container
          .isotope('reloadItems')
          .isotope({ sortBy: 'original-order'})
        ;
    }
    , beforeStop: function(event, ui) {
        //in this event, you still have access to the placeholder. this means
        //you know exactly where in the DOM you're going to place your element.
        //place it right next to the placeholder. jQuery UI Sortable removes the
        //placeholder for you after this event, and actually if you try to remove
        //it in this step it will throw an error.
        ui.placeholder.after(ui.item);                    
    }
    , stop: function(event, ui) {      
        //user has chosen their location! remove the 'grabbing' class, but don't
        //kill the 'moving' class right away. because the 'moving' class is 
        //preventing your item from having transitions, you should keep it on
        //until isotope is done moving everything around. it will "snap" into place
        //right where your placeholder was.
    
        //also, you must add the 'isotopey' class back to the box so that isotope
        //will again include your item in its sorting list
        ui.item.removeClass('grabbing').addClass('isotopey');


        //reload the items again so that your item is included in the DOM order
        //for isotope to do its final sort, which actually won't move anything
        //but ensure that your item is in the right place
        $container.isotope('reloadItems');



        // update the index of the items between the changes
        iso.$allAtoms.each(function (i, elem) {
            if ($(elem).is(ui.item)) {
                endIndex = i;
            }
        });
        console.log("end : " + endIndex);


        // get the farest index 
        var indexes = new Array();
      
        var start = startIndex >= endIndex ? endIndex : startIndex;
        var end = startIndex >= endIndex ? startIndex : endIndex;
        // get the items that need index update
        iso.$allAtoms.each(function (i, elem) {
            if (i >= start && i <= end) {
                indexes.push($(elem).scope().item.Index);
            }
                
        });
        var maxIndex = Math.max.apply(Math, indexes);
        if (!maxIndex)
            maxIndex = indexes.length;
        iso.$allAtoms.each(function (i, elem) {
            var $elem = $(elem);
            var scope = $elem.scope();
            if (i >= start && i <= end) {
                // update index 
                scope.item.Index = maxIndex--;
                scope.saveItem(scope.item);
            }

        });
        // apply the changes to the UI
        ui.item.scope().$apply();


        $container.isotope({ sortBy: 'original-order' }, function () {
              //finally, after sorting is done, take the 'moving' class off.
              //doing it here ensures that your item "snaps" and isn't resorted
              //from its original position. since this happens on callback,
              //if the user grabbed the tile again before callback is fired,
              //don't remove the moving class in mid-grab
             
              //for some reason in this code pen, the callback isn't firing predictably
              console.log(ui.item.is('.grabbing')); 
              if (!ui.item.is('.grabbing')) {
                  ui.item.removeClass('moving');                        
              }
          })
        ;
    }})


});

