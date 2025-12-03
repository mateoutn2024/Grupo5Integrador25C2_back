// --- backend/src/controllers/api/productos.api.controller.js ---
import { Producto } from '../../models/producto.model.js'; // 1. Traigo el Modelo de Producto. Lo necesito para hacer las consultas a la base de datos.

export const productosApiController = { // Este objeto maneja las rutas de la API (las que responden con JSON, no con HTML).

    // ---  Obtener la lista de productos para la tienda ---
    obtenerProductos: async (req, res) => {
        try {
            // 2. Busco todos los productos, pero solo los que están activos.
            const productos = await Producto.findAll({
                // Solo traigo los productos donde el campo 'activo' es TRUE.
                // Los que el admin desactivó (activo: false) no se muestran en la tienda.
                where: { activo: true }
            });

            // 3. En lugar de res.render (que manda HTML), uso res.json.
            // Esto manda la lista de productos en formato JSON, que es lo que el front-end necesita.
            res.json(productos);

        } catch (error) {
            console.error("Error API:", error);
            // Si hay un fallo, devuelvo un código de error 500 y un mensaje en JSON.
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    },

    // ---  Obtener un producto específico por su ID ---
    obtenerProductoPorId: async (req, res) => {
        try {
            const { id } = req.params; // Saco el ID del producto de la URL.

            // 4. Busco UN producto por ID, pero de nuevo, solo si está activo.
            const producto = await Producto.findOne({
                where: { id, activo: true }
            });

            if (!producto) {
                // Si no lo encuentra, devuelvo 404 (Not Found) en formato JSON.
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            // 5. Devuelvo el producto encontrado en JSON.
            res.json(producto);

        } catch (error) {
            // Manejo de error general (500)
            res.status(500).json({ error: 'Error al obtener el producto' });
        }
    }
};