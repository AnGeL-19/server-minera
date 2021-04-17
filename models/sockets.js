const Marcadores = require('./marcadores');
const Sonas = require('./sonas');

class Sockets {

    constructor( io ) {

        this.io = io;

        this.marcadores = new Marcadores();

        this.sonas =  new Sonas();

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', ( socket ) => {

            console.log("Cliente conectado");

            socket.emit( 'marcadores-activos' , this.marcadores.activos );

            socket.emit( 'sonas-activas' , this.sonas.activos ); // enviamos las sonas guardadas
            // pero truena en addLayer no se por que xd

            socket.on( 'marcador-nuevo', ( marcador ) => {  // { id, lng, lat }
                this.marcadores.agregarMarcador( marcador );
                
                socket.broadcast.emit( 'marcador-nuevo', marcador )
            });


            socket.on( 'marcador-actualizado', (marcador) => {
                this.marcadores.actualizarMarcador( marcador );
                socket.broadcast.emit( 'marcador-actualizado', marcador );
            });
            
        
            socket.on('sona-nueva', (sona) => {
                if (!(sona.type === null || sona.type === undefined || !sona.type)) {
                    this.sonas.agregarSona(sona);
                    console.log(this.sonas, "sonasss");
                    console.log(sona," desde sk");
                    socket.broadcast.emit( 'sona-nueva', sona );
                }
 
            });
        });
    }


}


module.exports = Sockets;