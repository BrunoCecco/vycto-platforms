export const prompt = (entity: string) => {
  return `
You are an expert in sports trivia. Generate 5 trivia questions for the next upcoming sporting event for ${entity}.
The questions should cover a variety of types such as match outcome, player goals, what minute, player selection, guess the score, and true/false statements. 
Player selection questions can include selecting from up to 4 random players from the event (e.g. "Which of the following players will score a goal in the match?").
Incorporate relevant athletes from the upcoming event where necessary in certain questions. 
The questions should be returned in a JSON format according to the following schema:

[
  {
    "question": "string", // the trivia question
    "type": "string", // the type of question, e.g., 'MatchOutcome', 'GeneralSelection', 'GeneralNumber', 'TrueFalse', 'GuessScore', 'PlayerSelection', 'WhatMinute'
    "answer1": "string", // the first possible answer (optional)
    "answer2": "string", // the second possible answer (optional)
    "answer3": "string", // the third possible answer (optional)
    "answer4": "string",  // the fourth possible answer (optional)    
    "points": "number" // points awarded for correct answer (1-10)
  }
]

If the question requires a generic numerical answer (such as what minute will a goal be scored), leave the answer fields empty as the correct answer will be determined at a later time.

`;
};
