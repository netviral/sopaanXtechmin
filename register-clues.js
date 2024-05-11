
  generateAndSaveClues(1, 1, 7); 
  generateAndSaveClues(1, 2, 7); 
  generateAndSaveClues(1, 3, 7); 
  generateAndSaveClues(1, 4, 7); 
  generateAndSaveClues(1, 5, 7); 
  generateAndSaveClues(1, 6, 7); 
  generateAndSaveClues(1, 7, 7); 
// //   Day 1, Track 2
//   generateAndSaveClues(1, 2, 7); 
// //   Day 2, Track 1
//   generateAndSaveClues(2, 2, 7); 
//   Day 2, Track 2
//  Function to generate and save clues for a day, track, and number of clues

 async function generateAndSaveClues(day, track, numberOfClues) {
    try {
      const sampleClues = [];
  
      for (let i = 1; i <= numberOfClues; i++) {
        const clueData = {
          _id: (day - 1) * 14 + (track - 1) * 7 + i, // Calculate a unique _id
          clueNumber:i,
          day: day,
          track: track,
          code: generateRandomClueCode(),
          clue: `Clue for Track ${track} Day ${day} - Clue ${i}`
        };
        sampleClues.push(clueData);
      }
  
      const savedClues = await Clue.insertMany(sampleClues);
      console.log(`Sample clues created for Day ${day} Track ${track}:`, savedClues);
    } catch (error) {
      console.error(`Error creating sample clues for Day ${day} Track ${track}:`, error);
    }
  }


// Function to generate a random code
function generateRandomClueCode() {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let code = '';
for (let i = 0; i < 6; i++) {
  const randomIndex = Math.floor(Math.random() * characters.length);
  code += characters.charAt(randomIndex);
}
return code;
}