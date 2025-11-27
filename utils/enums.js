const Roles = Object.freeze({
    USER: "user",
    ADMIN: "admin",
    REALTOR: "realtor"
});

const Status = Object.freeze({
    UNDERREVIEW: "underReview",
    ACTIVE: "active",
    SOLD: "sold",
    UNLISTED: "unlisted"
});

const BuildingType = Object.freeze({
    VILLA: "Villa",
    EJERLEJLIGHED: "Ejerlejlighed",
    RAEKKEHUS: "Rækkehus",
    ANDELSBOLIG: "Andelsbolig",
    HELAORSGRUND: "Helårsgrund",
    FRITIDSHUS: "Fritidshus",
    FRITIDSGRUND: "Fritidsgrund",
    LANDEJENDOM: "Landejendom",
    VILLALEJLIGHED: "Villalejlighed"
});

const EnergyRating = Object.freeze({
    A: "A",
    B: "B",
    C: "C",
    D: "D",
    E: "E",
    F: "F",
    G: "G"
});



module.exports = {Roles, Status, BuildingType, EnergyRating};