import { loginUser,  logoutUser,  registerUser } from "@controllers/auth/authControllers";
import { createRoles, deleteRoles, findRoles, findRolesById,  updateRoles } from "@controllers/rolesControllers";
import { createUser, deleteUser, findUsers, findUsersById,  updateUser } from "@controllers/usersControllers";
import {
  createPaciente,
  deletePaciente,
  findPacientes,
  findPacienteById,
  findPacientesByEstadoAtencion,
  softDeletePaciente,
  updatePaciente,
  getHistorialMedico,
} from "@controllers/pacientesControllers";
import { createTiposAdiccion, deleteTiposAdiccion, findTiposAdicciones, findTiposAdiccionById, softDeleteTiposAdiccion, updateTiposAdiccion } from "@controllers/tiposAdiccionesControllers";
import { createTiposObstetricosGinecologicos, deleteTiposObstetricosGinecologicos, findTiposObstetricosGinecologicos, findTiposObstetricosGinecologicosById, softDeleteTiposObstetricosGinecologicos, updateTiposObstetricosGinecologicos } from "@controllers/tiposObstetricosGinecologicosControllers";
import { createTiposOperacionesQuirurgicas, deleteTiposOperacionesQuirurgicas, findTiposOperacionesQuirurgicas, findTiposOperacionesQuirurgicasById, softDeleteTiposOperacionesQuirurgicas, updateTiposOperacionesQuirurgicas } from "@controllers/tiposOperacionesQuirurgicasControllers";
import { createExamenesMedicos, deleteExamenesMedicos, findExamenesMedicos, findExamenesMedicosById, softDeleteExamenesMedicos, updateExamenesMedicos } from "@controllers/examenesMedicosControllers";
import { createFichasMedicas, deleteFichasMedicas, findFichasMedicas, findFichasMedicasById, softDeleteFichasMedicas, updateFichasMedicas } from "@controllers/fichasMedicasControllers";
import {
  createConsultasMedicas,
  findConsultasMedicas,
  findConsultasMedicasById,
  findConsultasMedicasByPaciente,
  updateConsultasMedicas,
  deleteConsultasMedicas,
  softDeleteConsultasMedicas,
  concludeConsulta,
  deriveConsulta,
  reassignConsulta,
} from "@controllers/consultasMedicasControllers";

import { createRecetasMedicas, deleteRecetasMedicas, findRecetasMedicas, findRecetasMedicasById, softDeleteRecetasMedicas, updateRecetasMedicas } from "@controllers/recetasMedicasControllers";
import { createMedicamentos, deleteMedicamentos, findMedicamentos, findMedicamentosById, softDeleteMedicamentos, updateMedicamentos } from "@controllers/medicamentosControllers";
import {
  createPacienteAdiccion,
  deletePacienteAdiccion,
  findPacienteAdicciones,
  findPacienteAdiccionById,
  findPacienteAdiccionesByPaciente,
  softDeletePacienteAdiccion,
  updatePacienteAdiccion,
} from "@controllers/pacienteAdiccionesControllers";
import {
  createPacienteObstetricoGinecologico,
  deletePacienteObstetricoGinecologico,
  findPacienteObstetricosGinecologicos,
  findPacienteObstetricoGinecologicoById,
  findPacienteObstetricosGinecologicosByPaciente,
  softDeletePacienteObstetricoGinecologico,
  updatePacienteObstetricoGinecologico,
} from "@controllers/pacienteObstetricosGinecologicosControllers";
import {
  createPacienteOperacion,
  deletePacienteOperacion,
  findPacienteOperaciones,
  findPacienteOperacionById,
  findPacienteOperacionesByPaciente,
  softDeletePacienteOperacion,
  updatePacienteOperacion,
} from "@controllers/pacienteOperacionesControllers";
import { createRecetasMedicamentos, deleteRecetasMedicamentos, findRecetasMedicamentos, findRecetasMedicamentosById, softDeleteRecetasMedicamentos, updateRecetasMedicamentos } from "@controllers/recetasMedicamentosControllers";
import {
  createPacienteExamen,
  deletePacienteExamen,
  findPacienteExamenes,
  findPacienteExamenById,
  findPacienteExamenesByPaciente,
  softDeletePacienteExamen,
  updatePacienteExamen,
} from "@controllers/pacienteExamenesControllers";
import { createEspecialidades, deleteEspecialidades, findEspecialidades, findEspecialidadesById, softDeleteEspecialidades, updateEspecialidades } from "@controllers/especialidadesControllers";
import { Router } from "express";
import { getPermissons, verifyToken } from "middlewares/auth";
import { checkRoles } from "middlewares/roles";
import { createMedico,  deleteMedico, exportSessionHistory, findMedicoById, findMedicos, getActiveDoctorsToday, getDoctorsBySpecialty, getDoctorsBySpecialtyId, getDoctorsByUserId, getDoctorsWithMultipleSpecialties, getTotalDoctors, softDeleteMedico, updateMedico } from "@controllers/medicosControllers";

const router = Router();

export default () => {
  router.get("/health", (req, res) => {
    res.send("Api is Healthy!!!");
  });

// Auth Routes
router.post("/auth/register", checkRoles, registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", verifyToken, logoutUser);
  
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
router.get("/pacientes/estado/:estado", verifyToken, getPermissons, findPacientesByEstadoAtencion); // Nueva ruta
router.post("/pacientes", verifyToken, getPermissons, createPaciente);
router.put("/pacientes/:id", verifyToken, getPermissons, updatePaciente);
router.delete("/pacientes/:id", verifyToken, getPermissons, deletePaciente);
router.patch("/pacientes/:id/soft-delete", verifyToken, getPermissons, softDeletePaciente);
// Ruta para Historial Médico
router.get("/pacientes/:pacienteId/historial", verifyToken, getPermissons, getHistorialMedico);




// Rutas de Médicos (movidas bajo /medicos con middlewares)
router.get("/medicos/:medicoId/session-history", verifyToken, getPermissons, exportSessionHistory);
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
router.get("/consultas-medicas/paciente/:pacienteId", verifyToken, getPermissons, findConsultasMedicasByPaciente);
router.post("/consultas-medicas", verifyToken, getPermissons, createConsultasMedicas);
router.put("/consultas-medicas/:id", verifyToken, getPermissons, updateConsultasMedicas);
router.delete("/consultas-medicas/:id", verifyToken, getPermissons, deleteConsultasMedicas);
router.patch("/consultas-medicas/:id/soft-delete", verifyToken, getPermissons, softDeleteConsultasMedicas);
router.patch("/consultas-medicas/:id/conclude", verifyToken, getPermissons, concludeConsulta);
router.patch("/consultas-medicas/:id/derive", verifyToken, getPermissons, deriveConsulta);
router.patch("/consultas-medicas/:id/reassign", verifyToken, getPermissons, reassignConsulta);

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
  router.get("/paciente-adicciones/:id", verifyToken, getPermissons, findPacienteAdiccionById);
  router.get("/paciente-adicciones/paciente/:pacienteId", verifyToken, getPermissons, findPacienteAdiccionesByPaciente);
  router.post("/paciente-adicciones", verifyToken, getPermissons, createPacienteAdiccion);
  router.put("/paciente-adicciones/:id", verifyToken, getPermissons, updatePacienteAdiccion);
  router.delete("/paciente-adicciones/:id", verifyToken, getPermissons, deletePacienteAdiccion);
  router.patch("/paciente-adicciones/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteAdiccion);


  // Rutas de Paciente-Obstétricos/Ginecológicos
  router.get("/paciente-obstetricos-ginecologicos", verifyToken, getPermissons, findPacienteObstetricosGinecologicos);
  router.get("/paciente-obstetricos-ginecologicos/:id", verifyToken, getPermissons, findPacienteObstetricoGinecologicoById);
  router.get("/paciente-obstetricos-ginecologicos/paciente/:pacienteId", verifyToken, getPermissons, findPacienteObstetricosGinecologicosByPaciente);
  router.post("/paciente-obstetricos-ginecologicos", verifyToken, getPermissons, createPacienteObstetricoGinecologico);
  router.put("/paciente-obstetricos-ginecologicos/:id", verifyToken, getPermissons, updatePacienteObstetricoGinecologico);
  router.delete("/paciente-obstetricos-ginecologicos/:id", verifyToken, getPermissons, deletePacienteObstetricoGinecologico);
  router.patch("/paciente-obstetricos-ginecologicos/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteObstetricoGinecologico);

  // Rutas de Paciente-Operaciones
  router.get("/paciente-operaciones", verifyToken, getPermissons, findPacienteOperaciones);
  router.get("/paciente-operaciones/:id", verifyToken, getPermissons, findPacienteOperacionById);
  router.get("/paciente-operaciones/paciente/:pacienteId", verifyToken, getPermissons, findPacienteOperacionesByPaciente);
  router.post("/paciente-operaciones", verifyToken, getPermissons, createPacienteOperacion);
  router.put("/paciente-operaciones/:id", verifyToken, getPermissons, updatePacienteOperacion);
  router.delete("/paciente-operaciones/:id", verifyToken, getPermissons, deletePacienteOperacion);
  router.patch("/paciente-operaciones/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteOperacion);

  // Rutas de Recetas-Medicamentos
  router.get("/recetas-medicamentos", verifyToken, getPermissons, findRecetasMedicamentos);
  router.get("/recetas-medicamentos/:id", verifyToken, getPermissons, findRecetasMedicamentosById);
  router.post("/recetas-medicamentos", verifyToken, getPermissons, createRecetasMedicamentos);
  router.put("/recetas-medicamentos/:id", verifyToken, getPermissons, updateRecetasMedicamentos);
  router.delete("/recetas-medicamentos/:id", verifyToken, getPermissons, deleteRecetasMedicamentos);
  router.patch("/recetas-medicamentos/:id/soft-delete", verifyToken, getPermissons, softDeleteRecetasMedicamentos);

 // Rutas de Paciente-Exámenes
 router.get("/paciente-examenes", verifyToken, getPermissons, findPacienteExamenes);
 router.get("/paciente-examenes/:id", verifyToken, getPermissons, findPacienteExamenById);
 router.get("/paciente-examenes/paciente/:pacienteId", verifyToken, getPermissons, findPacienteExamenesByPaciente);
 router.post("/paciente-examenes", verifyToken, getPermissons, createPacienteExamen);
 router.put("/paciente-examenes/:id", verifyToken, getPermissons, updatePacienteExamen);
 router.delete("/paciente-examenes/:id", verifyToken, getPermissons, deletePacienteExamen);
 router.patch("/paciente-examenes/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteExamen);

  router.get("/especialidades", verifyToken, getPermissons, findEspecialidades);
  router.get("/especialidades/:id", verifyToken, getPermissons, findEspecialidadesById);
  router.post("/especialidades", verifyToken, getPermissons, createEspecialidades);
  router.put("/especialidades/:id", verifyToken, getPermissons, updateEspecialidades);
  router.delete("/especialidades/:id", verifyToken, getPermissons, deleteEspecialidades);
  router.patch("/especialidades/:id/soft-delete", verifyToken, getPermissons, softDeleteEspecialidades);



  return router;
};