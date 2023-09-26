/*
Productos en Inventario - TREJO AGUIÑAGA ELIANE DANAE
ID (entero autoincremental)
Nombre del producto (cadena de texto)
Cantidad en stock (entero)
Precio de compra (decimal)
Precio de venta (decimal)
*/
const express = require('express');
const app = express();
const puerto = process.env.PORT || 3000;

app.use(express.json());

//Arreglo de objeto de productos
let productos = [
    {id: 1, nombre: "Cuaderno", cantidad: 5, precioCompra: 35.99, precioVenta: 55.99},
    {id: 2, nombre: "Lapicera", cantidad: 7, precioCompra: 12.99, precioVenta: 34.99},
    {id: 3, nombre: "Goma de borrar", cantidad: 10, precioCompra: 2.49, precioVenta: 5.99},
    {id: 4, nombre: "Regla", cantidad: 3, precioCompra: 4.99, precioVenta: 8.99},
    {id: 5, nombre: "Tijeras", cantidad: 2, precioCompra: 7.99, precioVenta: 12.99},
    {id: 6, nombre: "Calculadora", cantidad: 4, precioCompra: 19.99, precioVenta: 29.99},
    {id: 7, nombre: "Cinta adhesiva", cantidad: 8, precioCompra: 1.99, precioVenta: 4.99},
    {id: 8, nombre: "Marcadores", cantidad: 6, precioCompra: 9.99, precioVenta: 17.99},
    {id: 9, nombre: "Papel de carta", cantidad: 15, precioCompra: 6.49, precioVenta: 12.99},
    {id: 10, nombre: "Borrador de pizarra", cantidad: 5, precioCompra: 3.99, precioVenta: 7.99}    
];

app.get('/socios/v1/productos', (req,res)=>{
    if (productos.length>0) {
        //Mostrarlas con un estado y un mensaje
        res.status(200).json({
            estado:1,
            mensaje: "Existen productos",
            productos : productos
        });
    }else{
        //Mostrar mensajes de estado del servidor 
        res.status(404).json({
            estado:0,
            mensaje:"No se encontraron productos registrados",
            productos : productos
        });
    }

});

app.get('/socios/v1/productos/:id', (req,res)=>{
    //Se muestra un producto
    const id = req.params.id;
    const producto = productos.find(producto =>producto.id == id);
    //Sí se encontró un producto
    if (producto) {
        res.status(200).json({
            estado : 1,
            mensaje : "Se encontró el producto",
            producto : producto
        });
    } else {
        //No se encontró un producto
        res.status(404).json({
            estado:0,
            mensaje:"No se encontró el producto",
            producto : {}
        });
    }
});

app.post('/socios/v1/productos', (req,res)=>{
    //Crear un recurso - Crear producto
    const {nombre, cantidad, precioCompra, precioVenta} = req.body;
    const id = productos.length;

    //Comprobar que el cliente - usuario - programador haya llenado todos los campos
    if (nombre == undefined || cantidad == undefined || precioCompra == undefined || precioVenta == undefined) {
        // Hay un error en la solicitud por parte del programador
        res.status(400).json({
        estado : 0,
        mensaje : "Faltan parámetros en la solicitud"
        });
    }else{
        // En js cómo agregar un nuevo elemento a un arreglo
        const longitudInicial = productos.length;
        const producto = {
            id : id+1,
            nombre : nombre,
            cantidad : cantidad,
            precioCompra : precioCompra,
            precioVenta : precioVenta
        };
        const longitudFinal = productos.push(producto);
         
        if (longitudFinal > longitudInicial) {
            //Todo OK de parte del cleinte y el servidor creó el recurso
            res.status(201).json({
                estado : 1,
                mensaje : "Categoria creada correctamente",
                producto : producto
            });
        } else {
            //Error del servidor
            res.status(500).json({
                estado:0,
                mensaje:"Ocurrió un error desconocido",
                producto : producto
            });
        }
    }
});

app.put('/socios/v1/productos/:id', (req, res) => {
    // Actualizar un recurso del servidor - Actualizar una categoria
    // Recuperar el ID de la categoría a actualizar
    const id = parseInt(req.params.id);

    // Recuperar los datos enviados por el usuario en el cuerpo de la solicitud
    const { nombre, cantidad, precioCompra, precioVenta } = req.body;

    // Buscar el producto existente por su ID
    const productoExistente = productos.find(producto => producto.id === id);

    if (!productoExistente) {
        // Si no se encuentra el producto, responder con un estado 404 (No encontrado)
        res.status(404).json({
            estado: 0,
            mensaje: "No se encontró un producto para actualizar",
            producto: {}
        });
    } else {
        // Si se encuentra el producto, actualizar los datos
        if (nombre !== undefined) {
            productoExistente.nombre = nombre;
        }
        else if (cantidad !== undefined) {
            productoExistente.cantidad = cantidad;
        }
        else if (precioCompra !== undefined) {
            productoExistente.precioCompra = precioCompra;
        }
        else if (precioVenta !== undefined) {
            productoExistente.precioVenta = precioVenta;
        }else{
            res.status(404).json({
                estado: 0,
                mensaje: "No se ha actualizado ningún elemento",
                producto: productoExistente
            });
        }

        res.status(200).json({
            estado: 1,
            mensaje: "Producto actualizado correctamente",
            producto: productoExistente
        });
    }
});

app.delete('/socios/v1/productos/:id', (req, res) => {
    // Eliminar un recurso del servidor - Eliminar un producto
    const id = parseInt(req.params.id);

    // Buscar el producto por su ID
    const indiceProducto = productos.findIndex(producto => producto.id === id);

    if (indiceProducto === -1) {
        // Si no se encuentra el producto, responder con un estado 404 (No encontrado)
        res.status(404).json({
            estado: 0,
            mensaje: "No se encontró el producto para eliminar",
            producto: {}
        });
    } else {
        // Si se encuentra el producto, eliminarla del arreglo
        const productoEliminado = productos.splice(indiceProducto, 1);

        res.status(200).json({
            estado: 1,
            mensaje: "Producto eliminado correctamente",
            producto: productoEliminado
        });
    }
});


app.listen(puerto,()=>{
    console.log('Servidor corriendo en el puerto: ', puerto);
});