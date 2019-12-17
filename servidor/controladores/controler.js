let conexionbd = require('../lib/conexionbd');

peliculas =(req, res)=>{
    // res.send('Esto va a funcionar bien!');
    const consulta = "SELECT * FROM pelicula";
    conexionbd.query(consulta, (err, result)=>{
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    });
}


module.exports={
    peliculas:peliculas
};