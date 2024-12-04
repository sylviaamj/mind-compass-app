
const analyzeSentiment = (text) => {
  if (!text) return 'neutral';

  const positiveWords = ['happy', 'great', 'good', 'love', 'wonderful', 'excited', 'awesome'];
  const negativeWords = ['sad', 'bad', 'angry', 'hate', 'upset', 'terrible', 'frustrated'];

  let positiveCount = 0;
  let negativeCount = 0;

  const words = text.toLowerCase().split(/\s+/);

  words.forEach((word) => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};


export const generateInsights = (entries) => {
  const sentiments = entries.map((entry) => ({
    journalEntry: entry.journalEntry,
    sentiment: analyzeSentiment(entry.journalEntry),
  }));

  const positiveEntries = sentiments.filter((entry) => entry.sentiment === 'positive').length;
  const negativeEntries = sentiments.filter((entry) => entry.sentiment === 'negative').length;

  return {
    sentiments,
    positivePercentage: (positiveEntries / entries.length) * 100,
    negativePercentage: (negativeEntries / entries.length) * 100,
  };
};
