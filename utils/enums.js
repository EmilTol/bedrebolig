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

const Types = Object.freeze({
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



module.exports = {Roles, Status, Types};