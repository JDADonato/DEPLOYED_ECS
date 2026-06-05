const fs = require('fs');
const file = 'resources/js/Pages/DashboardAdmin.jsx';
let content = fs.readFileSync(file, 'utf8');

let revPanelIdx = content.indexOf('id="revenue-forecast"');
let paxPanelIdx = content.indexOf('id="pax-forecast"');

let revenueForecastStart = content.lastIndexOf('<AnalyticsPanel', revPanelIdx);
let paxForecastStart = content.lastIndexOf('<AnalyticsPanel', paxPanelIdx);

let paxForecastEndMarker = '</AnalyticsPanel>';
let paxForecastEnd = content.indexOf(paxForecastEndMarker, paxForecastStart) + paxForecastEndMarker.length;

if (revenueForecastStart === -1 || paxForecastStart === -1 || paxForecastEnd === -1) {
    console.log("Could not find the panels.");
    process.exit(1);
}

let panelsBlock = content.substring(revenueForecastStart, paxForecastEnd);
panelsBlock = panelsBlock.replace(/'Train\/Test Split'/g, "'Rolling-Origin CV'");
panelsBlock = panelsBlock.replace(/'Historical Backtesting'/g, "'Backtesting / CV'");

content = content.substring(0, revenueForecastStart) + content.substring(paxForecastEnd);

let insertMarker = "<div className=\"admin-analytics-grid\">";
let insertIdx = content.indexOf(insertMarker);

if (insertIdx === -1) {
    console.log("Could not find insertion point.");
    process.exit(1);
}

// Find end of line of insertIdx
insertIdx = content.indexOf('\n', insertIdx) + 1;

content = content.substring(0, insertIdx) + '                    ' + panelsBlock + '\n\n' + content.substring(insertIdx);

fs.writeFileSync(file, content, 'utf8');
console.log("File updated successfully.");
