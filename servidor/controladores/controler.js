let conexionbd = require('../lib/conexionbd');


peliculas =(req, res)=>{
    let titulo = req.query.titulo;
    let anio = req.query.anio;
    let genero = req.query.genero;
    let columna_orden = req.query.columna_orden;
    let tipo_orden = req.query.tipo_orden;
    let cantidad = req.query.cantidad;
    let pagina = req.query.pagina;

    let filtros = [];
    let consulta = "SELECT * FROM pelicula ";
    let limite ="LIMIT "+pagina+","+cantidad;

    if(titulo!== undefined){filtros.push("titulo LIKE '%" + titulo + "%'");}
    if(anio!== undefined){filtros.push("anio = " + anio);}
    if(genero!== undefined){filtros.push("genero_id = " + genero);}
    let concat ="";

    if(filtros.length > 0 ){
        filtros.forEach(function(filtro, pos){
            concat+=filtro+" ";
            if(pos < filtros.length-1){
                concat+="AND ";
            }            
            //console.log(concat);
        });
        consulta += "WHERE "+concat;
        console.log(consulta); 
    }

    // if(true){
    //     //consulta+=" ORDER BY "+columna_ordern+" "+tipo_orden;
    //     console.log(" ORDER BY "+columna_ordern+" "+tipo_orden);
    // }
    consulta += " ORDER BY "+columna_orden+" "+tipo_orden+" "+limite;
    console.log(pagina);
    conexionbd.query(consulta+";", (err, result, fields)=>{
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