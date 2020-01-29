let conexionbd = require('../lib/conexionbd');


peliculas =(req, res)=>{
    let titulo = req.query.titulo;
    let anio = req.query.anio;
    let genero = req.query.genero;
    let columna_orden = req.query.columna_orden;
    let tipo_orden = req.query.tipo_orden;
    let cantidad = req.query.cantidad;
    let pagina = req.query.pagina;
    let totalPeliculas;
    let limite="";
    let filtros = [];
    let pedir = "SELECT";
    let totalRegistro=" COUNT(*) AS total";
    let deTabla =" FROM pelicula";
    let consulta = pedir+" *"+deTabla;
    let condicion = "";   

    if(titulo!== undefined){filtros.push("titulo LIKE '%" + titulo + "%'");}
    if(anio!== undefined){filtros.push("anio = " + anio);}
    if(genero!== undefined){filtros.push("genero_id = " + genero);}
    let sumaFiltro ="";

    if(filtros.length > 0 ){
        filtros.forEach(function(filtro, pos){
            sumaFiltro+=filtro+" ";
            if(pos < filtros.length-1){
                sumaFiltro+="AND ";
            } 
        });
        condicion += " WHERE "+sumaFiltro;
        console.log("Consulta con WERE : "+condicion); 
    }

    if(columna_orden!== undefined && tipo_orden!== undefined){
        condicion += " ORDER BY "+columna_orden+" "+tipo_orden;
    }

    if(pagina!== undefined && cantidad!== undefined){
        limite =" LIMIT "+((pagina-1)*cantidad)+", "+cantidad;
    }

    // guarda una consulta que devuelve el numero total de registros según condiciones de filtros seleccionados
    // esto hace que se pueda mostrar de forma dinámica la cantidad de páginas que se necesita para mostrar
    // el resultado todal de la consulta
    let consultaTotalRegistro = pedir+totalRegistro+deTabla+condicion;
    conexionbd.query(consultaTotalRegistro+";", (err, result, fields)=>{
        if(err){
            console.log("Hubo un error en la consulta de count", err);
            return res.status(404).send("Error en la consulta de count ",err);
        }else{ 
            totalPeliculas= result[0].total
        }
    });
    
    // console.log("Consulta con condición: "+consulta+condicion+limite+";");

    conexionbd.query(consulta+condicion+limite+";", (err, result, fields)=>{
        if(err){
            console.log("Hubo un error en la consulta", err);
            return res.status(404).send("Erro en la consulta ",err);
        }else{
            var cont = 0;
            result.forEach((value)=>{console.log(value.titulo+" , puntaje: "+value.puntuacion+", "+value.anio);cont++;});
            console.log(cont);
            let response = {
                peliculas : result,
                total : totalPeliculas
            }
            res.send(response);
        }
    });
}

pelicula =(req, res)=>{
    let id = req.params.id
    // Esta consulta está definida así para diferenciar en la respuesta a la columna nombre de la tabla actor
    // de la columna nombre de la tabla genero
    let query=  "SELECT p.*, g.nombre As genero, a.nombre FROM pelicula AS p JOIN genero AS g ON p.genero_id = g.id JOIN actor_pelicula AS a_p ON a_p.pelicula_id = p.id JOIN actor AS a ON a_p.actor_id = a.id WHERE p.id ="+id;

    conexionbd.query(query+";", (err, result, fields)=>{
        if(err){
            console.log("Hubo un error en la consulta", err.menssage);
            return res.status(404).send("Error en la consulta ",err);
        }
        if(result.length == 0){
            console.log("No se encontro ningún registro con ese id");
            return res.status(404).send("No se encontró ningún registro con es id");
        }else{
            console.log(query);
            var data = result[0];

            let response = {
                pelicula : {
                    titulo : data.titulo,
                    anio : data.anio,
                    puntuacion : data.puntuacion,
                    duracion : data.duracion,
                    trama : data.trama,
                    poster : data.poster,
                    fecha_lanzamiento : data.fecha_lanzamiento,
                    director : data.director,
                    nombre : data.genero
                    
                },
                actores : result     
            }
            res.send(response);
        }
    });
}

recomendacion =(req, res)=>{
    let filtros= [];
    let genero = req.query.genero;
    let anio_inicio = req.query.anio_inicio;
    let anio_fin = req.query.anio_fin;
    let puntaje = req.query.puntaje;

    let sql = "SELECT * FROM pelicula AS p JOIN genero AS g ON g.id = p.genero_id";

    if(genero!== undefined){filtros.push("g.nombre = '" + genero+"'");}
    if(anio_inicio!== undefined){filtros.push("anio >= " + anio_inicio);}
    if(anio_fin!== undefined){filtros.push("anio <= " + anio_fin);}
    if(puntaje!== undefined){filtros.push("puntaje >= " + puntaje);}

    let sumaFiltro ="";
    if(filtros.length > 0 ){
        filtros.forEach(function(filtro, pos){
            sumaFiltro+=filtro+" ";
            if(pos < filtros.length-1){
                sumaFiltro+="AND ";
            } 
        });
        sql += " WHERE "+sumaFiltro;
    }
    console.log(sql);
    conexionbd.query(sql+";", (err, result)=>{
        if(err){
            console.log("Hubo un error en la consulta", err.menssage);
            return res.status(404).send("Erro en la consulta ",err);
        }else{
            let response = {peliculas : result}        
            res.send(response);
        }
    });
}

generos =(req, res)=>{
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
    generos : generos,
    recomendacion : recomendacion
};