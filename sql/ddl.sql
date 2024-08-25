create schema if not exists "healthApp";

-- Users Data
create table if not exists "healthApp"."users" (
    "serialId" int4 generated always as identity primary key,
    "id" uuid unique not null,
	"firstName" varchar(150) NOT NULL,
	"lastName" varchar(150) NOT NULL,
	"email" varchar(150) NOT NULL,
	"cognitoId" varchar(150) NOT NULL,
    "createdAt" timestamptz not null default now(),
    "createdBy" uuid NOT NULL references "healthApp"."users"("id"),
	"updatedAt" timestamptz null,
    "updatedBy" uuid NULL references "healthApp"."users"("id"),
    "deletedAt" timestamptz null,
    "deletedBy" uuid NULL references "healthApp"."users"("id")
);

-- User Food Diaries Data
create table if not exists "healthApp"."diaries" (
    "serialId" int4 generated always as identity primary key,
    "id" uuid unique not null,
    "userId" uuid NOT null references "healthApp"."users"("id"),
    "mealType" int2 not null check("mealType" in (1, 2, 3, 4)), -- enum for 1: Breakfast; 2: Lunch; 3: Dinner; 4: Snack
    "meal" jsonb not null, -- accepts an array of foodIds
    "createdAt" timestamptz not null default now(),
    "createdBy" uuid NOT NULL references "healthApp"."users"("id"),
	"updatedAt" timestamptz null,
    "updatedBy" uuid NULL references "healthApp"."users"("id"),
    "deletedAt" timestamptz null,
    "deletedBy" uuid NULL references "healthApp"."users"("id")
);

