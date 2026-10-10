"use server";

import { generateContentWithFallback } from "@/lib/aiFallback";
import vcDatabase from "@/lib/vcDatabase.json";

export async function findInvestors(pitch: any) {
  try {
    const prompt = `
You are an expert VC matchmaker. 
Analyze the following startup pitch:
Name: ${pitch.startupName}
Problem: ${pitch.problem}
Solution: ${pitch.solution}
Market: ${pitch.targetMarket}
Business Model: ${pitch.businessModel}

Based on this, recommend exactly 3 REAL, world-famous Venture Capital firms (e.g. Sequoia, a16z, YC, Founders Fund) or prominent Angel Investors that would be a perfect match for this startup's thesis.
Act like a Crunchbase pro search. Provide accurate thesis information for these real firms.

Format the output strictly as a JSON array of objects with the following keys:
- name: (String) Name of the firm or investor
- type: (String, e.g., "Seed VC", "Angel", "Growth Equity")
- thesis: (String) A 1-sentence description of what they invest in
- whyMatch: (String) A 1-2 sentence explanation of why they specifically would love this startup
- typicalCheck: (String, e.g., "$500k - $2M")

Return ONLY the raw JSON array. Do not include markdown formatting like \`\`\`json.
`;

    const text = await generateContentWithFallback(prompt);
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Investor Match Error:", error);
    return [];
  }
}

export async function scrapeInvestorContact(investorName: string) {
  try {
    const cleanNameLower = investorName.toLowerCase().trim();
    
    // 1. Query the local JSON database for verified, non-AI generated contact details
    const dbMatch = vcDatabase.find(
      (vc) => vc.name.toLowerCase() === cleanNameLower || cleanNameLower.includes(vc.name.toLowerCase())
    );

    if (dbMatch) {
      return dbMatch.contact;
    }

    const query = encodeURIComponent(investorName);
    // 2. If not in DB, use Clearbit Autocomplete API (free, no auth required) to scrape the domain
    const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`);
    
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const domain = data[0].domain;
        if (domain) {
          // Construct the most likely partner inbox based on standard VC patterns
          return `[partner_first_name]@${domain}`;
        }
      }
    }
    
    // Fallback if Clearbit doesn't find it
    const cleanName = investorName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `[partner_first_name]@${cleanName}.com`;
  } catch (error) {
    console.error("Scrape error:", error);
    const cleanName = investorName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `[partner_first_name]@${cleanName}.com`;
  }
}

export async function generateOutreach(firmName: string, pitch: any) {
  try {
    // 1. Scrape LinkedIn via DuckDuckGo to find a real partner name
    const query = encodeURIComponent(`site:linkedin.com/in/ "Partner" "${firmName}"`);
    const searchRes = await fetch(`https://html.duckduckgo.com/html/?q=${query}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await searchRes.text();
    
    let partnerName = "Managing Partner";
    let firstName = "partner";

    const titleRegex = /<h2 class="result__title">\s*<a[^>]*>(.*?)<\/a>\s*<\/h2>/gi;
    let match = titleRegex.exec(html);
    
    if (match) {
      // e.g. "Alex Immerman - General Partner at Andreessen Horowitz | LinkedIn"
      const titleText = match[1].replace(/<[^>]*>?/gm, '').trim();
      // Extract the name before the dash
      const namePart = titleText.split('-')[0].trim();
      const parts = namePart.split(' ');
      if (parts.length >= 2 && !namePart.includes("...")) {
        partnerName = namePart;
        firstName = parts[0].toLowerCase().replace(/[^a-z]/g, '');
      }
    }

    // 2. Get the base contact pattern (e.g. [partner_first_name]@a16z.com)
    let contactFormat = await scrapeInvestorContact(firmName);
    
    // 3. Resolve the email
    let finalEmail = contactFormat;
    if (finalEmail.includes("[partner_first_name]")) {
      finalEmail = finalEmail.replace("[partner_first_name]", firstName);
    }

    // If it's an accelerator apply link, we don't need an email draft, just return
    if (finalEmail.includes("Apply Online")) {
      return {
        partnerName: "Accelerator Program",
        email: finalEmail,
        emailBody: `For ${firmName}, you do not send cold emails. Please click the link above to apply through their official portal.`
      };
    }

    // 4. Generate the personalized email content using AI
    const prompt = `
You are an expert founder writing a cold outreach email to a Venture Capital partner.
Firm Name: ${firmName}
Partner Name: ${partnerName}
Partner Email: ${finalEmail}

Startup Pitch Data:
Startup Name: ${pitch.startupName}
Problem: ${pitch.problem}
Solution: ${pitch.solution}
Traction/Market: ${pitch.targetMarket} ${pitch.traction || ''}

Write a short, punchy, 3-sentence cold email to ${partnerName}.
Rules:
- Subject line must be included at the top as "Subject: ..."
- No fluff, no "I hope you are well".
- Sentence 1: What we do and the problem we solve.
- Sentence 2: The traction or market size that makes it a venture-scale opportunity.
- Sentence 3: The ask (e.g., "Are you open to a brief chat?").
- Sign off as "Founder, ${pitch.startupName}".
`;

    const emailBody = await generateContentWithFallback(prompt);

    return {
      partnerName,
      email: finalEmail,
      emailBody: emailBody.trim()
    };
  } catch (error) {
    console.error("Outreach generation error:", error);
    throw new Error("Failed to generate outreach");
  }
}
