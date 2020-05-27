// ## All code by Yoni Harris ##

// Description: The script populates ID of each UHF inlay placed by 
// the user and sends to client API to recieve info regarding the item
// and displayes on frontend. 

$(document).ready(function(){

  // variables
  var socket = io.connect();
  var zone;
  var isZoneSet = false
  var isCatalogOpen = true
  var liveCardBarcode = []
  var zoneItemCount = 0
  var urlCatalog = `https://www.joolme.co.il/tablet`

  // Populate form
  populateForm(socket)

  // show modal
  $(".urlIframe").hide();
  $('#setZoneModal').modal('show')

  // set zone
  $('#setZoneButton').click(function() {
    zone = $('.zone').val()

    // load url main catalog
    socket.emit('get live')
    $('.urlIframe').prop('src', `${urlCatalog}`)
    $(".urlIframe").show();
    isZoneSet = true
    isCatalogOpen = true
  });

  socket.on(`update live data`, function (data) {
    if (isZoneSet == true){

      var currentZoneItemCount = 0
      // check if items add on spesific zone
      for (var k=0; k<data.live.length;k++){
        if(data.live[k].zone_id == zone){
          currentZoneItemCount++
        } // end if item in zone
      } // end loop get live items

      console.log(currentZoneItemCount)
      // if items have changed on display
      if (zoneItemCount != currentZoneItemCount){
        // initialize url
        var itemUrlOpen = `https://www.joolme.co.il/tablet/?ringList=`

        for (var i=0; i<data.live.length;i++){
          if(data.live[i].zone_id == zone){

            // add to url every item barcode
            itemUrlOpen += `${data.live[i].barcode},`

          } // end if item in zone
        } // end loop get live items

        // set zoneItemCount to amount on zone display
        zoneItemCount = currentZoneItemCount

        // send to url with paramiters
        console.log('sent url: '+itemUrlOpen)
        $('.urlIframe').prop('src', `${itemUrlOpen}`)
        $('#urlModal').modal('show').fadeIn("normal")

        if (zoneItemCount == 0){ isCatalogOpen = false }

      } // end if item in zone

      // check if NO items are on display
      if (isCatalogOpen == false){
        console.log('sent url: '+urlCatalog)
        // send to url with paramiters
        $('.urlIframe').prop('src', `${urlCatalog}`)
        $('#urlModal').modal('show').fadeIn("normal")
        isCatalogOpen = true
      }
