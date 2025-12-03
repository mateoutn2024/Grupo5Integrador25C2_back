import { Usuario } from '../../models/usuario.model.js';

export const usuariosAdminController = {
    mostrarFormularioAltaUsuario: async (req, res) => {
        res.render('admin/form-crearUsuario', { error: null, success: null }); 
    },

    crearUsuario: async (req,res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.render('admin/form-crearUsuario', { error: "Mail y contraseña requeridos", success:null});
                
            }
            const existe = await Usuario.findOne({ where: { email } });
            if (existe) {
                return res.render('admin/form-crearUsuario', { error: "Ya existe un usuario con ese mail", success:null});
            }
            await Usuario.create({email, password});
            return res.render('admin/form-crearUsuario', {error:null, success:"Usuario administrador creado con exito"});
        
        } catch (error) {
            console.error(error);
            return res.render('admin/form-crearUsuario', { error: 'Error al crear usuario', success: null });
        }
    }
}
