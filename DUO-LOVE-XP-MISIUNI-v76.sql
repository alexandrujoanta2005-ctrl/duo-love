-- =============================================================
-- DUO LOVE v76 · 100 MISIUNI XP (50 SOLO + 50 ÎMPREUNĂ)
-- Rulează o singură dată în proiectul Supabase DUO LOVE.
-- Scriptul caută automat tabela existentă de misiuni după coloane.
-- Nu modifică login-ul, cuplurile sau datele existente.
-- =============================================================

do $$
declare
  mission_table text;
begin
  select table_name into mission_table
  from information_schema.columns
  where table_schema = 'public'
    and column_name in ('mission_id','title','description','icon','xp_reward')
  group by table_name
  having count(distinct column_name) = 5
  order by case when table_name = 'daily_missions' then 0 else 1 end, table_name
  limit 1;

  if mission_table is null then
    raise exception 'Nu am găsit tabela existentă de misiuni (mission_id, title, description, icon, xp_reward). Oprește aici și trimite-mi structura bazei.';
  end if;

  raise notice 'Adaug misiunile în tabela public.%', mission_table;

  execute format($fmt$
    insert into public.%I (mission_id, title, description, icon, xp_reward)
    values
      ('c73d1ad5-29c4-5ac8-976b-eb8b86755b35', '👤 SOLO · Mesaj dulce', 'Trimite-i partenerului un mesaj sincer fără motiv.', '💌', 15),
      ('b92924c0-d4e2-54bb-8e35-96dd6720a204', '👤 SOLO · Trei lucruri frumoase', 'Scrie 3 lucruri pe care le apreciezi la partener.', '📝', 20),
      ('d4ef61a7-edd4-5ddc-b46b-0365ef55405d', '👤 SOLO · O poză pentru noi', 'Adaugă o fotografie nouă în Amintiri.', '📸', 20),
      ('08c90746-49ae-5e5c-835b-afc0926da0e9', '👤 SOLO · Melodia zilei', 'Alege o melodie care îți amintește de voi.', '🎵', 15),
      ('fc1c0740-1c84-5ef1-ae53-71d686d61cd0', '👤 SOLO · Setează-ți starea', 'Completează starea ta de azi în DUO LOVE.', '😊', 10),
      ('d1a63f41-db8e-5af0-8637-f49536d9d98d', '👤 SOLO · Amintire scurtă', 'Scrie o amintire de minimum 2 propoziții.', '💭', 20),
      ('a4a890b2-c8c0-5547-b97e-b3901e70d70b', '👤 SOLO · Un compliment', 'Spune-i un compliment sincer partenerului.', '❤️', 15),
      ('213207eb-35ed-5a07-92df-81108d113aaf', '👤 SOLO · Vizită la Teddy', 'Intră la Teddy și interacționează cu el.', '🧸', 10),
      ('cbc97bf6-d8ae-5c89-b4aa-ab98d9885c1b', '👤 SOLO · Plan pentru viitor', 'Adaugă un eveniment sau o idee de date.', '📅', 20),
      ('884122ae-33f9-57eb-9bd9-31f8da12b897', '👤 SOLO · Idee de surpriză', 'Notează o idee de surpriză pentru partener.', '🎁', 20),
      ('41d29d92-6132-5d85-9602-ee35d324fa22', '👤 SOLO · Mesaj de noapte bună', 'Trimite un mesaj de noapte bună.', '🌙', 15),
      ('f510219b-231a-5224-acd0-7409a4cd4706', '👤 SOLO · Mesaj de bună dimineața', 'Trimite un mesaj de bună dimineața.', '☀️', 15),
      ('1699a70b-d628-5819-b6fe-da953feff0cc', '👤 SOLO · Mesaj vocal', 'Trimite sau pregătește un mesaj vocal pentru partener.', '🎙️', 25),
      ('66693327-6d81-5752-9bbb-599b66742b3c', '👤 SOLO · Loc de vizitat', 'Alege un loc unde ai vrea să mergeți împreună.', '🗺️', 20),
      ('29269013-67b2-5ec6-a0fb-09bb8f79064b', '👤 SOLO · Film pentru noi', 'Alege un film sau serial pentru următoarea seară.', '🍿', 15),
      ('f0387220-47c4-5d03-8dcd-e23ff27a3224', '👤 SOLO · Mâncarea preferată', 'Notează ce ai vrea să mâncați la următorul date.', '🍝', 15),
      ('8273475e-5629-5a92-b11b-ea12ab26adbc', '👤 SOLO · Jurnal de azi', 'Scrie câteva rânduri despre ziua ta.', '📖', 20),
      ('7aa96173-9299-5c73-abc8-88131df34c8c', '👤 SOLO · Gest romantic', 'Fă azi un gest romantic mic.', '🌹', 25),
      ('b67f08b5-dc13-59af-8c22-e14417924e70', '👤 SOLO · Mulțumesc', 'Spune-i partenerului pentru ce îi mulțumești azi.', '🫶', 15),
      ('c1c1e8ec-e436-5bb3-96d1-887d73ef7414', '👤 SOLO · Un secret frumos', 'Pregătește o notă privată sau o surpriză.', '🔐', 25),
      ('d211342f-1290-5457-af91-34b343d46f6a', '👤 SOLO · Obiectiv personal', 'Fă un lucru bun pentru relație fără să ți se ceară.', '🎯', 20),
      ('0ee27932-df63-5182-a5e3-46bd2bdd9f35', '👤 SOLO · Fără scroll', 'Petrece 15 minute fără social media și scrie-i partenerului.', '📱', 20),
      ('8d19c8ac-6b31-553f-8b8e-a1f7f1fc0ecb', '👤 SOLO · Idee de cadou', 'Adaugă o idee de cadou pentru viitor.', '💐', 15),
      ('8b9bb9f8-5138-5e4b-8d9e-40ea59b69718', '👤 SOLO · Destinația zilei', 'Alege o destinație de vacanță pentru voi.', '🌍', 20),
      ('6c9b2463-e9a0-55d1-bbd2-83214b496cf5', '👤 SOLO · Întrebare profundă', 'Pregătește o întrebare pe care vrei să i-o pui.', '🧠', 20),
      ('0f823294-85ba-5e3e-8f68-9e688bfd75d9', '👤 SOLO · Fă-l/o să râdă', 'Trimite ceva amuzant partenerului.', '😂', 15),
      ('951db857-cd16-5edf-b9d1-bb91f83b1b1b', '👤 SOLO · Schimbă atmosfera', 'Alege o temă sau un fundal nou pentru aplicație.', '🎨', 10),
      ('161de6b7-dea6-54c6-b2e2-4094a9a5e45a', '👤 SOLO · Verifică următoarea dată', 'Verifică ce eveniment urmează pentru voi.', '📆', 10),
      ('0d8a840b-4774-54e8-accd-e8a6a67c13d5', '👤 SOLO · Amintire favorită', 'Alege amintirea ta preferată din aplicație.', '💎', 15),
      ('8b945050-78af-53fb-91d6-2d0ba78b8aa3', '👤 SOLO · Ține streak-ul', 'Intră azi și păstrează seria zilnică.', '🔥', 10),
      ('e77da6cd-fb9a-5f41-b510-601d608056fe', '👤 SOLO · Scrisoare mini', 'Scrie 5 rânduri pentru partener.', '📝', 25),
      ('6a377e58-3cc4-5523-9cbe-727e8608d161', '👤 SOLO · Playlist update', 'Adaugă o melodie nouă în lista voastră.', '🎧', 15),
      ('cca0c986-4407-5b5e-939c-9ec39a024109', '👤 SOLO · Poza veche', 'Găsește o poză veche pe care ai vrea să o păstrați.', '📷', 20),
      ('b166af34-1c37-544c-87c7-62b2acb52aa7', '👤 SOLO · Întreabă cum se simte', 'Întreabă-l/o sincer cum se simte azi.', '💬', 15),
      ('ba9e801b-0c17-5cd2-a11a-aa5f76bb8c6a', '👤 SOLO · Motivul zilei', 'Scrie un motiv pentru care îl/o iubești.', '🥰', 15),
      ('1e171adf-92fb-5ac4-9c18-2c0d08a29061', '👤 SOLO · Primul nostru...', 'Notează un detaliu despre unul dintre primele voastre momente.', '🕰️', 20),
      ('d2c85505-8c05-5840-a6a8-c3f4f736d322', '👤 SOLO · Cadou virtual', 'Trimite un gest sau mesaj simbolic.', '🎁', 15),
      ('b1af48dd-c92e-5f73-88ae-7cae3a70e301', '👤 SOLO · Invitație simplă', 'Propune o cafea, plimbare sau 20 minute împreună.', '☕', 20),
      ('7a9f8b16-0327-5c14-9831-ced2586a30fa', '👤 SOLO · Loc cu amintire', 'Alege un loc care are o poveste pentru voi.', '📍', 20),
      ('5ff0bdb1-1efa-5b06-a0dc-c2949be79718', '👤 SOLO · Vis comun', 'Scrie un vis pe care ai vrea să-l realizați împreună.', '🌌', 25),
      ('b509e091-9280-527b-8575-9a6db4a968af', '👤 SOLO · Susține-l/o', 'Trimite un mesaj de încurajare.', '💪', 15),
      ('545182a8-ce29-53ea-9bb5-326c4b5d137f', '👤 SOLO · Plan de aniversare', 'Adaugă o idee pentru următoarea aniversare.', '🎉', 20),
      ('02517f1f-2428-5ee3-896e-48dab82964be', '👤 SOLO · Plan de economii', 'Notează un lucru pentru care ați putea economisi împreună.', '💳', 20),
      ('980581fe-1375-5ff6-87a8-ca6a4093eea8', '👤 SOLO · Checklist de vacanță', 'Adaugă un lucru pe lista pentru o vacanță viitoare.', '🧳', 15),
      ('750440a6-670e-51d1-8f45-24d6a21da005', '👤 SOLO · Mică atenție', 'Pregătește o mică atenție pentru partener.', '🍫', 20),
      ('e31cd62a-29ca-5e10-af0c-b0f4f050f164', '👤 SOLO · Cunoaște-l/o mai bine', 'Află un lucru nou despre partener azi.', '📚', 20),
      ('e3f4c2e9-08fc-5f1a-98fc-5fd04064c2ee', '👤 SOLO · Ritual de seară', 'Încheie ziua cu un mesaj sau gând pentru voi.', '💤', 15),
      ('7d863b87-a550-512c-8426-156459573f8b', '👤 SOLO · Plan pentru weekend', 'Propune o activitate pentru weekend.', '🌤️', 20),
      ('9fb0ee3a-21fe-5f95-ad02-c2d5a5b56c7e', '👤 SOLO · Surpriză spontană', 'Fă ceva mic și neașteptat pentru partener.', '🪄', 25),
      ('29438773-e279-56c7-a741-acbc8e89458b', '👤 SOLO · Un minut de recunoștință', 'Gândește-te și notează ce a mers bine între voi azi.', '🤍', 15),
      ('f1df97eb-fa52-52f5-acec-135898ce2160', '👥 ÎMPREUNĂ · Îmbrățișare de 20 secunde', 'Stați într-o îmbrățișare de minimum 20 de secunde.', '🫂', 30),
      ('7f2d45ea-2f78-5d72-9478-c1f411a85f88', '👥 ÎMPREUNĂ · 20 minute fără telefoane', 'Petreceți 20 de minute împreună fără telefoane.', '📵', 35),
      ('6d3336b9-5cfe-5c12-a3a1-8d046fc12ded', '👥 ÎMPREUNĂ · Poză împreună', 'Faceți o fotografie nouă împreună.', '📸', 30),
      ('e70738fc-4f6a-5a86-8d93-614cd6fd2879', '👥 ÎMPREUNĂ · Schimb de melodii', 'Fiecare alege câte o melodie pentru celălalt.', '🎵', 30),
      ('027bc2a5-e3f0-55bb-9d0e-ded46abb00f5', '👥 ÎMPREUNĂ · Întrebarea serii', 'Puneți-vă pe rând o întrebare sinceră.', '💬', 30),
      ('bb2365b9-6250-52a4-884c-0394fb483961', '👥 ÎMPREUNĂ · Mini date', 'Faceți un mini date de minimum 30 de minute.', '☕', 40),
      ('0f6079b3-2839-5f7f-b063-0dfdb6256e9e', '👥 ÎMPREUNĂ · Seară de film', 'Alegeți și vedeți împreună un film sau episod.', '🍿', 35),
      ('2a5434db-75c8-5a2c-9243-5d31509e5d6c', '👥 ÎMPREUNĂ · Mâncați împreună', 'Luați o masă împreună fără grabă.', '🍝', 30),
      ('78ae9a2a-a675-557f-bc7b-79237bb988ea', '👥 ÎMPREUNĂ · Plimbare în doi', 'Faceți o plimbare de minimum 20 de minute.', '🚶', 35),
      ('3cb1a297-eff0-59b5-90d9-1c95e18abfaa', '👥 ÎMPREUNĂ · Râdeți împreună', 'Fiecare arată celuilalt ceva care îl face să râdă.', '😂', 25),
      ('5993c635-3f97-5359-8763-3f56b547218e', '👥 ÎMPREUNĂ · Cât de bine mă cunoști?', 'Puneți-vă câte 3 întrebări unul despre celălalt.', '🧠', 40),
      ('037178b0-1c7f-5f00-9ce0-4552516bb1af', '👥 ÎMPREUNĂ · Schimb de complimente', 'Fiecare spune 3 lucruri frumoase despre celălalt.', '💌', 35),
      ('5e978581-ee83-51f4-bdcc-145aed4652b2', '👥 ÎMPREUNĂ · Alegeți o destinație', 'Alegeți împreună un loc unde vreți să ajungeți.', '🌍', 30),
      ('9616f508-a6d1-594e-a3d1-c3bf37b715f2', '👥 ÎMPREUNĂ · Planificați un date', 'Stabiliți data și ideea următoarei ieșiri.', '📅', 40),
      ('9575dbbf-8644-5c67-9e2e-30a01b35d25f', '👥 ÎMPREUNĂ · Surpriză comună', 'Alegeți o surpriză pe care să o faceți unul pentru altul.', '🎁', 35),
      ('d0032bf4-a177-51c0-a143-baad06c1b1d0', '👥 ÎMPREUNĂ · Povestea unei amintiri', 'Povestiți fiecare aceeași amintire din perspectiva voastră.', '📖', 40),
      ('0a0e4480-aec7-558a-a1c0-2b63bc8c806b', '👥 ÎMPREUNĂ · Revedeți o poză veche', 'Alegeți o fotografie veche și vorbiți despre acel moment.', '🕰️', 30),
      ('10815105-66f3-53c6-9178-e00ed492306f', '👥 ÎMPREUNĂ · De ce te iubesc', 'Spuneți pe rând câte 5 motive pentru care vă iubiți.', '❤️', 45),
      ('ed401836-58ab-5618-8145-c1b823412c29', '👥 ÎMPREUNĂ · Provocare random', 'Alegeți o provocare de cuplu și faceți-o azi.', '🎲', 35),
      ('24f4463e-0544-583a-b483-d0dcb1f4206f', '👥 ÎMPREUNĂ · Ritual de seară', 'Încheiați ziua spunând fiecare cel mai bun moment al zilei.', '🌙', 30),
      ('c2774567-a6ed-5f7f-80a9-1c2c9702d603', '👥 ÎMPREUNĂ · Planul zilei', 'Dimineața, spuneți-vă ce vreți să faceți azi.', '☀️', 25),
      ('1501595d-6bde-51ae-80f4-fdd13ef0a2fe', '👥 ÎMPREUNĂ · Faceți ceva împreună', 'Rezolvați împreună o sarcină prin casă.', '🧹', 30),
      ('e48fff27-b184-5ae4-94d1-3722ba278255', '👥 ÎMPREUNĂ · Gătiți împreună', 'Pregătiți împreună o masă sau gustare.', '🍳', 40),
      ('4945f4bb-73ee-52f4-bec7-30716dd9c680', '👥 ÎMPREUNĂ · Joc în doi', 'Jucați un joc împreună timp de minimum 20 de minute.', '🎮', 35),
      ('34a94df6-8b02-57b3-9365-535a9e577af1', '👥 ÎMPREUNĂ · Karaoke în doi', 'Cântați împreună o melodie preferată.', '🎤', 30),
      ('8db228ac-7510-5861-9e64-ac52176fd1b7', '👥 ÎMPREUNĂ · Alegeți poza lunii', 'Alegeți împreună fotografia preferată din luna aceasta.', '🖼️', 30),
      ('1ce1346c-becf-520e-9262-d4da1a502ced', '👥 ÎMPREUNĂ · Bucket list update', 'Adăugați împreună un lucru nou pe lista voastră.', '🪣', 35),
      ('6e64e63e-e9d3-505f-af10-d9cf692ca6ad', '👥 ÎMPREUNĂ · Obiectiv comun', 'Stabiliți un obiectiv mic pentru următoarele 7 zile.', '🎯', 40),
      ('5850e364-67d1-542a-a49a-d916b5343d79', '👥 ÎMPREUNĂ · Plan comun', 'Alegeți un lucru pentru care vreți să economisiți.', '💰', 35),
      ('45d8cde1-8b78-5933-bcdc-c93b65360545', '👥 ÎMPREUNĂ · Vis de vacanță', 'Construiți împreună o idee de vacanță.', '🧳', 40),
      ('c4098588-a16f-5f64-91f5-74cd13a43aa9', '👥 ÎMPREUNĂ · Cină fără telefoane', 'Luați o masă fără telefoane pe masă.', '📵', 40),
      ('0421b185-00d0-5213-a2a1-0e45bcf7f894', '👥 ÎMPREUNĂ · Gest romantic reciproc', 'Fiecare face un gest romantic mic pentru celălalt.', '🌹', 45),
      ('7784093f-306c-5a24-923e-626c95dc8e50', '👥 ÎMPREUNĂ · DUO LOVE împreună', 'Intrați amândoi în aplicație și adăugați câte ceva.', '📱', 30),
      ('99ad4164-ad70-5e34-a114-b5c5af02d8a2', '👥 ÎMPREUNĂ · Mood check', 'Spuneți-vă pe rând cum vă simțiți cu adevărat.', '😊', 35),
      ('2d29b36f-49e2-5cbe-af12-653bd17a0146', '👥 ÎMPREUNĂ · Un lucru de îmbunătățit', 'Alegeți cu blândețe un lucru pe care îl puteți îmbunătăți împreună.', '🤝', 45),
      ('50bc55c4-db03-591e-8325-b212cb70eedb', '👥 ÎMPREUNĂ · Planificați o sărbătoare', 'Faceți un plan pentru următoarea zi importantă.', '🎉', 35),
      ('e234d826-0055-5dac-ab88-d994d235b9a8', '👥 ÎMPREUNĂ · Recreați o poză', 'Încercați să recreați o fotografie veche.', '📸', 50),
      ('5282c2bb-69b1-578f-8a1a-a5f87e138a87', '👥 ÎMPREUNĂ · Vorbiți despre viitor', 'Discutați 15 minute despre un vis comun.', '🌌', 45),
      ('5c8aca5f-f997-55d1-9bfb-23c7cdaefc17', '👥 ÎMPREUNĂ · Desert date', 'Luați sau pregătiți un desert împreună.', '🍨', 35),
      ('60083324-f10a-5a2f-b4c4-de395e0930bc', '👥 ÎMPREUNĂ · Mini aventură', 'Mergeți într-un loc apropiat unde nu mergeți de obicei.', '🚗', 50),
      ('a1d57dc9-8b6c-58eb-a52f-c7aa852ea6ed', '👥 ÎMPREUNĂ · Creați ceva', 'Desenați, decorați sau creați ceva împreună.', '🎨', 45),
      ('d4fa3c56-7abf-56a3-80f9-6a7b559b49e7', '👥 ÎMPREUNĂ · Învățați ceva', 'Uitați-vă împreună la ceva din care aflați un lucru nou.', '📚', 35),
      ('eb3d34ef-7295-59f8-beb8-da413eee3340', '👥 ÎMPREUNĂ · Recunoștință în doi', 'Fiecare spune ce a apreciat la celălalt azi.', '🫶', 35),
      ('365d18ca-47c3-55ee-960b-17d05a3f9bb7', '👥 ÎMPREUNĂ · Noapte bună în doi', 'Încheiați seara cu 5 minute fără ecrane.', '💤', 30),
      ('cdc2be8e-a32f-5206-8534-a40f45da3190', '👥 ÎMPREUNĂ · Weekend plan', 'Alegeți împreună o activitate pentru weekend.', '🌤️', 35),
      ('6ff271dd-e68d-5c8f-b1a3-dd8fb56dd60f', '👥 ÎMPREUNĂ · Playlist în doi', 'Adăugați fiecare câte o melodie în playlist.', '🎧', 30),
      ('46397e0e-35e1-537f-b939-0264783a4370', '👥 ÎMPREUNĂ · Harta noastră', 'Alegeți un loc important și povestiți ce înseamnă pentru voi.', '🗺️', 35),
      ('01a8fe5b-eb87-5863-baad-34dcbcfa2765', '👥 ÎMPREUNĂ · Momentul săptămânii', 'Alegeți împreună cel mai frumos moment din ultimele 7 zile.', '💎', 40),
      ('050366ed-bbd9-50be-84cd-d1221da9c043', '👥 ÎMPREUNĂ · Surpriză în echipă', 'Pregătiți împreună o surpriză pentru viitorul vostru.', '🪄', 45),
      ('f0b052e2-2a1d-5097-80dd-58749f900511', '👥 ÎMPREUNĂ · Promisiune mică', 'Faceți fiecare câte o promisiune realistă pentru următoarea săptămână.', '♾️', 40)
    on conflict (mission_id) do update set
      title = excluded.title,
      description = excluded.description,
      icon = excluded.icon,
      xp_reward = excluded.xp_reward
  $fmt$, mission_table);
end $$;

-- Verificare simplă
do $$
declare
  mission_table text;
  cnt bigint;
begin
  select table_name into mission_table
  from information_schema.columns
  where table_schema = 'public'
    and column_name in ('mission_id','title','description','icon','xp_reward')
  group by table_name
  having count(distinct column_name) = 5
  order by case when table_name = 'daily_missions' then 0 else 1 end, table_name
  limit 1;

  if mission_table is not null then
    execute format('select count(*) from public.%I where title like ''%%SOLO · %%'' or title like ''%%ÎMPREUNĂ · %%''', mission_table) into cnt;
    raise notice 'Misiuni v76 găsite în tabelă: %', cnt;
  end if;
end $$;
