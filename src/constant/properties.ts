export const properties = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET,
    SERPER_API_KEY: process.env.SERPER_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
}

const categories = [
    { label: 'Sports', value: 'sports' },
    { label: 'Politics', value: 'politics' },
    { label: 'Games', value: 'games' },
    { label: 'Technology', value: 'technology' },
    { label: 'Business', value: 'business' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Health', value: 'health' },
    { label: 'Science', value: 'science' },
    { label: 'Finance', value: 'finance' },
    { label: 'Education', value: 'education' },
    { label: 'World News', value: 'world' },
    { label: 'Automobile', value: 'automobile' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Travel', value: 'travel' },
    { label: 'Food', value: 'food' },
    { label: 'Movies', value: 'movies' },
    { label: 'Music', value: 'music' },
    { label: 'Environment', value: 'environment' },
    { label: 'Crime', value: 'crime' },
    { label: 'Weather', value: 'weather' }
  ];
  
  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Chinese', value: 'zh' },
    { label: 'Japanese', value: 'ja' },
    { label: 'Arabic', value: 'ar' },
    { label: 'Russian', value: 'ru' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Italian', value: 'it' },
    { label: 'Bengali', value: 'bn' },
    { label: 'Urdu', value: 'ur' },
    { label: 'Turkish', value: 'tr' },
    { label: 'Korean', value: 'ko' }
  ];
  
  const locations = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'India', value: 'in' },
    { label: 'Canada', value: 'ca' },
    { label: 'Australia', value: 'au' },
    { label: 'France', value: 'fr' },
    { label: 'Germany', value: 'de' },
    { label: 'China', value: 'cn' },
    { label: 'Japan', value: 'jp' },
    { label: 'Russia', value: 'ru' },
    { label: 'Brazil', value: 'br' },
    { label: 'South Africa', value: 'za' },
    { label: 'UAE', value: 'ae' },
    { label: 'Mexico', value: 'mx' },
    { label: 'Spain', value: 'es' },
    { label: 'Italy', value: 'it' }
  ];
  
  export { categories, languages, locations };
  