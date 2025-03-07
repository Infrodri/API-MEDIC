import { loginUser,  logoutUser,  registerUser } from "@controllers/auth/authControllers";
import { createRoles, deleteRoles, findRoles, findRolesById,  updateRoles } from "@controllers/rolesControllers";
import { createUser, deleteUser, findUsers, findUsersById,  updateUser } from "@controllers/usersControllers";
import { createTiposAdiccion, deleteTiposAdiccion, findTiposAdicciones, findTiposAdiccionById, softDeleteTiposAdiccion, updateTiposAdiccion } from "@controllers/tiposAdiccionesControllers";
import { createExamenesMedicos, deleteExamenesMedicos, findExamenesMedicos, findExamenesMedicosById, softDeleteExamenesMedicos, updateExamenesMedicos } from "@controllers/examenesMedicosControllers";
import { createFichaMedica,  findFichasMedicas,  findFichaMedicaById,  findFichasMedicasByPaciente,  updateFichaMedica,  deleteFichaMedica,  softDeleteFichaMedica } from "@controllers/fichasMedicasControllers";
import { createRecetasMedicas, deleteRecetasMedicas, findRecetasMedicas, findRecetasMedicasById, softDeleteRecetasMedicas, updateRecetasMedicas } from "@controllers/recetasMedicasControllers";
import { createMedicamentos, deleteMedicamentos, findMedicamentos, findMedicamentosById, softDeleteMedicamentos, updateMedicamentos } from "@controllers/medicamentosControllers";
import {  createPacienteAdicciones,  findPacienteAdicciones,  findPacienteAdiccionesById,  findPacienteAdiccionesByPaciente,  updatePacienteAdicciones,  deletePacienteAdicciones,  softDeletePacienteAdicciones} from "@controllers/pacienteAdiccionesControllers";
import {  createPacienteObstetricoGinecologico,  deletePacienteObstetricoGinecologico,  findPacienteObstetricosGinecologicos,  findPacienteObstetricoGinecologicoById,  findPacienteObstetricosGinecologicosByPaciente,  softDeletePacienteObstetricoGinecologico,  updatePacienteObstetricoGinecologico} from "@controllers/pacienteObstetricosGinecologicosControllers";
import {  createPacienteOperacion,  deletePacienteOperacion,  findPacienteOperaciones,  findPacienteOperacionById,  findPacienteOperacionesByPaciente,  softDeletePacienteOperacion,  updatePacienteOperacion} from "@controllers/pacienteOperacionesControllers";
import { createRecetasMedicamentos, deleteRecetasMedicamentos, findRecetasMedicamentos, findRecetasMedicamentosById, softDeleteRecetasMedicamentos, updateRecetasMedicamentos } from "@controllers/recetasMedicamentosControllers";
import {  createPacienteExamenes,  deletePacienteExamenes,  findPacienteExamenes,  findPacienteExamenesById,    softDeletePacienteExamenes,  updatePacienteExamenes,} from "@controllers/pacienteExamenesControllers";
import { createEspecialidades, deleteEspecialidades, findEspecialidades, findEspecialidadesById, softDeleteEspecialidades, updateEspecialidades } from "@controllers/especialidadesControllers";
import { createMedico,  deleteMedico, exportSessionHistory, findMedicoById, findMedicos, getActiveDoctorsToday, getDoctorsBySpecialty, getDoctorsBySpecialtyId, getDoctorsByUserId, getDoctorsWithMultipleSpecialties, getTotalDoctors, softDeleteMedico, updateMedico } from "@controllers/medicosControllers";
import { createTiposObstetricosGinecologicos, deleteTiposObstetricosGinecologicos, findTiposObstetricosGinecologicos, findTiposObstetricosGinecologicosById, softDeleteTiposObstetricosGinecologicos, updateTiposObstetricosGinecologicos } from "@controllers/tiposObstetricosGinecologicosControllers";
import { createTiposOperacionesQuirurgicas, deleteTiposOperacionesQuirurgicas, findTiposOperacionesQuirurgicas, findTiposOperacionesQuirurgicasById, softDeleteTiposOperacionesQuirurgicas, updateTiposOperacionesQuirurgicas } from "@controllers/tiposOperacionesQuirurgicasControllers";
import { createPaciente, deletePaciente, findPacienteById, findPacientes, findPacientesByEstadoAtencion, getHistorialMedico, softDeletePaciente, updatePaciente } from "@controllers/pacientesControllers";
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
import { Router } from "express";
import {  getPermissons, verifyToken } from "middlewares/auth";
import { checkRoles } from "middlewares/roles";

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
router.get("/tiposadicciones", verifyToken, getPermissons, findTiposAdicciones);
router.get("/tiposadicciones/:id", verifyToken, getPermissons, findTiposAdiccionById);
router.post("/tiposadicciones", verifyToken, getPermissons, createTiposAdiccion);
router.put("/tiposadicciones/:id", verifyToken, getPermissons, updateTiposAdiccion);
router.delete("/tiposadicciones/:id", verifyToken, getPermissons, deleteTiposAdiccion);
router.patch("/tiposadicciones/:id/soft-delete", verifyToken, getPermissons, softDeleteTiposAdiccion);


  // Rutas de Tipos Obstétricos Ginecológicos
  router.get("/tiposobstetricosginecologicos", verifyToken, getPermissons, findTiposObstetricosGinecologicos);
  router.get("/tiposobstetricosginecologicos/:id", verifyToken, getPermissons, findTiposObstetricosGinecologicosById);
  router.post("/tiposobstetricosginecologicos", verifyToken, getPermissons, createTiposObstetricosGinecologicos);
  router.put("/tiposobstetricosginecologicos/:id", verifyToken, getPermissons, updateTiposObstetricosGinecologicos);
  router.delete("/tiposobstetricosginecologicos/:id", verifyToken, getPermissons, deleteTiposObstetricosGinecologicos);
  router.patch("/tiposobstetricosginecologicos/:id/soft-delete", verifyToken, getPermissons, softDeleteTiposObstetricosGinecologicos);

  // Rutas de Tipos de Operaciones Quirúrgicas
  router.get("/tiposoperacionesquirurgicas", verifyToken, getPermissons, findTiposOperacionesQuirurgicas);
  router.get("/tiposoperacionesquirurgicas/:id", verifyToken, getPermissons, findTiposOperacionesQuirurgicasById);
  router.post("/tiposoperacionesquirurgicas", verifyToken, getPermissons, createTiposOperacionesQuirurgicas);
  router.put("/tiposoperacionesquirurgicas/:id", verifyToken, getPermissons, updateTiposOperacionesQuirurgicas);
  router.delete("/tiposoperacionesquirurgicas/:id", verifyToken, getPermissons, deleteTiposOperacionesQuirurgicas);
  router.patch("/tiposoperacionesquirurgicas/:id/soft-delete", verifyToken, getPermissons, softDeleteTiposOperacionesQuirurgicas);

  // Rutas de Exámenes Médicos
  router.get("/examenesmedicos", verifyToken, getPermissons, findExamenesMedicos);
  router.get("/examenesmedicos/:id", verifyToken, getPermissons, findExamenesMedicosById);
  router.post("/examenesmedicos", verifyToken, getPermissons, createExamenesMedicos);
  router.put("/examenesmedicos/:id", verifyToken, getPermissons, updateExamenesMedicos);
  router.delete("/examenesmedicos/:id", verifyToken, getPermissons, deleteExamenesMedicos);
  router.patch("/examenesmedicos/:id/soft-delete", verifyToken, getPermissons, softDeleteExamenesMedicos);

  // Rutas de Fichas Médicas
  router.get("/fichasmedicas", verifyToken, getPermissons, findFichasMedicas);
  router.get("/fichasmedicas/:id", verifyToken, getPermissons, findFichaMedicaById);
  router.get("/fichasmedicas/paciente/:pacienteId", verifyToken, getPermissons, findFichasMedicasByPaciente);
  router.post("/fichasmedicas", verifyToken, getPermissons, createFichaMedica);
  router.put("/fichasmedicas/:id", verifyToken, getPermissons, updateFichaMedica);
  router.delete("/fichasmedicas/:id", verifyToken, getPermissons, deleteFichaMedica);
  router.patch("/fichasmedicas/:id/soft-delete", verifyToken, getPermissons, softDeleteFichaMedica);


// Rutas de ConsultasMedicas
router.post("/consultas-medicas", verifyToken, getPermissons, createConsultasMedicas);
router.get("/consultas-medicas", verifyToken, getPermissons, findConsultasMedicas);
router.get("/consultas-medicas/:id", verifyToken, getPermissons, findConsultasMedicasById);
router.get("/consultas-medicas/paciente/:pacienteId", verifyToken, getPermissons, findConsultasMedicasByPaciente);
router.put("/consultas-medicas/:id", verifyToken, getPermissons, updateConsultasMedicas);
router.delete("/consultas-medicas/:id", verifyToken, getPermissons, deleteConsultasMedicas);
router.patch("/consultas-medicas/:id/soft-delete", verifyToken, getPermissons, softDeleteConsultasMedicas);
router.patch("/consultas-medicas/:id/conclude", verifyToken, getPermissons, concludeConsulta);
router.patch("/consultas-medicas/:id/derive", verifyToken, getPermissons, deriveConsulta);
router.patch("/consultas-medicas/:id/reassign", verifyToken, getPermissons, reassignConsulta);

  // Rutas de Recetas Médicas
  router.get("/recetasmedicas", verifyToken, getPermissons, findRecetasMedicas);
  router.get("/recetasmedicas/:id", verifyToken, getPermissons, findRecetasMedicasById);
  router.post("/recetasmedicas", verifyToken, getPermissons, createRecetasMedicas);
  router.put("/recetasmedicas/:id", verifyToken, getPermissons, updateRecetasMedicas);
  router.delete("/recetasmedicas/:id", verifyToken, getPermissons, deleteRecetasMedicas);
  router.patch("/recetasmedicas/:id/soft-delete", verifyToken, getPermissons, softDeleteRecetasMedicas);

  // Rutas de Medicamentos
  router.get("/medicamentos", verifyToken, getPermissons, findMedicamentos);
  router.get("/medicamentos/:id", verifyToken, getPermissons, findMedicamentosById);
  router.post("/medicamentos", verifyToken, getPermissons, createMedicamentos);
  router.put("/medicamentos/:id", verifyToken, getPermissons, updateMedicamentos);
  router.delete("/medicamentos/:id", verifyToken, getPermissons, deleteMedicamentos);
  router.patch("/medicamentos/:id/soft-delete", verifyToken, getPermissons, softDeleteMedicamentos);

// Rutas de Paciente-Adicciones
router.get("/pacienteadicciones", verifyToken, getPermissons, findPacienteAdicciones);
router.get("/pacienteadicciones/:id", verifyToken, getPermissons, findPacienteAdiccionesById);
router.get("/pacienteadicciones/paciente/:pacienteId", verifyToken, getPermissons, findPacienteAdiccionesByPaciente);
router.post("/pacienteadicciones", verifyToken, getPermissons, createPacienteAdicciones);
router.put("/pacienteadicciones/:id", verifyToken, getPermissons, updatePacienteAdicciones);
router.delete("/pacienteadicciones/:id", verifyToken, getPermissons, deletePacienteAdicciones);
router.patch("/pacienteadicciones/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteAdicciones);


  // Rutas de Paciente-Obstétricos/Ginecológicos
  router.get("/paciente-obstetricos-ginecologicos", verifyToken, getPermissons, findPacienteObstetricosGinecologicos);
  router.get("/paciente-obstetricos-ginecologicos/:id", verifyToken, getPermissons, findPacienteObstetricoGinecologicoById);
  router.get("/paciente-obstetricos-ginecologicos/paciente/:pacienteId", verifyToken, getPermissons, findPacienteObstetricosGinecologicosByPaciente);
  router.post("/paciente-obstetricos-ginecologicos", verifyToken, getPermissons, createPacienteObstetricoGinecologico);
  router.put("/paciente-obstetricos-ginecologicos/:id", verifyToken, getPermissons, updatePacienteObstetricoGinecologico);
  router.delete("/paciente-obstetricos-ginecologicos/:id", verifyToken, getPermissons, deletePacienteObstetricoGinecologico);
  router.patch("/paciente-obstetricos-ginecologicos/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteObstetricoGinecologico);

  // Rutas de Paciente-Operaciones
  router.get("/pacienteoperaciones", verifyToken, getPermissons, findPacienteOperaciones);
  router.get("/pacienteoperaciones/:id", verifyToken, getPermissons, findPacienteOperacionById);
  router.get("/pacienteoperaciones/paciente/:pacienteId", verifyToken, getPermissons, findPacienteOperacionesByPaciente);
  router.post("/pacienteoperaciones", verifyToken, getPermissons, createPacienteOperacion);
  router.put("/pacienteoperaciones/:id", verifyToken, getPermissons, updatePacienteOperacion);
  router.delete("/pacienteoperaciones/:id", verifyToken, getPermissons, deletePacienteOperacion);
  router.patch("/pacienteoperaciones/:id/soft-delete", verifyToken, getPermissons, softDeletePacienteOperacion);

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