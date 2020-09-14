export const getAccessToken = () => {

}

export const getRefreshToken = async () => {

    const name = 'rmStudioRefreshToken='
    
    const decodedCookie = decodeURIComponent(document.cookie)

    // Finds the tokens in cookies
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];

        // Skips all blank characters
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        // Sees if the current cookies string has rmStudioRefreshToken= at index 0, if it does thats the cookie we want
        if (c.indexOf(name) == 0) {
            // Takes the substring starting at the end of rmStudioRefreshToken= to the total length of the string
            const token = c.substring(name.length, c.length);
            return token;
        }
    }

    // Throw an error if the cookie cannot be found
    throw 'No Refresh Token';
}

export const postRefreshToken = async (token) => {

    const d = new Date();
    // Converts 30 days to hours, then minutes, then seconds and then times 1000
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));

    const expiration = 'expires=' + d.toUTCString();

    // Adds the token to cookies
    document.cookie = 'rmStudioRefreshToken=' + token + ';' + expiration + ';path=/'
}