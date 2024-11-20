const Urgence = require('../../models/urgence/urgence');
const { Socket } = require('../../utils/socketjs');
const pointInPolygon = require('point-in-polygon');
const turf = require('@turf/turf');
const mongoose = require('mongoose');

const { 
    bizerteTunisCoordinates,
    tunisMonastirCoordinates,
    monastirGabesCoordinates,
    gabesZerzisCoordinates,
    tabarkaBizerteCoordinates,
    tabarkacapbonCoordinates 
} = require('../../utils/polygonData');

console.log("capbon polygon:",tabarkaBizerteCoordinates[0].length)


exports.getResponseTimes = async (req, res) => {
    try {
        const responseTimes = await Urgence.aggregate([
            {
                $project: {
                    responseTime: { $subtract: ["$responseAt", "$createdAt"] } // Assuming you have responseAt and createdAt fields
                }
            }
        ]);
        res.status(200).json(responseTimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add this to your controller/urgence/urgence.js

exports.findByType = async (req, res) => {
    const { type } = req.query; // Get the type from the query parameters

    try {
        if (!type) {
            return res.status(400).send({ message: "Type query parameter is required." });
        }

        const urgences = await Urgence.find({ type: new RegExp(type, 'i') }); // Find emergencies by type, case-insensitive
        res.status(200).json(urgences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getHeatmapData = async (req, res) => {
    try {
        const incidents = await Urgence.find({}, { latitude: 1, longitude: 1 });
        
        // Calculate intensity based on frequency (example)
        const intensityMap = {};
        incidents.forEach(incident => {
            const key = `${incident.latitude},${incident.longitude}`;
            intensityMap[key] = intensityMap[key] ? intensityMap[key] + 1 : 1;
        });

        const heatmapData = Object.keys(intensityMap).map(key => {
            const [lat, lng] = key.split(',').map(parseFloat);
            return {
                lat,
                lng,
                intensity: intensityMap[key]
            };
        });

        res.status(200).json(heatmapData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getIncidentTrends = async (req, res) => {
    try {
        const trends = await Urgence.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                        type: "$type" // assuming you have a type field
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);
        res.status(200).json(trends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// controller/urgence/urgence.js


exports.create = async (req, res) => {
    console.log("Received create request:", req.body);
    let response = null;
    if (req.body.id) {
        const id = req.body.id.replace(/^"|"$/g, '');
        response = await Urgence.findById(id);
    }

    if (!response) {
        const newUrgence = new Urgence({
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            type: req.body.type,
            taille: req.body.taille,
            age: req.body.age,
            niveau: req.body.niveau,
            nbrpersonne: req.body.nbrpersonne,
            depart: req.body.depart,
            nomprenom: req.body.nomprenom,
            distance: req.body.distance,
            status: req.body.status,
            tel: req.body.tel,
            communication: req.body.communication,
            police: req.body.police,
            cloture: 'false',
            other: req.body.other,
            image: req.body.image  // Add image field here
        });
        newUrgence.save()
            .then((urgence) => {
                Socket.emit('notification', { urgence });
                res.send(urgence._id);
            })
            .catch(err => {
                console.error("Error creating emergency:", err);
                res.status(500).send({
                    message: err.message || "Some error occurred."
                });
            });
    } else { 
        Urgence.findByIdAndUpdate(response._id, req.body, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot update with id=${response._id}. Maybe it was not found!`
                    });
                } else {
                    Socket.emit('refresh', { data: data });
                    res.send({ message: "Emergency was updated successfully." });
                }
            })
            .catch(err => {
                console.error("Error updating emergency:", err);
                res.status(500).send({
                    message: "Error updating emergency with id=" + response._id + " " + err
                });
            });
    }
};

// Add new update function
exports.update = (req, res) => {
    let id = req.params.id;
    console.log("Received update request for id:", id);
    console.log("Request body:", req.body);
    id = id.replace(/^"|"$/g, '');
    id = id.replace(/^\"|\"$/g, '');

    // Decode URI component to get the actual ID
    id = decodeURIComponent(id);

    // Ensure the ID is a valid ObjectId string and remove surrounding quotes if present
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: `Invalid ID format: ${id}`
        });
    }

    if (id.startsWith('"') && id.endsWith('"')) {
        id = id.substring(1, id.length - 1);
    }

    Urgence.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update emergency with id=${id}. Maybe it was not found!`
                });
            } else {
                Socket.emit('refresh', { data: data });
                res.send({ message: "Emergency was updated successfully." });
            }
        })
        .catch(err => {
            console.error("Error updating emergency:", err);
            res.status(500).send({
                message: "Error updating emergency with id=" + id + " " + err
            });
        });
};

// Other functions (findAll, findUrgence, delete, deleteAll, findNbrMonthly, findNbrDaily, findByRegion, isInRegion)
// with added logging where necessary

// retrive all emergencies with filters
exports.findAll = async (req, res) => {
    const { depart, niveau, status, cloture } = req.query
    try {
        const query = {};
        if (depart) query.depart = new RegExp(depart, 'i');
        if (niveau) query.niveau = niveau;
        if (status) query.status = new RegExp(status, 'i');
        if (cloture) query.cloture = cloture;
        const urgences = await Urgence.find(query);
        res.send(urgences)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

// retrieve emergency by coords
exports.findUrgence = (req, res) => {
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;

    Urgence.findOne({ latitude: latitude, longitude: longitude })
        .then(
            data => {
                res.send(data);
                return;
            })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while fetching data."
            });
        })
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Urgence.findByIdAndRemove(id)
        .then(async (data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete emergency with id=${id}. Maybe it was not found!`
                });
            } else {
                res.send({
                    message: "Emergency was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete emergency with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Urgence.deleteMany()
        .then(async (data) => {
            res.send({ message: `${data.deletedCount} Emergency(ies) were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all emergencies."
            });
        });
};

// Retrieve emergencies monthly
exports.findNbrMonthly = async (req, res) => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // Months
    let data = []
    let enclosed = []
    let notEnclosed = []
    for (let index = 0; index < months.length; index++) { // retrieving every emergencies per month
        const response = await Urgence.find({
            $expr: {
                $eq: [
                    { $month: "$createdAt" }, months[index]
                ]
            }
        })
        const counters = calculateEnclosed(response) // calculating how many are enclosed and not enclosed
        notEnclosed.push(counters.counterNotEnclosed)
        enclosed.push(counters.counterEnclosed);
        data.push(response.length)
    }
    res.send(
        {
            data: data,
            enclosed: enclosed,
            notEnclosed: notEnclosed
        }
    )
};

exports.findNbrDaily = async (req, res) => {
    const d = new Date(); // actual date
    const year = d.getFullYear(); // retrieve the actual year
    const month = d.getMonth() + 1; // retrieve the actual month
    const daysInMonth = getDaysInMonth(year, month); // retrieving how many days in this actual month in the year
    let tabDays = []
    for (let index = 0; index < daysInMonth; index++) { // filling an array with number of days
        tabDays.push(index + 1)
    }
    let data = []
    let enclosed = []
    let notEnclosed = []
    for (let index = 0; index < tabDays.length; index++) { // retrieving emergencies per day
        const targetDate = new Date(`${year}-${month}-${tabDays[index]}`);
        const response = await Urgence.find({
            $expr: {
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    { $dateToString: { format: "%Y-%m-%d", date: targetDate } }
                ]
            }
        })
        if (response.length > 0) {
            data.push(response.length)
        }
        else {
            data.push(0)
        }
        const counters = calculateEnclosed(response)
        notEnclosed.push(counters.counterNotEnclosed)
        enclosed.push(counters.counterEnclosed);
    }
    res.send({
        days: tabDays,
        data: data,
        enclosed: enclosed,
        notEnclosed: notEnclosed
    })
};

exports.findByRegion = async (req, res) => {
    const response = await Urgence.find()
    let region = ""
    let tabarka = 0
    let capBon = 0
    let monastir = 0
    let gabes = 0
    let zarzis = 0
    const polygontabarka = turf.polygon(tabarkacapbonCoordinates);
    const polygoncapbon = turf.polygon(tunisMonastirCoordinates);
    const polygonmonastir = turf.polygon(monastirGabesCoordinates);
    const polygongabes = turf.polygon(gabesZerzisCoordinates);
    for (let index = 0; index < response.length; index++) {
        const element = response[index];
        const point = turf.point([element.latitude,element.longitude]);
        console.log(`Urgence in: Latitude ${point.geometry.coordinates[1]}, Longitude ${point.geometry.coordinates[0]}`);       
        console.log(turf.booleanPointInPolygon(point, polygontabarka));
         if (turf.booleanPointInPolygon(point, polygontabarka)) {
            tabarka += 1
            region = 'Tabarka - Cap con'
            console.log(`Urgence in Tabarka: Latitude ${point.geometry.coordinates[1]}, Longitude ${point.geometry.coordinates[0]}`);

            
        }
        if (turf.booleanPointInPolygon(point, polygoncapbon)) {
            capBon += 1
            region = 'Cap bon - Monastir'
            console.log(`Urgence in CapBon: Latitude ${point.geometry.coordinates[1]}, Longitude ${point.geometry.coordinates[0]}`);

            
        }
        if (turf.booleanPointInPolygon(point, polygonmonastir)) {
            monastir += 1
            region = 'Monastir - Gabes'
            console.log(`Urgence in Monastir: Latitude ${point.geometry.coordinates[1]}, Longitude ${point.geometry.coordinates[0]}`);

            
        }
        if (turf.booleanPointInPolygon(point, polygongabes)) {
            gabes++
            region = 'Gabes - zarzis'
            console.log(`Urgence in Gabes: Latitude ${point.geometry.coordinates[1]}, Longitude ${point.geometry.coordinates[0]}`);

            
        }
        console.log(index);
    }
    res.send({
        data: {
            tabarka: tabarka,
            capBon: capBon,
            monastir: monastir,
            gabes: gabes
        }
    })
}

exports.isInRegion = async (req, res) => {
    const point = turf.point([req.body.latitude,req.body.longitude]);
    const polygons = [
        turf.polygon(tabarkacapbonCoordinates),
        turf.polygon(tunisMonastirCoordinates),
        turf.polygon(monastirGabesCoordinates),
        turf.polygon(gabesZerzisCoordinates)
    ];

    if (polygons.some(polygon => turf.booleanPointInPolygon(point, polygon))) {
        return res.send(true);
    }

    return res.send(false);

}

function getDaysInMonth(year, month) {
    // JavaScript months are zero-based (0 - January to 11 - December)
    // So, we subtract 1 from the provided month to get the correct month index.
    const date = new Date(year, month - 1, 1);

    // Move to the next month and subtract 1 day to get the last day of the provided month.
    date.setMonth(date.getMonth() + 1);
    date.setDate(date.getDate() - 1);

    // Return the day of the last date, which represents the number of days in the month.
    return date.getDate();
}

function calculateEnclosed(data) {
    let counterEnclosed = 0
    let counterNotEnclosed = 0
    for (let jindex = 0; jindex < data.length; jindex++) {
        (data[jindex] && data[jindex].cloture === 'true') ? counterEnclosed += 1 : counterNotEnclosed += 1
    }
    return { counterEnclosed: counterEnclosed, counterNotEnclosed: counterNotEnclosed }
}
