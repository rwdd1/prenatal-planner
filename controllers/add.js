const User = require("../models/User");
const Appointment = require("../models/Appointment");

module.exports = {
    loadAdd: async (req, res) => {
        try {
            const locations = process.env.LOCATIONS.split(" ");
            const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"]
            const alerts = { errors: [], success: [] };
            res.render("add.ejs", { user: req.user, locations: locations, times: times, alerts: alerts });
        } catch(err) {
            console.log(err);
        }
    },
    addSingleAppointment: async (req, res) => {
        try {
            const locations = process.env.LOCATIONS.split(" ");
            const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"]
            const date = new Date(req.body.date);
            const timeSlotTaken = await Appointment.countDocuments({ appointmentDate: date, appointmentTime: req.body.time, attendanceStatus: "Not Seen", location: req.body.location });
            const patientBooked = await Appointment.countDocuments({ appointmentDate: date, mrn: req.body.mrn, attendanceStatus: "Not Seen", location: req.body.location });
            const alerts = { errors: [], success: [] };
             
            if (date < new Date(new Date().toISOString().split('T')[0])) alerts.errors.push("You cannot create an appointment in the past.")
            if (timeSlotTaken) alerts.errors.push(`The ${req.body.time} time slot on ${req.body.date} at ${req.body.location} has already been used. Please enter a different time.`)
            if (patientBooked) alerts.errors.push(`Patient ${req.body.mrn} already has an appointment at ${req.body.location} on this day.`)
            
            if (!alerts.errors.length) {
                const newAppointment = {
                    mrn: req.body.mrn,
                    forename: req.body.forename,
                    surname: req.body.surname,
                    tel: req.body.tel,
                    appointmentDate: date,
                    appointmentTime: req.body.time,
                    location: req.body.location
                }
            
                await Appointment.create(newAppointment);
                alerts.success.push("Appointment added successfully.")
            }
            
            res.render("add.ejs", { user: req.user, locations: locations, times: times, alerts: alerts })
        } catch(err) {
            console.log(err);
        }
    },
    addMultipleAppointments: async (req, res) => {
        try {
            const locations = process.env.LOCATIONS.split(" ");
            const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"]
            const alerts = { errors: [], success: [] };
            const newAppointments = [];
            const set = new Set();
            
            // get all fieldsets with a non-blank MRN
            for (const [key, value] of Object.entries(req.body)) {
                if ( value && key.includes("mrn") ) set.add(key.slice(3));  
                if (key.includes("date")) req.body[key] = new Date(value);
            }
            
            // clean data then store each fieldset in an object
            for (let value of set) {
                let date;
                
                const keys = Object.keys(req.body).filter( item => {
                    if ((+value < 10)) {
                        if (+item.at(-2) !== 1) return item.at(-1) === value;
                    } else if (+value >= 10) {
                        if (+item.at(-2) === 1) return item.slice(-2) === value;
                    }
                });
                
                const newAppointment = Object.keys(req.body).reduce( (accum, item) => {
                    if (keys.includes(item)) {
                        accum[item.replace(value, "")] = req.body[item];
                        if (item.includes("date")) date = new Date(req.body[item]);
                    }
                    return accum;
                }, {})
                
                if (!newAppointment["mrn"]) alerts.errors.push("Please ensure all entries include a hospital number.");
                if (!newAppointment["forename"]) alerts.errors.push("Please ensure all entries include a forename.");
                if (!newAppointment["surname"]) alerts.errors.push("Please ensure all entries include a surname.");
                if (!newAppointment["time"]) alerts.errors.push("Please ensure all entries include a time.");
                if (!newAppointment["location"]) alerts.errors.push("Please ensure all entries include a location.");
                if (date < new Date(new Date().toISOString().split('T')[0])) alerts.errors.push("You cannot create an appointment in the past.")
              
                if (alerts.errors.length) return res.render("add.ejs", { user: req.user, locations: locations, times: times, alerts: alerts })
                
                newAppointments.push(newAppointment);
            }
            
            // more data cleaning then add each fieldset to db
            let insertCount = 0;
            let rejectCount = 0;
            
            loop1: for (let appointment of newAppointments) {
                const newAppointment = {
                    mrn: appointment.mrn,
                    forename: appointment.forename,
                    surname: appointment.surname,
                    tel: appointment.tel,
                    appointmentDate: appointment.date,
                    appointmentTime: appointment.time,
                    location: appointment.location
                }
            
                const timeSlotTaken = await Appointment.countDocuments({ appointmentDate: appointment.date, appointmentTime: appointment.time, attendanceStatus: "Not Seen", location: appointment.location });
                const patientBooked = await Appointment.countDocuments({ appointmentDate: appointment.date, mrn: appointment.mrn, attendanceStatus: "Not Seen", location: appointment.location });
            
                if (timeSlotTaken) {
                    alerts.errors.push(`The ${appointment.time} time slot on ${appointment.date.toISOString().split('T')[0]} at ${appointment.location} has already been used. Please enter a different time.`);
                    rejectCount++;
                    continue loop1;
                }
                
                if (patientBooked) {
                    alerts.errors.push(`Patient ${appointment.mrn} already has an appointment at ${appointment.location} on this day.`);
                    rejectCount++;
                    continue loop1;
                }
                
                insertCount++;
                await Appointment.create(newAppointment);
            }

            (alerts.errors.length) ? alerts.success.push(`${insertCount} appointments added successfully, ${rejectCount} rejected. Please address the errors listed above.`) : alerts.success.push(`${insertCount} appointments added successfully.`);
                
            res.render("add.ejs", { user: req.user, locations: locations, times: times, alerts: alerts });
        
        } catch(err) {
            console.log(err);
        }
    }
}