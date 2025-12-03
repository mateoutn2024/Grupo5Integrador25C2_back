import { Venta } from '../../models/venta.model.js';          // El modelo de la tabla principal de la venta (la cabecera: fecha, total).
import { VentaProducto } from '../../models/ventaProducto.model.js'; // El modelo de la tabla intermedia (los ítems de la venta: qué producto, cuántos).

export const ventasApiController = {

    // ---  POST /api/ventas (Registra una nueva venta) ---
    crearVenta: async (req, res) => {
        try {
            // 1. Recibo los datos del cuerpo de la petición (JSON).
            //    - nombreUsuario: Quién está comprando.
            //    - items: El array con los productos del carrito.
            const { nombreUsuario, items } = req.body;

            // 2. Validación básica: si no hay ítems o el array está vacío, doy un error 400.
            if (!items || items.length === 0) {
                return res.status(400).json({ error: "El carrito está vacío" });
            }

            // 3. Calculo el precio total de la venta sumando los subtotales de cada ítem.
            let precioTotal = 0;
            for (const item of items) {
                precioTotal += (item.precio * item.cantidad);
            }

            // 4. Creo la CABECERA de la venta en la tabla 'Venta'.
            const nuevaVenta = await Venta.create({
                nombreUsuario,
                precioTotal,
                fecha: new Date()
            });

            // 5. Creo los DETALLES de la venta (los ítems). Uso un bucle for.
            for (const item of items) {
                // Inserto una fila en la tabla intermedia 'VentaProducto' por cada ítem.
                // Esta tabla relaciona la venta con el producto.
                await VentaProducto.create({
                    ventaId: nuevaVenta.id,     // El ID de la venta que acabamos de crear.
                    productoId: item.id,
                    cantidad: item.cantidad
                });
            }

            // 6. Si todo fue bien, respondo con un JSON confirmando la venta y el detalle.
            res.json({
                mensaje: "Venta exitosa",
                ticket: {
                    id: nuevaVenta.id,
                    usuario: nombreUsuario,
                    total: precioTotal,
                    fecha: nuevaVenta.fecha,
                    items: items
                }
            });

        } catch (error) {
            // 7. Si explota, doy un error 500 (problema de servidor) y lo muestro en la consola.
            console.error("Error al crear venta:", error);
            res.status(500).json({ error: "Hubo un error al procesar la venta" });
        }
    }
};