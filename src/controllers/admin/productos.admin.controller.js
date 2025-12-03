// --- backend/src/controllers/admin/productos.admin.controller.js ---
import { Producto } from '../../models/producto.model.js'; // 1. Traigo el Modelo de Producto. Lo necesito para interactuar con la tabla de productos en la DB.

export const productosAdminController = { // Este objeto tiene todas las funciones que manejan las rutas del panel de admin de productos.

    // --- LEER (Read) - Mostrar la lista de todos los productos ---
    mostrarDashboard: async (req, res) => {
        try {
            // Busco TODOS los productos en la base de datos.
            const productos = await Producto.findAll();

            // Renderizo el dashboard y le mando la lista de productos y el ID del usuario (de la sesión) por si lo necesito en la vista.
            res.render('admin/dashboard', {
                productos: productos,
                usuario: req.session.usuarioId
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar el dashboard'); // Error 500 = Algo salió mal en el servidor.
        }
    },

    // ---  CREAR (Create) - Muestra el formulario vacío para dar de alta un producto ---
    mostrarFormularioAlta: (req, res) => {
        // Renderizo el formulario. Mando 'producto: null' para que la vista sepa que es una ALTA y no una EDICIÓN.
        res.render('admin/form-producto', { producto: null });
    },

    // ---  CREAR (Create) - Guarda el nuevo producto en la DB ---
    crearProducto: async (req, res) => {
        try {

            // Saco los datos del formulario (req.body).
            const { nombre, precio, categoria } = req.body;

            // Verifico que se haya subido un archivo (imagen).
            if (!req.file) { // Ojo: req.file existe gracias a una librería tipo Multer.
                return res.status(400).send('Es obligatorio subir una imagen'); // Error 400 = Bad Request (Petición mal hecha).
            }

            // Inserto el nuevo producto en la tabla usando el método 'create' del modelo.
            await Producto.create({
                nombre,
                precio,
                categoria,
                imagen: req.file.filename, // Guardo el nombre del archivo de la imagen que subió Multer.
                activo: true // Lo pongo como activo por defecto.
            });

            // Si todo ok, vuelvo al dashboard.
            res.redirect('/admin/dashboard');

        } catch (error) {
            console.error("Error al crear producto:", error);
            res.status(500).send('Error al guardar el producto');
        }
    },

    // ---  ACTUALIZAR (Update) - Muestra el formulario con los datos del producto existente ---
    mostrarFormularioEditar: async (req, res) => {
        try {
            const { id } = req.params; // Saco el ID del producto de los parámetros de la URL.
            const producto = await Producto.findByPk(id); // Busco el producto por su clave primaria (ID).

            if (!producto) {
                return res.redirect('/admin/dashboard'); // Si no existe, lo mando al dashboard.
            }

            // Renderizo el formulario de nuevo, pero esta vez le mando el objeto 'producto' con los datos precargados.
            res.render('admin/form-producto', { producto });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error al buscar el producto');
        }
    },

    // ---  ACTUALIZAR (Update) - Guarda los cambios del producto en la DB ---
    editarProducto: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, precio, categoria } = req.body; // Nuevos datos del formulario.

            const producto = await Producto.findByPk(id);

            if (!producto) {
                return res.status(404).send('Producto no encontrado'); // Error 404 = Not Found.
            }

            // Actualizo las propiedades del objeto 'producto' que saqué de la DB.
            producto.nombre = nombre;
            producto.precio = precio;
            producto.categoria = categoria;

            // Si subió una nueva imagen, actualizo también el nombre de la imagen.
            if (req.file) {
                producto.imagen = req.file.filename;
            }

            await producto.save(); // ¡CLAVE! Guardo los cambios en la base de datos.

            res.redirect('/admin/dashboard');

        } catch (error) {
            console.error("Error al editar:", error);
            res.status(500).send('Error al actualizar el producto');
        }
    },

    // ---  OTRA OPERACIÓN - Cambiar el estado (activar/desactivar) ---
    cambiarEstado: async (req, res) => {
        try {
            const { id } = req.params;
            const producto = await Producto.findByPk(id);

            if (producto) {
                // Le asigno el valor opuesto al que tiene. 
                // Si 'activo' es TRUE, lo cambia a FALSE, y viceversa.
                producto.activo = !producto.activo;
                await producto.save(); // Guardo el nuevo estado.
            }

            res.redirect('/admin/dashboard');

        } catch (error) {
            console.error("Error al cambiar estado:", error);
            res.status(500).send('Error al actualizar estado');
        }
    }
};