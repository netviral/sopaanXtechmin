generateAndSaveTeams(1, 1, 10); // Day 1, Track 1
generateAndSaveTeams(2, 1, 10); // Day 1, Track 2
generateAndSaveTeams(1, 2, 10); // Day 2, Track 1
generateAndSaveTeams(2, 2, 10); // Day 2, Track 2
// Function to generate and save random teams for a day, track, and number of teams
async function generateAndSaveTeams(day, track, numberOfTeams) {
    try {
      const sampleTeams = [];
  
      for (let i = 1; i <= numberOfTeams; i++) {
        const teamId = (day - 1) * 20 + (track - 1) * 10 + i; // Calculate a unique _id
        const teamData = {
          _id: teamId,
          teamName: `Team ${teamId}`,
          teamMembers: 'Member1, Member2, Member3', // Sample members
          teamSize: 3, // Sample team size
          leaderName: `Leader ${teamId}`,
          leaderEmail: `leader${teamId}@example.com`,
          leaderPhone: 1234567890 + teamId,
          code: generateRandomCode(),
          clues: [],
          track: track,
          day: day
        };
        sampleTeams.push(teamData);
      }
  
      const savedTeams = await Team.insertMany(sampleTeams);
      console.log(`Sample teams created for Day ${day} Track ${track}:`, savedTeams);
    } catch (error) {
      console.error(`Error creating sample teams for Day ${day} Track ${track}:`, error);
    }
  }


function generateRandomCode() {
    return Math.floor(Math.random() * 1000); // Generating a random code between 0 and 999
  }