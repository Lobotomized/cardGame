const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Lobotomy:Micasmu4ka@cluster0.tippd.mongodb.net/cardGame?retryWrites=true&w=majority";
let db = null;

async function connectDB() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db("cardGame");
        console.log("Connected to MongoDB for Analytics");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

connectDB();

async function trackSiteVisit(ip) {
    if (!db || !ip) return;
    try {
        const date = new Date().toISOString().split('T')[0];
        const collection = db.collection('site_visits');
        await collection.updateOne(
            { date, ip },
            { $inc: { count: 1 } },
            { upsert: true }
        );
    } catch(e) { console.error(e); }
}

async function trackTutorialOpened(ip) {
    if (!db || !ip) return;
    try {
        const date = new Date().toISOString().split('T')[0];
        const collection = db.collection('tutorial_opens');
        await collection.updateOne(
            { date, ip },
            { $inc: { count: 1 } },
            { upsert: true }
        );
    } catch(e) { console.error(e); }
}

async function trackGamePlayed(ips, isPvp) {
    if (!db || !ips || ips.length === 0) return;
    try {
        const date = new Date().toISOString().split('T')[0];
        
        // Track game history
        const gamesCollection = db.collection('games_history');
        await gamesCollection.insertOne({
            date,
            timestamp: new Date(),
            ips,
            isPvp
        });

        // Track daily game counts
        const dailyGames = db.collection('daily_games');
        await dailyGames.updateOne(
            { date },
            { $inc: { total: 1, pvp: isPvp ? 1 : 0 } },
            { upsert: true }
        );

        // Track unique IP game played
        const ipGames = db.collection('ip_games');
        for (let ip of ips) {
            if (!ip) continue;
            await ipGames.updateOne(
                { ip },
                { 
                    $inc: { totalGames: 1, pvpGames: isPvp ? 1 : 0 },
                    $addToSet: { datesPlayed: date }
                },
                { upsert: true }
            );
        }
    } catch(e) { console.error(e); }
}

async function trackRoundEnd(roundData) {
    if (!db || !roundData) return;
    try {
        const collection = db.collection('round_history');
        const cleanHistory = roundData.battleHistory.map(trick => ({
            player1Card: trick.player1 ? { 
                title: trick.player1.cardTitle, 
                str: trick.player1.strength, 
                agi: trick.player1.agility, 
                int: trick.player1.intelligence, 
                special: trick.player1.special,
                animation: trick.player1.animation,
                description: trick.player1.description,
                descriptionTitle: trick.player1.descriptionTitle
            } : null,
            player2Card: trick.player2 ? { 
                title: trick.player2.cardTitle, 
                str: trick.player2.strength, 
                agi: trick.player2.agility, 
                int: trick.player2.intelligence, 
                special: trick.player2.special,
                animation: trick.player2.animation,
                description: trick.player2.description,
                descriptionTitle: trick.player2.descriptionTitle
            } : null,
            winnerRef: trick.winnerRef
        }));

        await collection.insertOne({
            timestamp: new Date(),
            date: new Date().toISOString().split('T')[0],
            ips: roundData.ips,
            isPvp: roundData.isPvp,
            mode: roundData.bettingMode,
            better: roundData.bettingWinner,
            player1Score: roundData.player1Score,
            player2Score: roundData.player2Score,
            history: cleanHistory
        });
    } catch(e) { console.error(e); }
}

async function getAnalyticsData() {
    if (!db) return {};
    
    try {
        const ipGames = db.collection('ip_games');
        const uniqueIpsCount = await ipGames.countDocuments();
        const ipStats = await ipGames.find({}).toArray();

        const gamesCollection = db.collection('games_history');
        const allGames = await gamesCollection.find({}).sort({timestamp: -1}).limit(100).toArray();
        const pvpGames = await gamesCollection.find({isPvp: true}).sort({timestamp: -1}).limit(100).toArray();

        const tutorialCollection = db.collection('tutorial_opens');
        const tutorialOpens = await tutorialCollection.find({}).toArray();

        const dailyGames = db.collection('daily_games');
        const dailyGamesData = await dailyGames.find({}).sort({date: 1}).toArray();

        const siteVisits = db.collection('site_visits');
        const siteVisitsData = await siteVisits.aggregate([
            {
                $group: {
                    _id: "$date",
                    uniqueIps: { $sum: 1 },
                    totalVisits: { $sum: "$count" }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray();

        const dailyUniquePlayers = await ipGames.aggregate([
            { $unwind: "$datesPlayed" },
            {
                $group: {
                    _id: "$datesPlayed",
                    uniquePlayers: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray();

        const roundHistory = await db.collection('round_history').find({}).sort({timestamp: -1}).limit(50).toArray();

        return {
            uniqueIpsCount,
            ipStats,
            allGames,
            pvpGames,
            tutorialOpens,
            dailyGamesData,
            siteVisitsData,
            dailyUniquePlayers,
            roundHistory
        };
    } catch(e) {
        console.error(e);
        return {};
    }
}

module.exports = {
    trackSiteVisit,
    trackTutorialOpened,
    trackGamePlayed,
    trackRoundEnd,
    getAnalyticsData
};
