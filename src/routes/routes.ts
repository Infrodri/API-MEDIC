import { loginUser, registerUser } from "@controllers/auth/authControllers";
import { createPosts, deletePosts, findPosts, findPostsById, updatePosts } from "@controllers/postsControllers";
import { createRoles, deleteRoles, findRoles, findRolesById, updateRoles } from "@controllers/rolesControllers";
import { createUser, deleteUser, findUsers, findUsersById, updateUser } from "@controllers/usersControllers";
import { createPaciente, deletePaciente, findPacientes, findPacienteById, softDeletePaciente, updatePaciente } from "@controllers/pacientesControllers";
import { createMedico, deleteMedico, findMedicos, findMedicoById, softDeleteMedico, updateMedico } from "@controllers/medicosControllers";
import { createTiposAdiccion, deleteTiposAdiccion, findTiposAdicciones, findTiposAdiccionById, softDeleteTiposAdiccion, updateTiposAdiccion } from "@controllers/tiposAdiccionesControllers";
import { createTiposObstetricosGinecologicos, deleteTiposObstetricosGinecologicos, findTiposObstetricosGinecologicos, findTiposObstetricosGinecologicosById, softDeleteTiposObstetricosGinecologicos, updateTiposObstetricosGinecologicos } from "@controllers/tiposObstetricosGinecologicosControllers";
import { createTiposOperacionesQuirurgicas, deleteTiposOperacionesQuirurgicas, findTiposOperacionesQuirurgicas, findTiposOperacionesQuirurgicasById, softDeleteTiposOperacionesQuirurgicas, updateTiposOperacionesQuirurgicas } from "@controllers/tiposOperacionesQuirurgicasControllers";
import { createExamenesMedicos, deleteExamenesMedicos, findExamenesMedicos, findExamenesMedicosById, softDeleteExamenesMedicos, updateExamenesMedicos } from "@controllers/examenesMedicosControllers";
import { createFichasMedicas, deleteFichasMedicas, findFichasMedicas, findFichasMedicasById, softDeleteFichasMedicas, updateFichasMedicas } from "@controllers/fichasMedicasControllers";
import { createConsultasMedicas, deleteConsultasMedicas, findConsultasMedicas, findConsultasMedicasById, softDeleteConsultasMedicas, updateConsultasMedicas } from "@controllers/consultasMedicasControllers";
import { createRecetasMedicas, deleteRecetasMedicas, findRecetasMedicas, findRecetasMedicasById, softDeleteRecetasMedicas, updateRecetasMedicas } from "@controllers/recetasMedicasControllers";
import { createMedicamentos, deleteMedicamentos, findMedicamentos, findMedicamentosById, softDeleteMedicamentos, updateMedicamentos } from "@controllers/medicamentosControllers";
import { createPacienteAdicciones, deletePacienteAdicciones, findPacienteAdicciones, findPacienteAdiccionesById, softDeletePacienteAdicciones, updatePacienteAdicciones } from "@controllers/pacienteAdiccionesControllers";
import { createPacienteObstetricosGinecologicos, deletePacienteObstetricosGinecologicos, findPacienteObstetricosGinecologicos, findPacienteObstetricosGinecologicosById, softDeletePacienteObstetricosGinecologicos, updatePacienteObstetricosGinecologicos } from "@controllers/pacienteObstetricosGinecologicosControllers";
import { createPacienteOperaciones, deletePacienteOperaciones, findPacienteOperaciones, findPacienteOperacionesById, softDeletePacienteOperaciones, updatePacienteOperaciones } from "@controllers/pacienteOperacionesControllers";
import { createRecetasMedicamentos, deleteRecetasMedicamentos, findRecetasMedicamentos, findRecetasMedicamentosById, softDeleteRecetasMedicamentos, updateRecetasMedicamentos } from "@controllers/recetasMedicamentosControllers"; // Nuevas importaciones
import { createPacienteExamenes, deletePacienteExamenes, findPacienteExamenes, findPacienteExamenesById, softDeletePacienteExamenes, updatePacienteExamenes } from "@controllers/pacienteExamenesControllers"; // Nuevas importaciones
import { Router } from "express";
import { getPermissons, verifyToken } from "middlewares/auth";
import { checkRoles } from "middlewares/roles";

const router = Router();

export default () => {
  router.get("/health", (req, res) => {
    res.send("Api is Healthy!!!");
  });

  // Rutas de Autenticación
  router.post("/auth/register", checkRoles, registerUser);
  router.post("/auth/login", loginUser);

  // Rutas de Usuarios
  router.get("/users", verifyToken, getPermissons, findUsers);
  router.get("/users/:id", verifyToken, getPermissons, findUsersById);
  router.post("/users", verifyToken, getPermissons, checkRoles, createUser);
  router.put("/users/:id", verifyToken, getPermissons, updateUser);
  router.delete("/users/:id", verifyToken, getPermissons, deleteUser);

  // Rutas de Roles
  router.get("/roles", verifyToken, getPermissons, findRoles);
  router.get("/roles/:id", verifyToken, getPermissons, findRolesById);
  router.post("/roles", verifyToken, getPermissons, createRoles);
  router.put("/roles/:id", verifyToken, getPermissons, updateRoles);
  router.delete("/roles/:id", verifyToken, getPermissons, deleteRoles);

  // Rutas de Posts
  router.get("/posts", findPosts);
  router.get("/posts/:id", findPostsById);
  router.post("/posts", verifyToken, getPermissons, createPosts);
  router.put("/posts/:id", verifyToken, getPermissons, updatePosts);
  router.delete("/posts/:id", verifyToken, getPermissons, deletePosts);

  // Rutas de Pacientes
  router.get("/pacientes", verifyToken, getPermissons, findPacientes);
  router.get("/pacientes/:id", verifyToken, getPermissons, findPacienteById);
  router.post("/pacientes", verifyToken, getPermissons, checkRoles, createPaciente);
  router.put("/pacientes/:id", verifyToken, getPermissons, updatePaciente);
  router.delete("/pacientes/:id", verifyToken, getPermissons, deletePaciente);
  router.patch("/pacientes/:id/soft-delete", verifyToken, getPermissons, softDeletePaciente);

  // Rutas de Médicos
  router.get("/medicos", verifyToken, getPermissons, findMedicos);
  router.get("/medicos/:id", verifyToken, getPermissons, findMedicoById);
  router.post("/medicos", verifyToken, getPermissons, checkRoles, createMedico);
  router.put("/medicos/:id", verifyToken, getPermissons, updateMedico);
  router.delete("/medicos/:id", verifyToken, getPermissons, deleteMedico);
  router.patch("/medicos/:id/soft-delete", verifyToken, getPermissons, softDeleteMedico);

  // Rutas de Tipos de Adicciones
  router.get("/tipos-adicciones", verifyToken, getPermissons, findTiposAdicciones);
  router.get("/tipos-adicciones/:id", verifyToken, getPermissons, findTiposAdiccionById);
  router.post("/tipos-adicciones", verifyToken, getPermissons, checkRoles, createTiposAdiccion);
  router.put("/tipos-adicciones/:id", verifyToken, getPermissons, updateTiposAdiccion);
  router.delete("/tipos-adicciones/:id", verifyToken, getPermissons, deleteTiposAdiccion);
  router.patch("/tipos-adicciones/:id/soft-delete", verifyToken, getPermissons, softDeleteTiposAdiccion);

  // Rutas de Tipos Obstétricos Ginecológicos
  router.get("/tipos-obstetricos-ginecologicos", verifyToken, getPermissons, findTiposObstetricosGinecologicos);
  router.get("/tipos-obstetricos-ginecologicos/:id", verifyToken, getPermissons, findTiposObstetricosGinecologicosById);
  router.post("/tipos-obstetricos-ginecologicos", verifyToken, getPermissons, checkRoles, createTiposObstetricosGinecologicos);
  router.put("/tipos-obstetricos-ginecologicos/:id", verifyToken, getPermissons, updateTiposObstetricosGinecologicos);
  router.delete("/tipos-obstetricos-ginecologicos/:id", verifyToken, getPermissons, deleteTiposObstetricosGinecologicos);
  router.patch("/tipos-obstetricos-ginecologicos/:id/soft-delete", verifyToken, getPermissons, softDeleteTiposObstetricosGinecologicos);

  // Rutas de Tipos de Operaciones Quirúrgicas
  router.get("/tipos-operaciones-quirurgicas", verifyToken, getPermissons, findTiposOperacionesQuirurgicas);
  router.get("/tipos-operaciones-quirurgicas/:id", verifyToken, getPermissons, findTiposOperacionesQuirurgicasById);
  router.post("/tipos-operaciones-quirurgicas", verifyToken, getPermissons, checkRoles, createTiposOperacionesQuirurgicas);
  router.put("/tipos-operaciones-quirurgicas/:id", verifyToken, getPermissons, updateTiposOperacionesQuirurgicas);
  router.delete("/tipos-operaciones-quirurgicas/:id", verifyToken, getPermissons, deleteTiposOperacionesQuirurgicas);
  router.patch("/tipos-operaciones-quirurgicas/:id/soft-delete", verifyToken, getPermissons, softDeleteTiposOperacionesQuirurgicas);

  // Rutas de Exámenes Médicos
  router.get("/examenes-medicos", verifyToken, getPermissons, findExamenesMedicos);
  router.get("/examenes-medicos/:id", verifyToken, getPermissons, findExamenesMedicosById);
  router.post("/examenes-medicos", verifyToken, getPermissons, checkRoles, createExamenesMedicos);
  router.put("/examenes-medicos/:id", verifyToken, getPermissons, updateExamenesMedicos);
  router.delete("/examenes-medicos/:id", verifyToken, getPermissons, deleteExamenesMedicos);
  router.patch("/examenes-medicos/:id/soft-delete", verifyToken, getPermissons, softDeleteExamenesMedicos);

  // Rutas de Fichas Médicas
  router.get("/fichas-medicas", verifyToken, getPermissons, findFichasMedicas);
  router.get("/fichas-medicas/:id", verifyToken, getPermissons, findFichasMedicasById);
  router.post("/fichas-medicas", verifyToken, getPermissons, checkRoles, createFichasMedicas);
  router.put("/fichas-medicas/:id", verifyToken, getPermissons, updateFichasMedicas);
  router.delete("/fichas-medicas/:id", verifyToken, getPermissons, deleteFichasMedicas);
  router.patch("/fichas-medicas/:id/soft-delete", verifyToken, getPermissons, softDeleteFichasMedicas);

  // Rutas de Consultas Médicas
  router.get("/consultas-medicas", verifyToken, getPermissons, findConsultasMedicas);
  router.get("/consultas-medicas/:id", verifyToken, getPermissons, findConsultasMedicasById);
  router.post("/consultas-medicas", verifyToken, getPermissons, checkRoles, createConsultasMedicas);
  router.put("/consultas-medicas/:id", verifyToken, getPermissons, updateConsultasMedicas);
  router.delete("/consultas-medicas/:id", verifyToken, getPermissons, deleteConsultasMedicas);
  router.patch("/consultas-medicas/:id/soft-delete", verifyToken, getPermissons, softDeleteConsultasMedicas);

  // Rutas de Recetas Médicas
  router.get("/recetas-medicas", verifyToken, getPermissons, findRecetasMedicas);
  router.get("/recetas-medicas/:id", verifyToken, getPermissons, findRecetasMedicasById);
  router.post("/recetas-medicas", verifyToken, getPermissons, checkRoles, createRecetasMedicas);
  router.put("/recetas-medicas/:id", verifyToken, getPermissons, updateRecetasMedicas);
  router.delete("/recetas-medicas/:id", verifyToken, getPermissons, deleteRecetasMedicas);
  router.patch("/recetas-medicas/:id/soft-delete", verifyToken, getPermissons, softDeleteRecetasMedicas);

  // Rutas de Medicamentos
  router.get("/medicamentos", verifyToken, getPermissons, findMedicamentos);
  router.get("/medicamentos/:id", verifyToken, getPermissons, findMedicamentosById);
  router.post("/medicamentos", verifyToken, getPermissons, checkRoles, createMedicamentos);
  router.put("/medicamentos/:id", verifyToken, getPermissons, updateMedicamentos);
  router.delete("/medicamentos/:id", verifyToken, getPermissons, deleteMedicamentos);
  router.patch("/medicamentos/:id/soft-delete", verifyToken, getPermissons, softDeleteMedicamentos);

  // Rutas de Paciente-Adicciones
  router.get("/paciente-adicciones", verifyToken, getPermissons, findPacienteAdicciones);
  router.get("/paciente-adicciones/:id", verifyToken, getPermissons, findPacienteAdiccionesById);
  router.post("/paciente-adicciones", verifyToken, getPermissons, checkRoles, createPacienteAdicciones);
  router.put("/paciente-adicciones/:id", verifyToken, getPermissons, updatePacienteAdicciones);
  router.delete("/paciente-adicciones/:id", verifyToken, getPermissons, deletePacienteAdicciones);
  router.patch("/paciente-adicciones/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteAdicciones);

  // Rutas de Paciente-Obstétricos/Ginecológicos
  router.get("/paciente-obstetricos-ginecologicos", verifyToken, getPermissons, findPacienteObstetricosGinecologicos);
  router.get("/paciente-obstetricos-ginecologicos/:id", verifyToken, getPermissons, findPacienteObstetricosGinecologicosById);
  router.post("/paciente-obstetricos-ginecologicos", verifyToken, getPermissons, checkRoles, createPacienteObstetricosGinecologicos);
  router.put("/paciente-obstetricos-ginecologicos/:id", verifyToken, getPermissons, updatePacienteObstetricosGinecologicos);
  router.delete("/paciente-obstetricos-ginecologicos/:id", verifyToken, getPermissons, deletePacienteObstetricosGinecologicos);
  router.patch("/paciente-obstetricos-ginecologicos/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteObstetricosGinecologicos);

  // Rutas de Paciente-Operaciones
  router.get("/paciente-operaciones", verifyToken, getPermissons, findPacienteOperaciones);
  router.get("/paciente-operaciones/:id", verifyToken, getPermissons, findPacienteOperacionesById);
  router.post("/paciente-operaciones", verifyToken, getPermissons, checkRoles, createPacienteOperaciones);
  router.put("/paciente-operaciones/:id", verifyToken, getPermissons, updatePacienteOperaciones);
  router.delete("/paciente-operaciones/:id", verifyToken, getPermissons, deletePacienteOperaciones);
  router.patch("/paciente-operaciones/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteOperaciones);

  // Rutas de Recetas-Medicamentos
  router.get("/recetas-medicamentos", verifyToken, getPermissons, findRecetasMedicamentos); // Listar relaciones (activas)
  router.get("/recetas-medicamentos/:id", verifyToken, getPermissons, findRecetasMedicamentosById); // Obtener relación por ID
  router.post("/recetas-medicamentos", verifyToken, getPermissons, checkRoles, createRecetasMedicamentos); // Crear relación
  router.put("/recetas-medicamentos/:id", verifyToken, getPermissons, updateRecetasMedicamentos); // Actualizar relación
  router.delete("/recetas-medicamentos/:id", verifyToken, getPermissons, deleteRecetasMedicamentos); // Eliminar físicamente (si aplica)
  router.patch("/recetas-medicamentos/:id/soft-delete", verifyToken, getPermissons, softDeleteRecetasMedicamentos); // Eliminar lógicamente (cambiar a Inactivo)

  // Rutas de Paciente-Exámenes
  router.get("/paciente-examenes", verifyToken, getPermissons, findPacienteExamenes); // Listar relaciones (activas)
  router.get("/paciente-examenes/:id", verifyToken, getPermissons, findPacienteExamenesById); // Obtener relación por ID
  router.post("/paciente-examenes", verifyToken, getPermissons, checkRoles, createPacienteExamenes); // Crear relación
  router.put("/paciente-examenes/:id", verifyToken, getPermissons, updatePacienteExamenes); // Actualizar relación
  router.delete("/paciente-examenes/:id", verifyToken, getPermissons, deletePacienteExamenes); // Eliminar físicamente (si aplica)
  router.patch("/paciente-examenes/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteExamenes); // Eliminar lógicamente (cambiar a Inactivo)

  return router;
};