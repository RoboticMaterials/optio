function send_back() {
    // XML RPC to send the cart back to the origin
    movecart('Station 1')
    var text = 'Station 1'
    window.location.href = 'transit.html' + '#' + text
}