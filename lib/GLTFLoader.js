/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

THREE.GLTFLoader = function ( manager ) {
    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
};

THREE.GLTFLoader.prototype = {
    constructor: THREE.GLTFLoader,

    load: function ( url, onLoad, onProgress, onError ) {
        const scope = this;
        const loader = new THREE.FileLoader( this.manager );
        loader.setResponseType( 'arraybuffer' );
        loader.load( url, function ( data ) {
            try {
                scope.parse( data, onLoad );
            } catch ( e ) {
                if ( onError ) {
                    onError( e );
                } else {
                    console.error( e );
                }
                scope.manager.itemError( url );
            }
        }, onProgress, onError );
    },

    parse: function ( data, onLoad ) {
        const content = new TextDecoder().decode( data );
        onLoad( { scene: new THREE.Scene() } ); // Минимальный заглушечный объект сцены
    }
};