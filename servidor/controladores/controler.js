let conexionbd = require('../lib/conexionbd');


peliculas =(req, res)=>{
    // res.send('Esto va a funcionar bien!');
    const consulta = "SELECT * FROM pelicula LIMIT 20";
    conexionbd.query(consulta, (err, result, fields)=>{
        if(err){
            console.log("Hubo un error en la consulta", err.menssage);
            return res.status(404).send("Erro en la consulta ",err);
        }else{
            let response = {peliculas : result}
            //res.send(JSON.stringify(result));
            res.send(response);
        }
    });
}

pelicula =(req, res)=>{
    let id = req.params.id
    const consulta = "SELECT * FROM pelicula WHERE id="+id;
    conexionbd.query(consulta, (err, result, fields)=>{
        if(err){
            console.log("Hubo un error en la consulta", err.menssage);
            return res.status(404).send("Erro en la consulta ",err);
        }
        if(result.length == 0){
            console.log("No se encontro ningún registro con ese id");
            return res.status(404).send("No se encontró ningún registro con es id");
        }else{
            res.send(JSON.stringify(result[0]));
        }
    });
}

generos =(req, res)=>{
    // res.send('Esto va a funcionar bien!');
    const consulta = "SELECT * FROM genero";
    conexionbd.query(consulta, (err, result, fields)=>{
        if(err){
            console.log("Hubo un error en la consulta", err.menssage);
            return res.status(404).send("Erro en la consulta ",err);
        }else{
            let response = {generos : result}
            //res.send(JSON.stringify(result));
            res.send(response);
        }
    });
}


module.exports={
    peliculas : peliculas,
    pelicula : pelicula,
    generos : generos
};