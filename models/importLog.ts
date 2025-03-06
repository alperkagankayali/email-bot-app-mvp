import mongoose from "mongoose";

const importLogSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "error", "processing"],
      default: "processing",
    },
    totalRows: {
      type: Number,
      default: 0,
    },
    processedRows: {
      type: Number,
      default: 0,
    },
    failedRows: {
      type: Number,
      default: 0,
    },
    importErrors: [{
      row: Number,
      email: String,
      error: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

const ImportLog = mongoose.models.ImportLog || mongoose.model("ImportLog", importLogSchema);

export default ImportLog; 