import { loginUser,  registerUser } from "@controllers/auth/authControllers";
import { createRoles, deleteRoles, findRoles, findRolesById,  updateRoles } from "@controllers/rolesControllers";
import { createUser, deleteUser, findUsers, findUsersById,  updateUser } from "@controllers/usersControllers";import { createPaciente, deletePaciente, findPacientes, findPacienteById, softDeletePaciente, updatePaciente } from "@controllers/pacientesControllers";
import {
  findMedicos,
  findMedicoById,
  createMedico,
  updateMedico,
  softDeleteMedico,
  deleteMedico,
  getDoctorsBySpecialty,
  getActiveDoctorsToday,
  getTotalDoctors,
  getDoctorsBySpecialtyId,
  getDoctorsByUserId,
  getDoctorsWithMultipleSpecialties,
} from "@controllers/medicosControllers";
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
import { createRecetasMedicamentos, deleteRecetasMedicamentos, findRecetasMedicamentos, findRecetasMedicamentosById, softDeleteRecetasMedicamentos, updateRecetasMedicamentos } from "@controllers/recetasMedicamentosControllers";
import { createPacienteExamenes, deletePacienteExamenes, findPacienteExamenes, findPacienteExamenesById, softDeletePacienteExamenes, updatePacienteExamenes } from "@controllers/pacienteExamenesControllers";
import { createEspecialidades, deleteEspecialidades, findEspecialidades, findEspecialidadesById, softDeleteEspecialidades, updateEspecialidades } from "@controllers/especialidadesControllers";
import { Router } from "express";
import { getPermissons, verifyToken } from "middlewares/auth";
import { checkRoles } from "middlewares/roles";

const router = Router();

export default () => {
  router.get("/health", (req, res) => {
    res.send("Api is Healthy!!!");
  });

    // Auth Routes
    router.post("/auth/register", checkRoles, registerUser);
    router.post("/auth/login", loginUser);
  
    // Users Routes
    router.get("/users", verifyToken, getPermissons, findUsers);
    router.get("/users/:id", verifyToken, getPermissons, findUsersById);
    router.post("/users", verifyToken, getPermissons, checkRoles, createUser);
    router.put("/users/:id", verifyToken, getPermissons, updateUser);
    router.delete("/users/:id", verifyToken, getPermissons, deleteUser);
  
    // Roles Routes
    router.get("/roles", verifyToken, getPermissons, findRoles);
    router.get("/roles/:id", verifyToken, getPermissons, findRolesById);
    router.post("/roles", verifyToken, getPermissons, createRoles);
    router.put("/roles/:id", verifyToken, getPermissons, updateRoles);
    router.delete("/roles/:id", verifyToken, getPermissons, deleteRoles);
  

 


  // Rutas de Pacientes
  router.get("/pacientes", verifyToken, getPermissons, findPacientes);
  router.get("/pacientes/:id", verifyToken, getPermissons, findPacienteById);
  router.post("/pacientes", verifyToken, getPermissons, createPaciente);
  router.put("/pacientes/:id", verifyToken, getPermissons, updatePaciente);
  router.delete("/pacientes/:id", verifyToken, getPermissons, deletePaciente);
  router.patch("/pacientes/:id/soft-delete", verifyToken, getPermissons, softDeletePaciente);

// Rutas de Médicos (movidas bajo /medicos con middlewares)
// Rutas de Médicos
router.get("/medicos", verifyToken, getPermissons, findMedicos);
router.get("/medicos/stats/specialty", verifyToken, getPermissons, getDoctorsBySpecialty);
router.get("/medicos/stats/active-today", verifyToken, getPermissons, getActiveDoctorsToday);
router.get("/medicos/stats/total", verifyToken, getPermissons, getTotalDoctors);
router.get("/medicos/multiple-specialties", verifyToken, getPermissons, getDoctorsWithMultipleSpecialties); // Movida antes de :id
router.get("/medicos/by-specialty/:especialidadId", verifyToken, getPermissons, getDoctorsBySpecialtyId);
router.get("/medicos/by-user/:userId", verifyToken, getPermissons, getDoctorsByUserId);
router.get("/medicos/:id", verifyToken, getPermissons, findMedicoById); // :id al final
router.post("/medicos", verifyToken, getPermissons, createMedico);
router.put("/medicos/:id", verifyToken, getPermissons, updateMedico);
router.delete("/medicos/:id/soft", verifyToken, getPermissons, softDeleteMedico);
router.delete("/medicos/:id", verifyToken, getPermissons, deleteMedico); 

// Rutas de Tipos de Adicciones
  router.get("/tipos-adicciones", verifyToken, getPermissons, findTiposAdicciones);
  router.get("/tipos-adicciones/:id", verifyToken, getPermissons, findTiposAdiccionById);
  router.post("/tipos-adicciones", verifyToken, getPermissons, createTiposAdiccion);
  router.put("/tipos-adicciones/:id", verifyToken, getPermissons, updateTiposAdiccion);
  router.delete("/tipos-adicciones/:id", verifyToken, getPermissons, deleteTiposAdiccion);
  router.patch("/tipos-adicciones/:id/soft-delete", verifyToken, getPermissons, softDeleteTiposAdiccion);

  // Rutas de Tipos Obstétricos Ginecológicos
  router.get("/tipos-obstetricos-ginecologicos", verifyToken, getPermissons, findTiposObstetricosGinecologicos);
  router.get("/tipos-obstetricos-ginecologicos/:id", verifyToken, getPermissons, findTiposObstetricosGinecologicosById);
  router.post("/tipos-obstetricos-ginecologicos", verifyToken, getPermissons, createTiposObstetricosGinecologicos);
  router.put("/tipos-obstetricos-ginecologicos/:id", verifyToken, getPermissons, updateTiposObstetricosGinecologicos);
  router.delete("/tipos-obstetricos-ginecologicos/:id", verifyToken, getPermissons, deleteTiposObstetricosGinecologicos);
  router.patch("/tipos-obstetricos-ginecologicos/:id/soft-delete", verifyToken, getPermissons, softDeleteTiposObstetricosGinecologicos);

  // Rutas de Tipos de Operaciones Quirúrgicas
  router.get("/tipos-operaciones-quirurgicas", verifyToken, getPermissons, findTiposOperacionesQuirurgicas);
  router.get("/tipos-operaciones-quirurgicas/:id", verifyToken, getPermissons, findTiposOperacionesQuirurgicasById);
  router.post("/tipos-operaciones-quirurgicas", verifyToken, getPermissons, createTiposOperacionesQuirurgicas);
  router.put("/tipos-operaciones-quirurgicas/:id", verifyToken, getPermissons, updateTiposOperacionesQuirurgicas);
  router.delete("/tipos-operaciones-quirurgicas/:id", verifyToken, getPermissons, deleteTiposOperacionesQuirurgicas);
  router.patch("/tipos-operaciones-quirurgicas/:id/soft-delete", verifyToken, getPermissons, softDeleteTiposOperacionesQuirurgicas);

  // Rutas de Exámenes Médicos
  router.get("/examenes-medicos", verifyToken, getPermissons, findExamenesMedicos);
  router.get("/examenes-medicos/:id", verifyToken, getPermissons, findExamenesMedicosById);
  router.post("/examenes-medicos", verifyToken, getPermissons, createExamenesMedicos);
  router.put("/examenes-medicos/:id", verifyToken, getPermissons, updateExamenesMedicos);
  router.delete("/examenes-medicos/:id", verifyToken, getPermissons, deleteExamenesMedicos);
  router.patch("/examenes-medicos/:id/soft-delete", verifyToken, getPermissons, softDeleteExamenesMedicos);

  // Rutas de Fichas Médicas
  router.get("/fichas-medicas", verifyToken, getPermissons, findFichasMedicas);
  router.get("/fichas-medicas/:id", verifyToken, getPermissons, findFichasMedicasById);
  router.post("/fichas-medicas", verifyToken, getPermissons, createFichasMedicas);
  router.put("/fichas-medicas/:id", verifyToken, getPermissons, updateFichasMedicas);
  router.delete("/fichas-medicas/:id", verifyToken, getPermissons, deleteFichasMedicas);
  router.patch("/fichas-medicas/:id/soft-delete", verifyToken, getPermissons, softDeleteFichasMedicas);

  // Rutas de Consultas Médicas
  router.get("/consultas-medicas", verifyToken, getPermissons, findConsultasMedicas);
  router.get("/consultas-medicas/:id", verifyToken, getPermissons, findConsultasMedicasById);
  router.post("/consultas-medicas", verifyToken, getPermissons, createConsultasMedicas);
  router.put("/consultas-medicas/:id", verifyToken, getPermissons, updateConsultasMedicas);
  router.delete("/consultas-medicas/:id", verifyToken, getPermissons, deleteConsultasMedicas);
  router.patch("/consultas-medicas/:id/soft-delete", verifyToken, getPermissons, softDeleteConsultasMedicas);

  // Rutas de Recetas Médicas
  router.get("/recetas-medicas", verifyToken, getPermissons, findRecetasMedicas);
  router.get("/recetas-medicas/:id", verifyToken, getPermissons, findRecetasMedicasById);
  router.post("/recetas-medicas", verifyToken, getPermissons, createRecetasMedicas);
  router.put("/recetas-medicas/:id", verifyToken, getPermissons, updateRecetasMedicas);
  router.delete("/recetas-medicas/:id", verifyToken, getPermissons, deleteRecetasMedicas);
  router.patch("/recetas-medicas/:id/soft-delete", verifyToken, getPermissons, softDeleteRecetasMedicas);

  // Rutas de Medicamentos
  router.get("/medicamentos", verifyToken, getPermissons, findMedicamentos);
  router.get("/medicamentos/:id", verifyToken, getPermissons, findMedicamentosById);
  router.post("/medicamentos", verifyToken, getPermissons, createMedicamentos);
  router.put("/medicamentos/:id", verifyToken, getPermissons, updateMedicamentos);
  router.delete("/medicamentos/:id", verifyToken, getPermissons, deleteMedicamentos);
  router.patch("/medicamentos/:id/soft-delete", verifyToken, getPermissons, softDeleteMedicamentos);

  // Rutas de Paciente-Adicciones
  router.get("/paciente-adicciones", verifyToken, getPermissons, findPacienteAdicciones);
  router.get("/paciente-adicciones/:id", verifyToken, getPermissons, findPacienteAdiccionesById);
  router.post("/paciente-adicciones", verifyToken, getPermissons, createPacienteAdicciones);
  router.put("/paciente-adicciones/:id", verifyToken, getPermissons, updatePacienteAdicciones);
  router.delete("/paciente-adicciones/:id", verifyToken, getPermissons, deletePacienteAdicciones);
  router.patch("/paciente-adicciones/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteAdicciones);

  // Rutas de Paciente-Obstétricos/Ginecológicos
  router.get("/paciente-obstetricos-ginecologicos", verifyToken, getPermissons, findPacienteObstetricosGinecologicos);
  router.get("/paciente-obstetricos-ginecologicos/:id", verifyToken, getPermissons, findPacienteObstetricosGinecologicosById);
  router.post("/paciente-obstetricos-ginecologicos", verifyToken, getPermissons, createPacienteObstetricosGinecologicos);
  router.put("/paciente-obstetricos-ginecologicos/:id", verifyToken, getPermissons, updatePacienteObstetricosGinecologicos);
  router.delete("/paciente-obstetricos-ginecologicos/:id", verifyToken, getPermissons, deletePacienteObstetricosGinecologicos);
  router.patch("/paciente-obstetricos-ginecologicos/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteObstetricosGinecologicos);

  // Rutas de Paciente-Operaciones
  router.get("/paciente-operaciones", verifyToken, getPermissons, findPacienteOperaciones);
  router.get("/paciente-operaciones/:id", verifyToken, getPermissons, findPacienteOperacionesById);
  router.post("/paciente-operaciones", verifyToken, getPermissons, createPacienteOperaciones);
  router.put("/paciente-operaciones/:id", verifyToken, getPermissons, updatePacienteOperaciones);
  router.delete("/paciente-operaciones/:id", verifyToken, getPermissons, deletePacienteOperaciones);
  router.patch("/paciente-operaciones/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteOperaciones);

  // Rutas de Recetas-Medicamentos
  router.get("/recetas-medicamentos", verifyToken, getPermissons, findRecetasMedicamentos);
  router.get("/recetas-medicamentos/:id", verifyToken, getPermissons, findRecetasMedicamentosById);
  router.post("/recetas-medicamentos", verifyToken, getPermissons, createRecetasMedicamentos);
  router.put("/recetas-medicamentos/:id", verifyToken, getPermissons, updateRecetasMedicamentos);
  router.delete("/recetas-medicamentos/:id", verifyToken, getPermissons, deleteRecetasMedicamentos);
  router.patch("/recetas-medicamentos/:id/soft-delete", verifyToken, getPermissons, softDeleteRecetasMedicamentos);

  // Rutas de Paciente-Exámenes
  router.get("/paciente-examenes", verifyToken, getPermissons, findPacienteExamenes);
  router.get("/paciente-examenes/:id", verifyToken, getPermissons, findPacienteExamenesById);
  router.post("/paciente-examenes", verifyToken, getPermissons, createPacienteExamenes);
  router.put("/paciente-examenes/:id", verifyToken, getPermissons, updatePacienteExamenes);
  router.delete("/paciente-examenes/:id", verifyToken, getPermissons, deletePacienteExamenes);
  router.patch("/paciente-examenes/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteExamenes);

  router.get("/especialidades", verifyToken, getPermissons, findEspecialidades);
  router.get("/especialidades/:id", verifyToken, getPermissons, findEspecialidadesById);
  router.post("/especialidades", verifyToken, getPermissons, createEspecialidades);
  router.put("/especialidades/:id", verifyToken, getPermissons, updateEspecialidades);
  router.delete("/especialidades/:id", verifyToken, getPermissons, deleteEspecialidades);
  router.patch("/especialidades/:id/soft-delete", verifyToken, getPermissons, softDeleteEspecialidades);



  return router;
};