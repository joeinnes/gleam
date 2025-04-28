import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Moment } from '$lib/schema';
import type { co } from 'jazz-tools';

export async function generateSummary(
	apiKey: string,
	moments: co<Moment | null>[]
): Promise<string | null> {
	try {
		if (!apiKey) {
			throw new Error('Google API key is required.');
		}
		if (!moments || moments.length === 0) {
			console.warn('No moments provided for summary generation.');
			return null;
		}

		const genAI = new GoogleGenerativeAI(apiKey);
		const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-04-17' });

		const formattedMoments = moments
			.map((moment) => {
				if (!moment) return '';
				const date = new Date(moment.date).toLocaleDateString('en-GB', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				});
				return `Date: ${date}\nMoment: ${moment.content}\n`;
			})
			.join('\n');
		const prompt = `You are an AI who is playing the role of an empathetic and insightful happiness coach. Do not refer to yourself or your role. You do not need to introduce yourself.

I'm going to share a collection of my happy moments from a specific time period. Please analyze these moments and create a thoughtful, personalized summary that:

1. Identifies patterns or themes in what brings me joy
2. Offers meaningful insights about my sources of happiness
3. Provides 1-2 gentle suggestions for how I might enhance my well-being if there are obvious ones.

Please write in a conversational tone, but be aware that you are not having an interaction with the user, you are providing one way commentary on information which is being shared with you. Do not be overly effusive, false, or sycophantic. Keep your insights brief and to the point. Bullet points are a good idea. Your user knows you are an artificial intelligence, and is interested more in your analysis and insights than praise or other personificated representations from you.

Here are my happy moments:

${formattedMoments}`;
		const result = await model.generateContent(prompt);
		const response = result.response;
		const text = response.text();

		return text;
	} catch (error) {
		console.error('Error generating summary with Google SDK:', error);

		return null;
	}
}
