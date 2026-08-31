// DUO LOVE — Supabase Edge Function: love-image
// Secret necesar în Supabase: OPENAI_API_KEY
// Model: GPT-Image-2

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Metodă nepermisă." }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";

    if (!authHeader.startsWith("Bearer ")) {
      return jsonResponse(
        { error: "Trebuie să fii conectat/ă în DUO LOVE." },
        401,
      );
    }

    // Verificăm sesiunea Supabase a utilizatorului.
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    if (supabaseUrl && supabaseAnonKey) {
      const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          Authorization: authHeader,
          apikey: supabaseAnonKey,
        },
      });

      if (!userResponse.ok) {
        return jsonResponse(
          { error: "Sesiunea a expirat. Conectează-te din nou." },
          401,
        );
      }
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      return jsonResponse(
        {
          error:
            "OPENAI_API_KEY nu este setată în Supabase Edge Function Secrets.",
        },
        500,
      );
    }

    const body = await req.json().catch(() => ({}));

    const prompt = String(body.prompt || "").trim();
    const requestedSize = String(body.size || "1024x1024");
    const requestedQuality = String(body.quality || "medium");

    if (prompt.length < 3) {
      return jsonResponse(
        { error: "Descrierea imaginii este prea scurtă." },
        400,
      );
    }

    const allowedSizes = new Set([
      "1024x1024",
      "1024x1536",
      "1536x1024",
    ]);

    const allowedQualities = new Set([
      "low",
      "medium",
      "high",
    ]);

    const size = allowedSizes.has(requestedSize)
      ? requestedSize
      : "1024x1024";

    const quality = allowedQualities.has(requestedQuality)
      ? requestedQuality
      : "medium";

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-image-2",
          prompt: prompt.slice(0, 4000),
          size,
          quality,
          output_format: "png",
        }),
      },
    );

    const result = await openaiResponse.json().catch(() => ({}));

    if (!openaiResponse.ok) {
      console.error("OpenAI image error:", result);

      const message =
        result?.error?.message ||
        "OpenAI nu a putut genera imaginea.";

      return jsonResponse(
        { error: message },
        openaiResponse.status >= 400
          ? openaiResponse.status
          : 500,
      );
    }

    const imageBase64 =
      result?.data?.[0]?.b64_json || "";

    if (!imageBase64) {
      return jsonResponse(
        { error: "Modelul nu a returnat imaginea." },
        502,
      );
    }

    return jsonResponse({
      image: `data:image/png;base64,${imageBase64}`,
      model: "gpt-image-2",
      size,
      quality,
    });
  } catch (error) {
    console.error(error);

    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Eroare neașteptată.",
      },
      500,
    );
  }
});

