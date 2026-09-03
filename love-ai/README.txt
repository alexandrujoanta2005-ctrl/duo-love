LOVE AI — VERSIUNE HTML STATICĂ

1. Urcă TOATE fișierele din acest folder pe GitHub (nu ZIP-ul).
2. index.html trebuie să fie în rădăcina repository-ului.
3. Activează GitHub Pages din Settings -> Pages.
4. Deschide linkul GitHub Pages.

Ce funcționează direct:
- Home / meniuri / navigare
- Love AI în mod local (generator romantic fără server)
- Generator de mesaje și scrisori
- Șabloane
- Mesaje / Scrisori / Favorite
- Istoric
- Poze locale comprimate
- Zona secretă cu PIN
- Muzică YouTube
- Profil, backup/import, notificări, PWA
- Conectare opțională la Supabase prin e-mail magic / Google

IMPORTANT DESPRE AI REAL:
Aplicația originală Lovable folosea LOVABLE_API_KEY pe SERVER pentru ai.gateway.lovable.dev.
O cheie secretă NU trebuie pusă într-un index.html public.
De aceea această versiune are un generator local care merge imediat.
Pentru AI real, setează un endpoint server-side securizat și pune URL-ul în const AI_ENDPOINT din index.html.

Supabase:
HTML-ul folosește proiectul public Supabase găsit în proiectul Lovable. Cheia publishable este destinată folosirii în client.
Pentru Google OAuth, adaugă URL-ul GitHub Pages în Authentication -> URL Configuration / Redirect URLs în Supabase.

ACTUALIZARE 1.1 - MUZICĂ
- player YouTube persistent între paginile aplicației
- linkuri YouTube / youtu.be / Shorts / Live / YouTube Music acceptate
- buton fallback pentru deschidere în YouTube
- playlist romantic corectat
- după reîncărcare, ultima melodie poate fi reluată prin butonul Play (browserul nu permite autoplay automat la pornire)
- cache PWA actualizat la love-ai-html-v2
