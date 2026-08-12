const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            default: "My Resume"
        },

        template: {
            type: String,
            enum: ["modern", "professional", "minimal"],
            default: "modern"
        },

        name: {
            type: String,
            default: ""
        },

        role: {
            type: String,
            default: ""
        },

        email: {
            type: String,
            default: ""
        },

        phone: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        github: {
            type: String,
            default: ""
        },

        linkedin: {
            type: String,
            default: ""
        },

        portfolio: {
            type: String,
            default: ""
        },

        summary: {
            type: String,
            default: ""
        },

        skills: {
            type: String,
            default: ""
        },

        education: {
            type: String,
            default: ""
        },

        experience: {
            type: String,
            default: ""
        },

        projects: {
            type: String,
            default: ""
        },

        certifications: {
            type: String,
            default: ""
        },

        achievements: {
            type: String,
            default: ""
        },

        languages: {
            type: String,
            default: ""
        }
    },

    {
        timestamps: true
    }
);


const Resume =
    mongoose.models.Resume ||
    mongoose.model("Resume", resumeSchema);


module.exports = Resume;