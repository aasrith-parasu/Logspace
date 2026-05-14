-- ─────────────────────────────────────────────────────────────────────────────
-- Logspace — Full Seed Data (UUID-safe version)
-- Run in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Users (text pk, no uuid issue) ───────────────────────────────────────────
insert into public.users (id, username, display_name, avatar, bio, location, interests, followers_count, following_count, total_projects, total_entries, social_links)
values
  ('demo-alex-001', 'alex_builds', 'Alex Rivera',
   'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
   'Full-stack dev & indie hacker. Building in public since 2023. Currently: AI tools, game dev, and a novel.',
   'Berlin, Germany', array['Tech & Coding','Game Development','Writing & Storytelling'],
   2840, 134, 5, 11,
   '{"github":"https://github.com","twitter":"https://x.com","website":"https://example.com"}'::jsonb),
  ('demo-maya-002', 'maya_builds', 'Maya Chen',
   'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
   'Full-stack dev obsessed with Rust and WebAssembly. Building a 2D game engine in public.',
   'San Francisco, CA', array['Tech & Coding','Game Development'],
   1240, 89, 2, 6,
   '{"github":"https://github.com","twitter":"https://x.com"}'::jsonb),
  ('demo-zara-003', 'zara_creates', 'Zara Okonkwo',
   'https://api.dicebear.com/7.x/avataaars/svg?seed=zara',
   'Illustrator & animator. Documenting my journey from freelancer to studio founder.',
   'London, UK', array['Art & Design','Film & Video','Business & Entrepreneurship'],
   3800, 145, 2, 5,
   '{"twitter":"https://x.com","linkedin":"https://linkedin.com","website":"https://example.com"}'::jsonb),
  ('demo-ravi-004', 'dev_ravi', 'Ravi Sharma',
   'https://api.dicebear.com/7.x/avataaars/svg?seed=ravi',
   'Indie hacker. Building SaaS tools for creators. 0 to $1k MRR in public.',
   'Bangalore, India', array['Tech & Coding','Business & Entrepreneurship'],
   2100, 67, 2, 5,
   '{"github":"https://github.com","twitter":"https://x.com"}'::jsonb)
on conflict (id) do nothing;

-- ── Projects (uuid pk — let postgres generate them, store in a temp table) ────
create temp table if not exists _seed_projects (
  key text primary key,
  id  uuid
);

-- Insert projects and capture generated UUIDs
with ins as (
  insert into public.projects (user_id, title, slug, tagline, description, categories, cover_image, start_date, status, visibility, entry_count, follower_count, total_reactions, streak_count, linked_urls, health_score)
  values
    ('demo-alex-001','Voxel Forge','voxel-forge','A voxel game engine built from scratch in Rust','Building a fully featured voxel engine in Rust — chunk streaming, procedural generation, multiplayer.',array['Tech & Coding','Game Development'],'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80','2024-02-01','Active','Public',3,1240,8900,22,'[{"label":"GitHub","url":"https://github.com"}]'::jsonb,94),
    ('demo-alex-001','DraftMind','draftmind','AI writing assistant that actually understands context','Building an AI writing tool that keeps track of your characters, plot threads, and world-building.',array['Tech & Coding','Writing & Storytelling'],'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80','2025-06-15','Active','Public',2,890,4200,15,'[{"label":"GitHub","url":"https://github.com"},{"label":"Waitlist","url":"https://example.com"}]'::jsonb,88),
    ('demo-alex-001','The Glass Meridian','the-glass-meridian','A sci-fi novel about memory, identity, and the cost of immortality','Writing my debut novel in public. 90,000 word target.',array['Writing & Storytelling'],'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80','2025-01-10','Active','Public',2,430,2100,6,'[]'::jsonb,72),
    ('demo-alex-001','Metricly','metricly','Analytics dashboard for indie hackers — no fluff, just signal','Building the analytics tool I always wanted. Dead simple, fast, privacy-first.',array['Tech & Coding','Business & Entrepreneurship'],'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80','2023-09-01','Completed','Public',2,1890,12400,0,'[{"label":"GitHub","url":"https://github.com"},{"label":"Product Hunt","url":"https://producthunt.com"}]'::jsonb,100),
    ('demo-alex-001','Shipfast CLI','shipfast-cli','Deploy any project in one command — open source','A CLI tool that wraps the most common deployment workflows into a single command.',array['Tech & Coding'],'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80','2024-08-20','On Hold','Public',2,560,2800,0,'[{"label":"GitHub","url":"https://github.com"}]'::jsonb,55),
    ('demo-maya-002','Pixel Engine','pixel-engine','A 2D game engine written from scratch in Rust','Building a fully functional 2D game engine in Rust with WebAssembly compilation target.',array['Tech & Coding','Game Development'],'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80','2024-01-20','Active','Public',3,847,4200,14,'[{"label":"GitHub","url":"https://github.com"}]'::jsonb,92),
    ('demo-maya-002','DevDash','devdash','A personal dashboard for developers — metrics, todos, and focus mode','Building the dashboard I always wanted as a dev. Integrates GitHub, Linear, and Spotify.',array['Tech & Coding'],'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80','2025-03-10','Active','Public',2,560,2800,9,'[{"label":"GitHub","url":"https://github.com"}]'::jsonb,85),
    ('demo-zara-003','Studio Zero','studio-zero','Building my animation studio from a bedroom to a real business','Documenting the full journey of turning my freelance illustration work into a proper animation studio.',array['Art & Design','Business & Entrepreneurship'],'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80','2023-11-25','Active','Public',3,2340,18900,24,'[{"label":"Portfolio","url":"https://example.com"},{"label":"YouTube","url":"https://youtube.com"}]'::jsonb,98),
    ('demo-zara-003','Chromatic','chromatic','An animated short film about synesthesia — made entirely in public','Documenting the production of my first animated short. Every frame, every sound design decision.',array['Art & Design','Film & Video'],'https://images.unsplash.com/photo-1536240478700-b869ad10e128?w=800&q=80','2025-04-01','Active','Public',2,1100,6700,18,'[{"label":"YouTube","url":"https://youtube.com"}]'::jsonb,90),
    ('demo-ravi-004','FormFlow','formflow','No-code form builder for indie hackers — $0 to $1k MRR','Building FormFlow in public. A lightweight, beautiful form builder that does not cost $50/month.',array['Tech & Coding','Business & Entrepreneurship'],'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80','2024-02-15','Active','Public',3,1560,9800,18,'[{"label":"GitHub","url":"https://github.com"},{"label":"Product Hunt","url":"https://producthunt.com"}]'::jsonb,88),
    ('demo-ravi-004','PricePilot','pricepilot','Dynamic pricing engine for SaaS — A/B test your pricing page automatically','Tired of guessing what to charge? PricePilot runs continuous pricing experiments.',array['Tech & Coding','Business & Entrepreneurship'],'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80','2025-09-01','Active','Public',2,780,3400,11,'[{"label":"GitHub","url":"https://github.com"}]'::jsonb,82)
  on conflict (user_id, slug) do nothing
  returning id, slug
)
insert into _seed_projects (key, id)
select slug, id from ins;

-- ── Entries (reference project UUIDs via the temp table) ─────────────────────
insert into public.entries (project_id, user_id, title, body, date, is_milestone, mood_tag, media_urls, reactions, comment_count, view_count, hashtags)

-- Alex / Voxel Forge
select p.id,'demo-alex-001','Chunk streaming is finally smooth','After two weeks of fighting with async Rust and the borrow checker, chunk streaming is working at 60fps. The trick was double-buffering the mesh generation on a separate thread pool and only swapping when the GPU is idle.','2026-05-12'::date,true,'Breakthrough',array['https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80'],'{"heart":234,"fire":189,"celebrate":145,"inspired":98}'::jsonb,34,2800,array['#rust','#gamedev','#voxel'] from _seed_projects p where p.key='voxel-forge'
union all
select p.id,'demo-alex-001','Procedural terrain — first pass','Got basic Perlin noise terrain generating. It looks rough but the bones are there. Next step is biome blending and cave systems.','2026-05-08',false,'Grinding',array[]::text[],'{"heart":89,"fire":67,"celebrate":34,"inspired":56}'::jsonb,12,980,array['#procgen','#rust'] from _seed_projects p where p.key='voxel-forge'
union all
select p.id,'demo-alex-001','Day 1 — why am I doing this','Starting a voxel engine from scratch in Rust. Everyone says use an existing engine. I say: where is the fun in that? Goal: playable multiplayer demo by end of 2026.','2024-02-01',false,'Just Getting Started',array[]::text[],'{"heart":45,"fire":78,"celebrate":23,"inspired":112}'::jsonb,8,560,array['#rust','#gamedev'] from _seed_projects p where p.key='voxel-forge'

-- Alex / DraftMind
union all
select p.id,'demo-alex-001','First 100 waitlist signups','DraftMind hit 100 waitlist signups today, 48 hours after I posted on X. Writers are desperate for tools that actually understand narrative structure. Shipping the beta in 3 weeks.','2026-05-10',true,'Shipped',array['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80'],'{"heart":312,"fire":234,"celebrate":189,"inspired":267}'::jsonb,56,4500,array['#ai','#buildinpublic','#saas'] from _seed_projects p where p.key='draftmind'
union all
select p.id,'demo-alex-001','Context window problem — solved','The core challenge: how do you keep a 200-page novel in context? Answer: you do not. Instead I built a semantic index of characters, locations, and plot events that gets queried per-generation. Latency is 40ms.','2026-04-28',false,'Breakthrough',array[]::text[],'{"heart":145,"fire":112,"celebrate":67,"inspired":134}'::jsonb,23,1890,array['#ai','#llm','#writing'] from _seed_projects p where p.key='draftmind'

-- Alex / The Glass Meridian
union all
select p.id,'demo-alex-001','Chapter 12 — the hardest scene','The scene where Mara realizes her memories have been edited took me three weeks and six complete rewrites. The final version is quiet. She just notices a scar she does not remember getting. Word count: 61,400.','2026-05-11',false,'Grinding',array[]::text[],'{"heart":89,"fire":34,"celebrate":56,"inspired":112}'::jsonb,18,1200,array['#amwriting','#scifi','#novel'] from _seed_projects p where p.key='the-glass-meridian'
union all
select p.id,'demo-alex-001','Halfway there — 45k words','Hit the halfway mark today. The story is messier than I planned but more alive than I expected. The characters keep doing things I did not intend. I am choosing to see that as a good sign.','2026-03-22',true,'Exploring',array[]::text[],'{"heart":134,"fire":67,"celebrate":89,"inspired":145}'::jsonb,24,1560,array['#writing','#milestone'] from _seed_projects p where p.key='the-glass-meridian'

-- Alex / Metricly
union all
select p.id,'demo-alex-001','Acquired — Metricly sold for $28k','After 14 months of building, Metricly was acquired for $28,000. 340 paying customers at acquisition. Everything I learned is going into DraftMind.','2025-11-15',true,'Shipped',array['https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=80'],'{"heart":567,"fire":445,"celebrate":389,"inspired":312}'::jsonb,98,12000,array['#indiehacker','#acquired','#buildinpublic'] from _seed_projects p where p.key='metricly'
union all
select p.id,'demo-alex-001','Hit $500 MRR','Metricly crossed $500 MRR this morning. 52 paying customers. The pricing change from $9 to $15/month was the unlock — barely any churn and revenue jumped 40%.','2025-06-03',true,'Breakthrough',array[]::text[],'{"heart":234,"fire":198,"celebrate":167,"inspired":145}'::jsonb,45,5600,array['#saas','#mrr','#indiehacker'] from _seed_projects p where p.key='metricly'

-- Alex / Shipfast CLI
union all
select p.id,'demo-alex-001','Putting this on hold','Shipfast CLI has 340 GitHub stars and I am proud of it, but I do not have the bandwidth to maintain it properly right now. Putting it on hold while I focus on DraftMind.','2025-09-10',false,'Rethinking',array[]::text[],'{"heart":78,"fire":23,"celebrate":12,"inspired":89}'::jsonb,34,1200,array['#opensource','#cli'] from _seed_projects p where p.key='shipfast-cli'
union all
select p.id,'demo-alex-001','100 GitHub stars in 48 hours','Posted Shipfast CLI on Hacker News yesterday. Woke up to 100 stars. People are tired of deployment complexity. Adding Docker support this week.','2024-09-15',true,'Shipped',array[]::text[],'{"heart":189,"fire":156,"celebrate":134,"inspired":112}'::jsonb,45,3400,array['#opensource','#hackernews','#cli'] from _seed_projects p where p.key='shipfast-cli'

-- Maya / Pixel Engine
union all
select p.id,'demo-maya-002','Renderer is finally working','After 3 weeks of fighting with WebGL contexts and the borrow checker, the basic sprite renderer is working. I can now render 10,000 sprites at 60fps. The key insight was batching draw calls by texture atlas.','2026-05-10',true,'Breakthrough',array['https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80'],'{"heart":142,"fire":89,"celebrate":67,"inspired":45}'::jsonb,23,1240,array['#rust','#gamedev','#webassembly'] from _seed_projects p where p.key='pixel-engine'
union all
select p.id,'demo-maya-002','Physics system — day 1','Starting the physics integration today. Going with a simplified AABB collision system first before adding anything fancy. Basic platformer physics by end of week.','2026-05-08',false,'Grinding',array[]::text[],'{"heart":34,"fire":28,"celebrate":12,"inspired":19}'::jsonb,8,456,array['#physics','#gamedev'] from _seed_projects p where p.key='pixel-engine'
union all
select p.id,'demo-maya-002','Why I am building this','I have used Unity, Godot, and Bevy. They are all great. But I want to understand what is happening under the hood. So I am building my own. This is going to take a long time and I am completely fine with that.','2024-01-20',false,'Just Getting Started',array[]::text[],'{"heart":67,"fire":89,"celebrate":34,"inspired":134}'::jsonb,15,890,array['#rust','#gamedev'] from _seed_projects p where p.key='pixel-engine'

-- Maya / DevDash
union all
select p.id,'demo-maya-002','GitHub integration shipped','DevDash now pulls your commit history, open PRs, and review requests directly into the dashboard. The OAuth flow was surprisingly painless. Next up: Linear integration.','2026-05-09',true,'Shipped',array['https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80'],'{"heart":98,"fire":78,"celebrate":56,"inspired":67}'::jsonb,19,1100,array['#github','#devtools','#opensource'] from _seed_projects p where p.key='devdash'
union all
select p.id,'demo-maya-002','Focus mode — first prototype','Built a Pomodoro-style focus mode that hides everything except your current task and a timer. My deep work sessions went from 45 minutes to 90 minutes on average.','2026-04-20',false,'Exploring',array[]::text[],'{"heart":56,"fire":45,"celebrate":34,"inspired":78}'::jsonb,11,670,array['#productivity','#devtools'] from _seed_projects p where p.key='devdash'

-- Zara / Studio Zero
union all
select p.id,'demo-zara-003','First client contract signed — $12k project','We did it. Signed our first proper studio contract today — a 12-week animation project for a UK-based fintech startup. The rate is 3x what I was charging as a freelancer.','2026-05-09',true,'Shipped',array['https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80'],'{"heart":456,"fire":312,"celebrate":289,"inspired":198}'::jsonb,87,8900,array['#studiozero','#animation','#milestone'] from _seed_projects p where p.key='studio-zero'
union all
select p.id,'demo-zara-003','Hired our first employee','Brought on a junior animator today. Paying a real salary for the first time. Terrifying and exciting in equal measure. The studio is no longer just me.','2026-03-15',true,'Breakthrough',array[]::text[],'{"heart":312,"fire":198,"celebrate":267,"inspired":234}'::jsonb,56,5600,array['#studiozero','#hiring','#animation'] from _seed_projects p where p.key='studio-zero'
union all
select p.id,'demo-zara-003','Month 1 — $0 revenue, infinite lessons','First month as a studio. Zero revenue. Spent the whole time setting up contracts, accounting, and a proper client pipeline. Boring but necessary.','2023-12-25',false,'Grinding',array[]::text[],'{"heart":89,"fire":56,"celebrate":34,"inspired":112}'::jsonb,23,1800,array['#studiozero','#startup'] from _seed_projects p where p.key='studio-zero'

-- Zara / Chromatic
union all
select p.id,'demo-zara-003','Animatic complete — 4 minutes 20 seconds','The full animatic for Chromatic is done. Every scene is blocked out, the timing feels right, and the sound design scratch track is giving me chills. Now the real work begins.','2026-05-07',true,'Shipped',array['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80'],'{"heart":234,"fire":178,"celebrate":156,"inspired":289}'::jsonb,45,4200,array['#animation','#shortfilm','#chromatic'] from _seed_projects p where p.key='chromatic'
union all
select p.id,'demo-zara-003','Why synesthesia?','I have synesthesia. Colors have sounds for me. Music has shapes. I have never seen it depicted accurately in film. So I am making the film I always wanted to watch.','2025-04-01',false,'Just Getting Started',array[]::text[],'{"heart":345,"fire":123,"celebrate":89,"inspired":456}'::jsonb,67,5100,array['#animation','#synesthesia','#shortfilm'] from _seed_projects p where p.key='chromatic'

-- Ravi / FormFlow
union all
select p.id,'demo-ravi-004','Hit $500 MRR — halfway there','FormFlow crossed $500 MRR today. 47 paying customers. The biggest unlock was switching from a per-form pricing model to a flat monthly subscription. Churn dropped from 18% to 6% overnight.','2026-05-12',true,'Breakthrough',array['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80'],'{"heart":234,"fire":189,"celebrate":156,"inspired":123}'::jsonb,45,4500,array['#indiehacker','#saas','#buildinpublic'] from _seed_projects p where p.key='formflow'
union all
select p.id,'demo-ravi-004','First paying customer','Someone just paid $9 for FormFlow. I have been building for 6 weeks. This is the first dollar. I am going to frame the Stripe notification.','2024-04-01',true,'Shipped',array[]::text[],'{"heart":345,"fire":267,"celebrate":312,"inspired":189}'::jsonb,67,5600,array['#firstdollar','#saas','#indiehacker'] from _seed_projects p where p.key='formflow'
union all
select p.id,'demo-ravi-004','Why I am building this','I needed a form builder for a side project. Typeform wanted $50/month. Google Forms looks like it is from 2009. So I am building my own.','2024-02-15',false,'Just Getting Started',array[]::text[],'{"heart":89,"fire":112,"celebrate":45,"inspired":167}'::jsonb,23,1200,array['#saas','#buildinpublic'] from _seed_projects p where p.key='formflow'

-- Ravi / PricePilot
union all
select p.id,'demo-ravi-004','First experiment result — 34% revenue lift','PricePilot ran its first real A/B test on a customer pricing page. Variant B produced a 34% revenue lift over 2 weeks. The customer is now a paying user.','2026-05-11',true,'Breakthrough',array[]::text[],'{"heart":178,"fire":145,"celebrate":112,"inspired":134}'::jsonb,34,2800,array['#pricing','#saas','#abtesting'] from _seed_projects p where p.key='pricepilot'
union all
select p.id,'demo-ravi-004','The insight that started this','I spent 3 months A/B testing pricing for FormFlow manually. Spreadsheets, Notion docs, custom analytics. It was a nightmare. PricePilot is the better way.','2025-09-01',false,'Just Getting Started',array[]::text[],'{"heart":67,"fire":89,"celebrate":34,"inspired":112}'::jsonb,15,890,array['#pricing','#saas','#indiehacker'] from _seed_projects p where p.key='pricepilot';

-- ── Cleanup ───────────────────────────────────────────────────────────────────
drop table if exists _seed_projects;
