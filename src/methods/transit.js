function load_transit(){
    var arrived = false//XML RPC Request
    var station = window.location.hash.substring(1).replace(/%20/g, ' ');

    $('#route_info').text("Going to " + station);

    cart_arrived()
    function cart_arrived () {
        movecart(station);
    }


    // function check_arrival() {
    //     if (arrived = false) {
    //         setTimeout(check_arrival, 500); // Will loop every .5 seconds until the cart is arrived
    //     }
    // }
    window.location.href = 'drop.html';
}

function stop_cart(){
    
    // Might have to stop load_transit function

    arrived = true;
    pause_cart();
    clear_queue();
    window.location.href = 'station.html'
}