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
    let condition ="";

    if(filtros.length > 0 ){
        filtros.forEach(function(filtro, pos){
            condition+=filtro+" ";
            if(pos < filtros.length-1){
                condition+="AND ";
            }            
            //console.log(condition);
        });
        consulta += "WHERE "+condition;
        console.log(consulta); 
    }

    consulta += " ORDER BY "+columna_orden+" "+tipo_orden+" "+limite;
    console.log("Pagina: "+pagina);
    conexionbd.query(consulta+";", (err, result, fields)=>{
        if(err){
            console.log("Hubo un error en la consulta", err.menssage);
            return res.status(404).send("Erro en la consulta ",err);
        }else{
            console.table(result.length);
            // console.log("Fields: "+fields[0]);
            let response = {
                peliculas : result,
                total : result.length
            }
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