import mongoose, { Schema } from "mongoose";
import { RecetasMedicamentos } from "types/RecetasMedicamentosTypes";

const RecetasMedicamentosSchema: Schema = new Schema<RecetasMedicamentos>(
  {
    receta: {
      type: Schema.Types.ObjectId,
      ref: "RecetasMedicas", // Relación con RecetasMedicas
      required: [true, "La receta es obligatoria"],
    },
    medicamento: {
      type: Schema.Types.ObjectId,
      ref: "Medicamentos", // Relación con Medicamentos
      required: [true, "El medicamento es obligatorio"],
    },
    dosis: {
      type: String,
      required: [true, "La dosis es obligatoria"],
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

// Method to get basic recetas-medicamentos info (for the list)
RecetasMedicamentosSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    receta: this.receta,
    medicamento: this.medicamento,
    dosis: this.dosis,
    estado: this.estado,
  };
};

export const RecetasMedicamentosModel = mongoose.model<RecetasMedicamentos>("RecetasMedicamentos", RecetasMedicamentosSchema);