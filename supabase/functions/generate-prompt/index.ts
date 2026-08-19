import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { type, playerName, players, previousPrompts = [] } = await req.json();

    const otherPlayers = players.filter((p: string) => p !== playerName);
    const otherPlayersList = otherPlayers.length > 0 ? otherPlayers.join(", ") : "the other players";

    const historyClause = previousPrompts.length > 0
      ? `\n\nIMPORTANT: The following prompts have ALREADY been used this session. You MUST NOT repeat or rephrase any of them. Generate something completely different:\n${previousPrompts.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}`
      : "";

    const systemPrompt = `You are a creative party game host for an adult truth or dare game. Generate a single ${type} prompt that is spicy, fun, and appropriate for a group of friends at a party. The prompts should be flirty, embarrassing, or daring but never dangerous or illegal. Keep it to 1-2 sentences max. Do NOT include any prefix like "Truth:" or "Dare:" — just the prompt itself. The current player is ${playerName}. Other players are: ${otherPlayersList}. You can reference other players by name in the prompt to make it more personal and fun.${historyClause}`;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const response = await fetch(`${supabaseUrl}/functions/v1/ai/chat`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a ${type} prompt for ${playerName}.` },
        ],
        max_tokens: 100,
        temperature: 1.1,
      }),
    });

    if (!response.ok) {
      // Fallback: generate locally with randomized prompts
      const prompt = generateFallbackPrompt(type, playerName, otherPlayers, previousPrompts);
      return new Response(
        JSON.stringify({ prompt }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const prompt = data.choices?.[0]?.message?.content?.trim();

    if (!prompt) {
      const fallback = generateFallbackPrompt(type, playerName, otherPlayers, previousPrompts);
      return new Response(
        JSON.stringify({ prompt: fallback }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ prompt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateFallbackPrompt(type: string, playerName: string, otherPlayers: string[], previousPrompts: string[] = []): string {
  const randomOther = otherPlayers.length > 0
    ? otherPlayers[Math.floor(Math.random() * otherPlayers.length)]
    : "someone";

  const truths = [
    `${playerName}, what's the most embarrassing text you've ever sent to the wrong person?`,
    `${playerName}, who in this room would you most likely hook up with if you were single?`,
    `${playerName}, what's the wildest thing on your search history right now?`,
    `${playerName}, have you ever had a dream about ${randomOther}? Describe it.`,
    `${playerName}, what's the biggest lie you've told to get out of plans?`,
    `${playerName}, who was your most embarrassing crush and why?`,
    `${playerName}, what's the most scandalous DM in your inbox right now?`,
    `${playerName}, if you had to rate everyone here from most to least attractive, where would ${randomOther} fall?`,
    `${playerName}, what's the worst date you've ever been on?`,
    `${playerName}, have you ever stalked an ex's social media? How recently?`,
    `${playerName}, what's the most desperate thing you've done to get someone's attention?`,
    `${playerName}, tell us about a time you pretended to like something just to impress someone.`,
    `${playerName}, what's one thing you'd never want ${randomOther} to find out about you?`,
    `${playerName}, who's the last person you thought about before falling asleep?`,
    `${playerName}, what's the most embarrassing thing you've done while drunk?`,
  ];

  const dares = [
    `${playerName}, let ${randomOther} go through your last 10 photos in your camera roll.`,
    `${playerName}, do your best impression of ${randomOther} trying to flirt.`,
    `${playerName}, send a voice note to your crush saying you've been thinking about them.`,
    `${playerName}, let the group post one story on your Instagram.`,
    `${playerName}, give ${randomOther} a lap dance for 15 seconds.`,
    `${playerName}, show the group your screen time report right now.`,
    `${playerName}, text your ex "I miss us" and show the response.`,
    `${playerName}, let ${randomOther} read your last 5 DMs out loud.`,
    `${playerName}, do a body shot off of ${randomOther}.`,
    `${playerName}, call a random contact and tell them you just got engaged.`,
    `${playerName}, let the group write a Tinder bio for you and you have to use it.`,
    `${playerName}, whisper something dirty in ${randomOther}'s ear.`,
    `${playerName}, show the last person you searched on Instagram.`,
    `${playerName}, do 10 pushups or take a shot every time you refuse.`,
    `${playerName}, let ${randomOther} send one text from your phone to anyone they choose.`,
  ];

  const pool = type === "truth" ? truths : dares;
  const unused = pool.filter(p => !previousPrompts.includes(p));
  const candidates = unused.length > 0 ? unused : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
