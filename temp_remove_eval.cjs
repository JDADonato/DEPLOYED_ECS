const fs = require('fs');
const file = 'resources/js/Pages/DashboardAdmin.jsx';
let content = fs.readFileSync(file, 'utf8');

// We want to remove the afterGuide prop entirely from both revenue-forecast and pax-forecast panels.
// The prop looks like this:
//                         afterGuide={(
//                             <ModelEvaluationCard
// ...
//                             />
//                         )}

// We can just use a regex replacement since it's consistent.
content = content.replace(/\\s+afterGuide=\\{\\([\\s\\S]*?<ModelEvaluationCard[\\s\\S]*?\\/>\\s*\\)\\}/g, '');

fs.writeFileSync(file, content, 'utf8');
console.log("File updated successfully.");
