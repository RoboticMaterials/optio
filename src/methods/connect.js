// function connect2() {
//     document.getElementById("connection_check").style.display = "block";
    
//     stop_it()
//     function stop_it() {
//         console.log("Stopping it");
//         stop();
//         console.log("stopped");
//     }
//     init();
//     window.refresh = setInterval(test_init, 3000)
// }

async function connect() {
    document.getElementById("connection_check").style.display = "block";
    
    stop_it()
    function stop_it() {
        console.log("Stopping it");
        stop();
        console.log("stopped");
    }
    init();
    var didConnect = await test_server();
    while(!didConnect) {
        try{
            await sleep(3000);
            didConnect = await test_server();
        }
        catch(err) {
            console.log(err)
        }
    }
    test_init2()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// function test_init() {
//     try {
//         console.log('testing server')
//         test_server();
//         connection_to_server();
//         clearInterval(refresh)
//     }
//     catch(error) {
//         console.log("RM server not running")
//     }
// }

function test_init2() {
    try {
        console.log('testing server')
        connection_to_server();
    }
    catch(error) {
        console.log("RM server not running")
    }
}

function connection_to_server() {
    jQuery('#init').removeClass('fas fa-circle-notch fa-spin').addClass('far fa-check-circle');
    connect_to_hand()
}


function connect_to_hand() {
    var smart = has_hand();
    console.log('trying to connect to the hand')
    jQuery('#smart').removeClass('fas fa-circle-notch fa-spin').addClass('far fa-check-circle');
    connect_to_arm()
}


function connect_to_arm() {
    jQuery('#robot').removeClass('fas fa-circle-notch fa-spin').addClass('far fa-check-circle');
    connect_to_cart()
}


function connect_to_cart() {
    var cart = has_cart();
    jQuery('#cart').removeClass('fas fa-circle-notch fa-spin').addClass('far fa-check-circle');
    all_connected()
}

function all_connected() {
   // This will load to the next page when both are true 
    window.location.href = 'station.html'; //Need to fix where this location is pointing
} 

