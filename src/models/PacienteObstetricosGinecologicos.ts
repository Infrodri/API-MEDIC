// src/models/PacienteObstetricosGinecologicos.ts
import mongoose, { Schema } from "mongoose";
import { PacienteObstetricoGinecologico } from "types/PacienteObstetricosGinecologicosTypes";

const PacienteObstetricoGinecologicoSchema: Schema = new Schema<PacienteObstetricoGinecologico>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente",
      required: [true, "El paciente es obligatorio"],
    },
    tipoObstetricoGinecologico: {
      type: Schema.Types.ObjectId,
      ref: "TiposObstetricosGinecologicos",
      required: [true, "El tipo obstétrico/ginecológico es obligatorio"],
    },
    embarazos: {
      type: String,
      trim: true,
      default: "",
    },
    partos: {
      type: String,
      trim: true,
      default: "",
    },
    abortos: {
      type: String,
      trim: true,
      default: "",
    },
    cesareas: {
      type: String,
      trim: true,
      default: "",
    },
    menarca: {
      type: String,
      trim: true,
      default: "",
    },
    cicloMenstrual: {
      type: String,
      trim: true,
      default: "",
    },
     fechaEvento: {
      type: Date,
      required: [true, "La fecha del evento es obligatoria"],
    },
    observaciones: {
      type: String,
      trim: true,
      default: "",
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PacienteObstetricoGinecologicoSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente? { primerNombre: this.paciente.primerNombre, primerApellido: this.paciente.primerApellido } : null,
    tipoObstetricoGinecologico: this.tipoObstetricoGinecologico? {nombreObstetricoGinecologico: this.tipoObstetricoGinecologico, descripcion: this.tipoObstetricoGinecologico.descripcion} : null,
  embarazos: this.embarazos,
  partos: this.partos ,
  abortos: this.abortos ,
  cesareas: this.cesareas ,
  menarca: this.menarca ,
  cicloMenstrual: this.cicloMenstrual ,
  fechaEvento: this.fechaEvento ,
  observaciones: this.observaciones ,
  estado: this.estado,
  };
};

export const PacienteObstetricoGinecologicoModel = mongoose.model<PacienteObstetricoGinecologico>("PacienteObstetricoGinecologico", PacienteObstetricoGinecologicoSchema);