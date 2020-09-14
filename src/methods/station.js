function load_stations() {
    // XML RPC request for cart waypoints
    console.log("hello")
    stations = get_cart_waypoints();
//     window.stations = ["Station 1", "Station 2", "Station 3", "Station 4", "Station 5", "down the street"];

//     if (stations.length > 0){
//         for (i = 0; i < stations.length; i++) {
//             var cloneDiv = $('#station_button').clone();
//             cloneDiv.attr("id", "station_button_" + [i]);
//             $('#station_button').before(cloneDiv);
//             $('#station_button_'+[i]).find('.button').text(stations[i]);
//             $('#station_button_'+[i]).find('.button').attr('onclick','go_to_station()');
//             $('#station_button_'+[i]).find('.button').attr('id',i);
//             $('#station_button_'+[i]).find('.button').removeClass('btn-success').addClass('btn-primary');
//         }   
//     } else {
//         alert('Make sure that Waypoints have been added')
//     }

}


function go_to_station() {
    var btn_clicked = stations[event.target.id];
    // XML Rpc request to send cart to location selected
    window.location.href = 'transit.html' + '#' + btn_clicked;
    
}