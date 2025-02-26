import mongoose, { Schema } from "mongoose";
import { RecetasMedicas } from "types/RecetasMedicasTypes";

const RecetasMedicasSchema: Schema = new Schema<RecetasMedicas>(
  {
    consulta: {
      type: Schema.Types.ObjectId,
      ref: "ConsultasMedicas", // Relación con ConsultasMedicas
      required: [true, "La consulta es obligatoria"],
    },
    medicamentos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Medicamentos", // Relación con Medicamentos (array de referencias)
        required: [true, "Los medicamentos son obligatorios"],
      },
    ],
    fechaEmision: {
      type: Date,
      required: [true, "La fecha de emisión es obligatoria"],
      default: Date.now, // Fecha por defecto es la actual
    },
    instrucciones: {
      type: String,
      required: [true, "Las instrucciones son obligatorias"],
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

// Method to get basic recetas médicas info (for the list)
RecetasMedicasSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    consulta: this.consulta,
    medicamentos: this.medicamentos,
    fechaEmision: this.fechaEmision,
    estado: this.estado,
  };
};

export const RecetasMedicasModel = mongoose.model<RecetasMedicas>("RecetasMedicas", RecetasMedicasSchema);