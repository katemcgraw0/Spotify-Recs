export function makePrompt(favArtists, favGenres) {
    const separator = ', ';
    const artistString = favArtists.slice(0, 15).join(separator);
    const genreString = favGenres.slice(0, 15).join(separator);
  
    const horoscopesInfoStr = `
  
      My favorite artists are: ${artistString}`;
  
    const genresIntro = "My favorite genres are ";
  
    const conclusionAndFormat = `Guess my zodiac sign based on this. Please format your answer in the following format, with no additional text First listing your guess formatted as follows, then a list of reasons why each separated by a new line. Answer as if you know my music taste, not as if I told you.:
      'Sign: [Zodiac Sign].
      1.
      2.
      3.
      '`;
  
    return `${horoscopesInfoStr}\n\n${genresIntro}${genreString}\n\n${conclusionAndFormat}`;
  }

