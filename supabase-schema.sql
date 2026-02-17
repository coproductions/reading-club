-- Phoenix & Papa's Book Club - Database Schema
-- Run this in the Supabase SQL Editor

-- Books table
create table public.books (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  author        text not null,
  cover_url     text,
  google_books_id text,
  status        text not null default 'want_to_read'
                  check (status in ('reading', 'completed', 'want_to_read')),
  start_date    date,
  end_date      date,
  rating        smallint check (rating >= 1 and rating <= 5),
  review        text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Vocab words table
create table public.vocab_words (
  id            uuid primary key default gen_random_uuid(),
  book_id       uuid not null references public.books(id) on delete cascade,
  word          text not null,
  definition    text,
  part_of_speech text,
  phonetic      text,
  example       text,
  learned       boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Flashcard progress table
create table public.flashcard_progress (
  id            uuid primary key default gen_random_uuid(),
  vocab_word_id uuid not null references public.vocab_words(id) on delete cascade,
  times_tested  integer not null default 0,
  times_correct integer not null default 0,
  last_tested   timestamptz,
  unique(vocab_word_id)
);

-- Indexes
create index idx_books_status on public.books(status);
create index idx_vocab_book_id on public.vocab_words(book_id);
create index idx_flashcard_vocab on public.flashcard_progress(vocab_word_id);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger books_updated_at
  before update on public.books
  for each row execute function update_updated_at();

-- Enable RLS
alter table public.books enable row level security;
alter table public.vocab_words enable row level security;
alter table public.flashcard_progress enable row level security;

-- Books policies
create policy "books_select" on public.books for select using (true);
create policy "books_insert" on public.books for insert with check (auth.role() = 'authenticated');
create policy "books_update" on public.books for update using (auth.role() = 'authenticated');
create policy "books_delete" on public.books for delete using (auth.role() = 'authenticated');

-- Vocab words policies
create policy "vocab_select" on public.vocab_words for select using (true);
create policy "vocab_insert" on public.vocab_words for insert with check (auth.role() = 'authenticated');
create policy "vocab_update" on public.vocab_words for update using (auth.role() = 'authenticated');
create policy "vocab_delete" on public.vocab_words for delete using (auth.role() = 'authenticated');

-- Flashcard progress policies
create policy "progress_select" on public.flashcard_progress for select using (true);
create policy "progress_insert" on public.flashcard_progress for insert with check (auth.role() = 'authenticated');
create policy "progress_update" on public.flashcard_progress for update using (auth.role() = 'authenticated');
create policy "progress_delete" on public.flashcard_progress for delete using (auth.role() = 'authenticated');
