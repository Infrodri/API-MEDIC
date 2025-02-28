import mongoose, { Schema } from "mongoose";
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";

const ConsultasMedicasSchema: Schema = new Schema<ConsultasMedicas>(
  {
    paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' },
     medico: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico' },
    fichaMedica: { type: mongoose.Schema.Types.ObjectId, ref: 'FichasMedicas' },
    fecha: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
      default: Date.now, // Fecha por defecto es la actual
    },
    motivo: {
      type: String,
      required: [true, "El motivo es obligatorio"],
      trim: true,
    },
    observaciones: {
      type: String,
      required: [true, "Las observaciones son obligatorias"],
      trim: true,
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
    versionKey: false,
  }
);

// Method to get basic consultas médicas info (for the list)
ConsultasMedicasSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    paciente: this.paciente.nombre,
    medico: this.medico.primerApellido,
    fichaMedica: this.fichaMedica,
    fecha: this.fecha,
    estado: this.estado,
  };
};

export const ConsultasMedicasModel = mongoose.model<ConsultasMedicas>("ConsultasMedicas", ConsultasMedicasSchema);