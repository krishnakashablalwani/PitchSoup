"use server";

import { generateContentWithFallback } from "@/lib/aiFallback";
import { scrapeInvestorContact } from "@/app/actions/match";

export async function generateInvestorProfile(firmName: string) {
  try {
    // 1. Scrape LinkedIn via DuckDuckGo to find 3 real partners
    const query = encodeURIComponent(`site:linkedin.com/in/ "Partner" "${firmName}"`);
    const searchRes = await fetch(`https://html.duckduckgo.com/html/?q=${query}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await searchRes.text();
    
    const partners: string[] = [];
    const titleRegex = /<h2 class="result__title">\s*<a[^>]*>(.*?)<\/a>\s*<\/h2>/gi;
    let match;
    
    while ((match = titleRegex.exec(html)) !== null && partners.length < 3) {
      const titleText = match[1].replace(/<[^>]*>?/gm, '').trim();
      const namePart = titleText.split('-')[0].trim().split('|')[0].trim();
      if (!namePart.includes("...") && namePart.length > 3) {
        partners.push(namePart);
      }
    }

    if (partners.length === 0) {
      partners.push("Managing Partners");
    }

    // 2. Generate Deep Dive via AI
    const prompt = `
You are an expert Venture Capital analyst. Provide a comprehensive deep dive profile on the VC firm: ${firmName}.
We have identified these partners at the firm: ${partners.join(", ")}.

Return ONLY a raw, valid JSON object (no markdown blocks). The object must have these keys:
- "investmentThesis": (String) A 1-2 paragraph description of their core focus areas, stages, and what they look for.
- "partnerBios": An array of objects for the identified partners (${partners.join(", ")}). Each object needs:
   - "name": Partner's name
   - "focus": What this specific partner invests in (infer if unknown)
   - "background": A 1-sentence guessed/known background (e.g., "Former operator at...")
- "redFlags": 2 things founders should be careful about when pitching this firm.
`;

    const text = await generateContentWithFallback(prompt);
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const parsed = JSON.parse(cleanText);

    // 3. Deterministically resolve emails for each partner using the database
    const contactFormat = await scrapeInvestorContact(firmName);
    
    parsed.partnerBios = parsed.partnerBios.map((p: any) => {
      let finalEmail = contactFormat;
      const firstName = p.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
      
      if (finalEmail.includes("[partner_first_name]")) {
        finalEmail = finalEmail.replace("[partner_first_name]", firstName);
      }
      
      return {
        ...p,
        email: finalEmail
      };
    });

    return parsed;
  } catch (error) {
    console.error("Profile generation error:", error);
    return null;
  }
}
