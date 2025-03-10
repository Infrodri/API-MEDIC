// src/models/FichasMedicas.ts
import { Schema, model, Types } from "mongoose";
import { FichasMedicas } from "types/FichasMedicasTypes";

const fichasMedicasSchema = new Schema<FichasMedicas>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    antecedentesPersonales: { type: Schema.Types.ObjectId, ref: "AntecedentesPersonales" },
    operacionesQuirurgicas: [{ type: Schema.Types.ObjectId, ref: "PacienteOperaciones" }],
    ginecologiaObstetrica: { type: Schema.Types.ObjectId, ref: "PacienteObstetricosGinecologicos" },
    adicciones: [{ type: Schema.Types.ObjectId, ref: "PacienteAdicciones" }],
    exploracionFisica: { type: Schema.Types.ObjectId, ref: "ExploracionFisica" },
    examenNeurologico: { type: Schema.Types.ObjectId, ref: "ExamenNeurologico" },
    organosSentidos: { type: Schema.Types.ObjectId, ref: "OrganosSentidos" },
    consultasMedicas: [{ type: Schema.Types.ObjectId, ref: "ConsultasMedicas" }],
  },
  { timestamps: true }
);

export const FichasMedicasModel = model<FichasMedicas>("FichasMedicas", fichasMedicasSchema);