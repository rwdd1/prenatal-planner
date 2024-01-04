const User = require("../models/User");
const Appointment = require("../models/Appointment");

module.exports = {
    loadSearch: async (req, res) => {
        try {
            const locations = process.env.LOCATIONS.split(" ");
            res.render("find.ejs", { user: req.user, locations: locations });
        } catch(err) {
            console.log(err);
        }
    },
    findAppointment: async (req, res) => {
        try {
            const startDate = new Date(req.body.date);            
            const appointments = await Appointment.find({ location: req.body.location, appointmentDate: startDate }).sort({ appointmentDate: 1, appointmentTime: 1 }).lean();
            const heading = "Appointments by date/location";
            const caption = `Results for ${req.body.date} at ${req.body.location}`;
            const noResult = (appointments.length) ? false : true;
            res.render("findResult.ejs", { user: req.user, appointments: appointments, heading: heading, caption: caption, noResult: noResult });
        } catch(err) {
            console.log(err);
        }
    },
    findPatient: async (req, res) => {
        try {          
            const appointments = await Appointment.find({ mrn: req.body.mrn }).sort({ appointmentDate: 1, appointmentTime: 1 }).lean();
            const heading = "Appointments by hospital number";
            const caption = `Results for patient ${req.body.mrn}`;
            const noResult = (appointments.length) ? false : true;
            res.render("findResult.ejs", { user: req.user, appointments: appointments, heading: heading, caption: caption, noResult: noResult });
        } catch(err) {
            console.log(err);
        }
    },
    editAppointment: async (req, res) => {
        try {
            let updated;
            
            if (req.body.gestationValue && req.body.gestationUnit) {
                const gestation = (req.body.gestationUnit.toLowerCase() === "weeks") ? req.body.gestationValue * 7 : req.body.gestationValue;
                await Appointment.updateOne({ _id: req.body.id }, { $set: { gestation: gestation }});
                updated = req.body.gestationValue;
            } else if (req.body.comment) {
                await Appointment.updateOne({ _id: req.body.id }, { $set: { comment: req.body.comment }});
                updated = req.body.comment;
            } else if (req.body.status) {
                (req.body.status.toLowerCase() === "seen") ? await Appointment.updateOne({ _id: req.body.id }, { $set: { attendanceStatus: req.body.status, seenBy: req.user.forename }}) : await Appointment.updateOne({ _id: req.body.id }, { $set: { attendanceStatus: req.body.status }});
                updated = req.body.status;
            } else {
                return res.status(500).end();
            }
            
            res.json(updated); 
        } catch(err) {
            res.status(500).end();
            console.log(err);
        }
    }
}