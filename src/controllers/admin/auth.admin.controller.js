import { Usuario } from '../../models/usuario.model.js'; // 1. Traigo el modelo 'Usuario'. Lo necesito para buscar al usuario en la base de datos.

export const authController = { // 2. Defino el objeto que va a manejar toda la autenticación (login y logout).

    // ---  FUNCIÓN PARA MOSTRAR EL FORMULARIO DE LOGIN ---
    mostrarLogin: (req, res) => {
        // Renderizo la vista (el HTML) del login. Si hay error, lo inicializo en null.
        res.render('admin/login', { error: null });
    },

    // ---  FUNCIÓN PARA PROCESAR EL FORMULARIO DE LOGIN (cuando le dan al botón) ---
    procesarLogin: async (req, res) => {
        try {
            // 3. Desestructuro (saco) el email y password del cuerpo de la petición (lo que viene del formulario).
            const { email, password } = req.body;

            // 4. Busco si existe un usuario con ese email en la base de datos.
            const usuario = await Usuario.findOne({ where: { email } });

            // 5. Hago la validación CLAVE:
            //    - Si el 'usuario' no existe O
            //    - Si la función que compara la contraseña hasheada ('validarPassword') devuelve false...
            if (!usuario || !(await usuario.validarPassword(password))) {
                // entonces, vuelvo a renderizar el login pero mando un mensaje de error.
                return res.render('admin/login', { error: 'Credenciales inválidas' });
            }

            // 6. Si llegamos acá, el usuario está logueado. Guardo la sesión:
            req.session.usuarioId = usuario.id; // Guardo el ID del usuario.
            req.session.esAdmin = true; // Marco que es administrador para proteger las rutas.

            // 7. Redirijo al panel de administrador (dashboard).
            res.redirect('/admin/dashboard');

        } catch (error) {
            // 8. Si falla algo, lo imprimo en la consola y muestro un error genérico al usuario.
            console.error(error);
            res.render('admin/login', { error: 'Error en el servidor' });
        }
    },

    // ---  FUNCIÓN PARA CERRAR LA SESIÓN ---
    cerrarSesion: (req, res) => {
        // 9. Destruyo la sesión. Esto borra toda la info guardada en 'req.session'.
        req.session.destroy(() => {
            // 10. Después de borrar la sesión, lo redirijo de nuevo al login.
            res.redirect('/admin/login');
        });
    }
};