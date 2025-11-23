const mongoose = require('mongoose');

const healthReportSchema = new mongoose.Schema({

  account_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: "AccountBranch", required: true },
  member_id: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },

  gender: { type: String, enum: ["MALE", "FEMALE"] },

  report_month: { type: String, required: true },

  height: {
    value: { type: Number, default: null },
    unit: { type: String, default: "cm" }
  },

  weight: {
    value: { type: Number, default: null },
    unit: { type: String, default: "kg" }
  },

  BMI: {
    value: { type: Number, default: null },
    unit: { type: String, default: "kg/m²" }
  },

  body_fat_percentage: Number,

  muscle_mass: {
    value: { type: Number, default: null },
    unit: { type: String, default: "kg" }
  },

  water_percentage: Number,

  male_parameters: {
    type: {
      chest: Number,
      waist: Number,
      biceps: Number,
      thigh: Number
    },
    default: null
  },

  female_parameters: {
    type: {
      bust: Number,
      waist: Number,
      hips: Number,
      thigh: Number
    },
    default: null
  },

  blood_pressure_systolic: Number,
  blood_pressure_diastolic: Number,
  heart_rate: Number,
  resting_metabolism: Number,
  BMR: Number,

  progress_notes: { type: String, default: "" },

}, { timestamps: true });


// Auto remove opposite gender fields
healthReportSchema.pre("save", function (next) {
  if (this.gender === "MALE") {
    this.female_parameters = null;
  }
  if (this.gender === "FEMALE") {
    this.male_parameters = null;
  }
  next();
});

const HealthReport = mongoose.model("HealthReport", healthReportSchema);
module.exports = HealthReport;