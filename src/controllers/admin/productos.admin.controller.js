// --- backend/src/controllers/admin/productos.admin.controller.js ---
import { Producto } from '../../models/producto.model.js';

export const productosAdminController = {
    
    // 1. Dashboard (Con lógica de Búsqueda por ID)
    mostrarDashboard: async (req, res) => {
        try {
            const { id } = req.query; // Capturamos ?id=... de la URL
            let productos;

            if (id) {
                // Si hay búsqueda, traemos solo ese producto
                const prod = await Producto.findByPk(id);
                productos = prod ? [prod] : [];
            } else {
                // Si no, traemos todos
                productos = await Producto.findAll();
            }

            // Renderizamos pasando la variable 'busqueda' que espera el EJS
            res.render('admin/dashboard', { 
                productos, 
                usuario: req.session.usuarioId,
                busqueda: id || null // <--- ESTA ES LA CLAVE PARA QUE NO FALLE
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar dashboard');
        }
    },

    // 2. Alta
    mostrarFormularioAlta: (req, res) => {
        res.render('admin/form-producto', { producto: null });
    },

    // 3. Guardar Nuevo
    crearProducto: async (req, res) => {
        try {
            const { nombre, precio, categoria, stock } = req.body;
            let imagenes = [];
            
            if (req.files && req.files.length > 0) {
                imagenes = req.files.map(f => f.filename);
            } else {
                imagenes = ["https://placehold.co/600?text=Sin+Imagen"];
            }

            await Producto.create({
                nombre, precio, categoria, stock: stock || 0,
                imagen: imagenes,
                activo: true
            });

            res.redirect('/admin/dashboard');
        } catch (error) {
            res.status(500).send('Error al guardar');
        }
    },

    // 4. Ver Edición
    mostrarFormularioEditar: async (req, res) => {
        try {
            const producto = await Producto.findByPk(req.params.id);
            if (!producto) return res.redirect('/admin/dashboard');
            res.render('admin/form-producto', { producto }); 
        } catch (error) {
            res.status(500).send('Error al buscar');
        }
    },

    // 5. Guardar Edición
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
            producto.stock = stock;

            // Si subió una nueva imagen, actualizo también el nombre de la imagen.
            if (req.file) {
                producto.imagen = req.file.filename;
            }

            await producto.save(); //  Guardo los cambios en la base de datos.

            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error("Error al editar:", error);
            res.status(500).send('Error al actualizar el producto');
        }
    },

    // ---  OTRA OPERACIÓN - Cambiar el estado (activar/desactivar) ---
    cambiarEstado: async (req, res) => {
        try {
            const producto = await Producto.findByPk(req.params.id);
            if (producto) {
                producto.activo = !producto.activo;
                await producto.save(); // Guardo el nuevo estado.
            }
            res.redirect('/admin/dashboard');
        } catch (error) {
            res.status(500).send('Error al cambiar estado');
        }
    },

    // 7. Eliminar Definitivamente
    eliminarProducto: async (req, res) => {
        try {
            await Producto.destroy({ where: { id: req.params.id } });
            res.redirect('/admin/dashboard');
        } catch (error) {
            res.status(500).send('Error al eliminar');
        }
    }
};