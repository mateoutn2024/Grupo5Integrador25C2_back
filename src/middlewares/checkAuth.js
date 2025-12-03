// --- backend/src/middlewares/checkAuth.js ---
// Esta función se va a ejecutar ANTES que el controller de la ruta.
export const checkAuth = (req, res, next) => {

    // 1. Pregunto: ¿Existe una sesión (req.session)? Y, ¿hay un ID de usuario guardado en esa sesión?
    if (req.session && req.session.usuarioId) {
        // 2. Sí hay sesión, Significa que el usuario está logueado.
        //    Llamo a 'next()' para que la petición siga su camino normal
        //    y llegue al controlador que debe mostrar la página (ej: dashboard).
        next();
    } else {
        // 3. ¡No hay sesión o no hay ID de usuario! Es un intruso.
        //    Lo redirijo de vuelta a la página de login para que se identifique.
        res.redirect('/admin/login');
    }
};