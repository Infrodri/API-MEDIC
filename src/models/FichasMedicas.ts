// src/models/FichasMedicas.ts
import { Schema, model } from "mongoose";
import { FichasMedicas } from "types/FichasMedicasTypes";

const fichasMedicasSchema = new Schema<FichasMedicas>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true, unique: true },
    antecedentesPersonales: { type: Schema.Types.ObjectId, ref: "AntecedentesPersonales" },
    antecedentesFamiliares: { type: Schema.Types.ObjectId, ref: "AntecedentesFamiliares" },
    operacionesQuirurgicas: [{ type: Schema.Types.ObjectId, ref: "PacienteOperacion" }],
    ginecologiaObstetrica: [{ type: Schema.Types.ObjectId, ref: "PacienteObstetricoGinecologico" }],
    adicciones: [{ type: Schema.Types.ObjectId, ref: "PacienteAdiccion" }],
    exploracionFisica: { type: Schema.Types.ObjectId, ref: "ExploracionFisica" },
    examenNeurologico: { type: Schema.Types.ObjectId, ref: "ExamenNeurologico" },
    organosSentidos: { type: Schema.Types.ObjectId, ref: "OrganosSentidos" },
    consultasMedicas: [{ type: Schema.Types.ObjectId, ref: "ConsultasMedicas" }],
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true }
);

fichasMedicasSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente,
    antecedentesPersonales: this.antecedentesPersonales,
    antecedentesFamiliares: this.antecedentesFamiliares,
    operacionesQuirurgicas: this.operacionesQuirurgicas,
    ginecologiaObstetrica: this.ginecologiaObstetrica,
    adicciones: this.adicciones,
    exploracionFisica: this.exploracionFisica,
    examenNeurologico: this.examenNeurologico,
    organosSentidos: this.organosSentidos,
    consultasMedicas: this.consultasMedicas,
    estado: this.estado,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const FichasMedicasModel = model<FichasMedicas>("FichasMedicas", fichasMedicasSchema);