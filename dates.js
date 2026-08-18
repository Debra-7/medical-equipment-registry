// Format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Generate a random date between two dates
function randomDate(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

//get the next maintenance date based on the last maintenance date
function getNextMaintenanceDate(lastMaintenanceDate) {
    const date = new Date(lastMaintenanceDate);
    date.setMonth(date.getMonth() + 3);
    return formatDate(date);
}

// Generate an array of maintenance dates
function generateMaintenanceDates(count = 20) {
    return Array.from({ length: count }, () => {
        const lastMaintenanceDate = formatDate(
            randomDate("2026-01-01", "2026-06-30")
        );

        const nextMaintenanceDate = getNextMaintenanceDate(lastMaintenanceDate);

        return {
            lastMaintenanceDate,
            nextMaintenanceDate
        };
    });
}


console.log(generateMaintenanceDates(20));