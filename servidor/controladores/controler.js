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
    let campos = " id, titulo, duracion, director, anio, fecha_lanzamiento, puntuacion, poster, trama, genero_id";
    // let todosLosCampos = " *";
    //let consulta = "SELECT";
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
            //console.log(condition);
        });
        condicion += " WHERE "+sumaFiltro;
        console.log("Consulta con WERE : "+condicion); 
    }

    if(columna_orden!== undefined && tipo_orden!== undefined){
        condicion += " ORDER BY "+columna_orden+" "+tipo_orden;
        console.log("columna orden");
    }
    if(pagina!== undefined && cantidad!== undefined){
        limite =" LIMIT "+((pagina-1)*cantidad)+", "+cantidad;
        //condicion +=" "+limite;
        console.log("Pagina: "+pagina);
        console.log("Condicion: "+condicion);
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
            total= result[0].total
            // console.log("total: "+total);
        }
    });
    
     
    // console.log("Consulta total Registro: "+consultaTotalRegistro+";");
    //console.log("Consulta con condición: "+consulta+condicion+";");

    conexionbd.query(consulta+condicion+limite+";", (err, result, fields)=>{
        if(err){
            console.log("Hubo un error en la consulta", err);
            return res.status(404).send("Erro en la consulta ",err);
        }else{
            // var cont = 0;
            // result.forEach((value)=>{console.log(value.titulo);cont++;});
            // console.log(cont);
            let response = {
                peliculas : result,
                total : total//cantidad*Math.ceil(total / cantidad)
            }
            res.send(response);
        }
    });
}

pelicula =(req, res)=>{
    let id = req.params.id
    let query = "SELECT * FROM pelicula WHERE id="+id;
    conexionbd.query(query+";", (err, result, fields)=>{
        if(err){
            console.log("Hubo un error en la consulta", err.menssage);
            return res.status(404).send("Error en la consulta ",err);
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