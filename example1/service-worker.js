let headers = new Headers();
headers.append( 'cache-control', 'no-cache' );
headers.append( 'pragma', 'no-cache' );
 
let offlineResponse = new Response( '<div><h2>Uh oh that did not work</h2></div>', {
    headers: {
        'Content-type': 'text/html'
    }
} );
 
self.addEventListener( 'install', function ( installevent ) {
    installevent.waitUntil(
        caches.open( 'myCache' )
        .then( cache => {
            return cache.addAll( [ 'offline.html' ] )
        } )
        .then( success => {
            console.log( "Success! Installed myCache" );
        } )
    )
} );
 
self.addEventListener( "activate", function ( activateevent ) {
    //Do Nothing
} );
 
self.addEventListener( 'fetch', ( event ) => {
    var req = new Request( 'index.html', {
        method: 'GET',
        mode: 'same-origin',
        headers: headers,
        redirect: 'manual' // let browser handle redirects
    } );
    event.respondWith( fetch( req, {
            cache: 'no-store'
        } )
        .then( function ( response ) {
            return fetch( event.request )
        } )
        .catch( function ( err ) {
            return caches.open( 'myCache' )
                .then( cache => {
                    return cache.match( 'offline.html' )
                        .then( cache_hit => {
                            let cache_miss = offlineResponse;
                            return ( cache_hit ? cache_hit : cache_miss );
                        } )
                } )
        } ) )
} );