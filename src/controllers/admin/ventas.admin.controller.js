// --- backend/src/controllers/admin/ventas.admin.controller.js ---
import { Venta } from '../../models/venta.model.js'; // 1. Traigo el Modelo de Venta. Lo uso para sacar la info de todas las ventas de la base de datos.

export const ventasAdminController = {

    // ---  Función para descargar un Excel (en realidad, un CSV) ---
    descargarExcel: async (req, res) => {
        try {
            // 2. Busco todas las ventas que tengo registradas.
            const ventas = await Venta.findAll();

            // 3. Armo el encabezado (la primera fila) del archivo CSV. Los valores se separan por comas.
            let csv = 'ID Venta,Fecha,Cliente,Total\n';

            // 4. Recorro cada venta que traje de la base de datos.
            ventas.forEach(venta => {

                // Formateo la fecha para que se vea bonita (Día/Mes/Año, por ejemplo).
                const fecha = new Date(venta.fecha).toLocaleDateString();

                // Reemplazo cualquier coma que el nombre del cliente pueda tener por un espacio.
                const cliente = venta.nombreUsuario.replace(/,/g, ' ');

                // Armo la fila de datos y la concateno (la pego) a la variable 'csv'.
                csv += `${venta.id},${fecha},${cliente},${venta.precioTotal}\n`;
            });

            // 5. Configuro las cabeceras de la respuesta HTTP:

            // Le digo al navegador que lo que le estoy enviando es un archivo de texto CSV.
            res.header('Content-Type', 'text/csv');

            // Esto hace que el navegador FUERCE la descarga y le ponga un nombre al archivo.
            res.attachment('ventas_autoservicio.csv');

            // 6. Envío el texto CSV que acabamos de construir. se descarga
            return res.send(csv);

        } catch (error) {
            console.error("Error al generar Excel:", error);
            // Si algo falla, vuelvo al dashboard.
            res.redirect('/admin/dashboard');
        }
    }
};