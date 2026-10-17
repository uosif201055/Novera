CREATE TABLE IF NOT EXISTS foundations (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL UNIQUE,
 description TEXT NOT NULL,
 position INTEGER NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS chapters (
 id TEXT PRIMARY KEY,
 foundation_id TEXT REFERENCES foundations(id),
 title TEXT NOT NULL,
 summary TEXT NOT NULL DEFAULT '',
 position INTEGER NOT NULL,
 published BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS lessons (
 id TEXT PRIMARY KEY,
 chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
 title TEXT NOT NULL,
 body TEXT NOT NULL,
 position INTEGER NOT NULL,
 UNIQUE(chapter_id, position)
);
CREATE TABLE IF NOT EXISTS learners (
 id UUID PRIMARY KEY,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS chapter_progress (
 learner_id UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
 chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
 step INTEGER NOT NULL DEFAULT 0 CHECK (step >= 0),
 completed BOOLEAN NOT NULL DEFAULT FALSE,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 PRIMARY KEY(learner_id, chapter_id)
);
INSERT INTO foundations (id,name,description,position) VALUES
('lithra','lithra','ground and natural solid materials',1),
('aethra','aethra','air wind and the atmosphere',2),
('hydria','hydria','water and its behavior',3)
ON CONFLICT(id) DO NOTHING;
INSERT INTO chapters (id,foundation_id,title,summary,position,published)
VALUES ('chapter-1',NULL,'meet the world','an introduction to lithra aethra hydria and observation',1,TRUE)
ON CONFLICT(id) DO NOTHING;
