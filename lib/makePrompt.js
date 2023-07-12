export function makePrompt(favArtists, favGenres) {
    const separator = ', ';
    const artistString = favArtists.slice(0, 15).join(separator);
    const genreString = favGenres.slice(0, 15).join(separator);
  
    const horoscopesInfoStr = `
  
      My favorite artists are: ${artistString}`;
  
    const genresIntro = "My favorite genres are ";
  
    const conclusionAndFormat = `Generate a zodiac sign randomly (Options: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Scorpius, Sagittarius, Capricorn, Aquarius, Pisces--each with equal probability). Please format your answer in the following format, with no additional text. Please use personality traits and my genres as reasons this is my zodiac sign. First listing your guess formatted as follows, then a list of reasons why each separated by a new line. Please address me in the reasons as 'you' :
      'Sign: [Zodiac Sign].
      1.
      2.
      3.
      '`;
  
    return `${horoscopesInfoStr}\n\n${genresIntro}${genreString}\n\n${conclusionAndFormat}`;
  }

