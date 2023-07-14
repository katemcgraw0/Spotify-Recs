export function makePrompt(favArtists, favGenres) {
    const separator = ', ';
    const artistString = favArtists.slice(0, 15).join(separator);
    const genreString = favGenres.slice(0, 15).join(separator);
  
    const horoscopesInfoStr = `
  
      My favorite artists are: ${artistString}`;
  
    const genresIntro = "My favorite genres are ";
  
    const conclusionAndFormat = `Guess my zodiac sign based on this. Format your answer in the following format, with no additional text. Use my music taste as reasons this is my zodiac sign. First list your guess formatted as follows, then a list of reasons why each separated by a new line. Please address me as 'you' in the reasons and keep them max 15 words.:
      'Sign: [Zodiac Sign].
      1.
      2.
      3.
      '`;
  
    return `${horoscopesInfoStr}\n\n${genresIntro}${genreString}\n\n${conclusionAndFormat}`;
  }

export function makePromptArtistRecs(favArtists){
  const separator = ', ';
  const artistString = favArtists.slice(0, 15).join(separator);

  const intro = `My favorite music artists are: `;
  const request = `Please generate 2 new artist recommendations in the following format, with no extra text: 
  '1.
  2. 
  '`
  return `${intro} ${artistString} ${request}`
}

export function makePromptSongRecs(favArtists,favSongs){
  
}