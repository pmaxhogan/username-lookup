const tableScraper = require("table-scraper");
module.exports = async (username, date = new Date()) => {
    let tables;
    try {
        tables = await tableScraper.get(`https://steamid.uk/profile/${username}`);
    }catch(e){
        console.error("Error loading tables from steamid: " + e + " for user " + username);
        return [];
    }

    // no user found
    if(tables.length === 0) return [];

    // the username history table
    const table = tables.find(arr => arr[0][0] === "Name");

    if(!table) return [];

    return table
        // ignore the header
        .slice(1)
    .map((row, idx, arr) => {
        let lastUsed = date;
        if (arr[idx - 1]) {// if there was a previous username
            const dateParts = arr[idx - 1][1].split(" ");
            lastUsed = new Date(`${dateParts[1]} ${dateParts[0]} ${dateParts[2]}`);
        }

        return {
            username: row[0],
            icon: "https://store.steampowered.com/favicon.ico",
            from: "Previous Steam Username",
            lastUsed
        };
    }).filter(res => res.username.toLowerCase() !== username.toLowerCase());
};
