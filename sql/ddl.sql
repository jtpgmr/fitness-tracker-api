create schema if not exists "healthApp";

-- Users Data
create table if not exists "healthApp"."users" (
    "serialId" int4 generated always as identity primary key,
    "id" uuid unique not null,
	"firstName" varchar(150) NOT NULL,
	"lastName" varchar(150) NOT NULL,
	"email" varchar(150) NOT NULL,
	"authProviderId" varchar(150) NOT NULL,
    "createdAt" timestamptz not null default now(),
    "createdBy" uuid NOT NULL references "healthApp"."users"("id"),
	"updatedAt" timestamptz null,
    "updatedBy" uuid NULL references "healthApp"."users"("id"),
    "deletedAt" timestamptz null,
    "deletedBy" uuid NULL references "healthApp"."users"("id")
);

create table if not exists "healthApp"."foodDataSource" (
    "serialId" int4 generated always as identity primary key,
    "id" uuid unique not null,
    "name" varchar not null,
    "code" varchar not null,
    "description" varchar null,
    "createdAt" timestamptz not null default now(),
    "createdBy" uuid NOT NULL references "healthApp"."users"("id"),
	"updatedAt" timestamptz null,
    "updatedBy" uuid NULL references "healthApp"."users"("id"),
    "deletedAt" timestamptz null,
    "deletedBy" uuid NULL references "healthApp"."users"("id")
);

-- need to add food data source
-- Food Data
create table if not exists "healthApp"."foods" (
    "serialId" int4 generated always as identity primary key,
    "id" uuid unique not null,
    "sourceId" uuid unique not null,
    "name" varchar(250) not null,
    "aliases" jsonb null,
    "category" varchar(50) not null,
    "categoryLabel" varchar(50) not null,
    "brand" varchar(100) null,
    "healthLabels" jsonb null,
    "cautions" jsonb null,
    "createdAt" timestamptz not null default now(),
	"updatedAt" timestamptz null,
    "deletedAt" timestamptz null
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

create table if not exists "healthApp"."nutritionData" (
    "serialId" int4 generated always as identity primary key,
    "id" uuid unique not null,
	"foodId" uuid not null references "healthApp"."foods"("id"),
    "contents" jsonb null,
    "calories" int4 not null,
    "servingWeight" int4 not null,
    "units" varchar(20) not null,
    "createdAt" timestamptz not null default now(),
	"updatedAt" timestamptz null,
    "deletedAt" timestamptz null
);

-- Exercises Data
create table if not exists "healthApp"."exercises" (
    "serialId" int4 generated always as identity primary key,
    "id" uuid unique not null,
	"name" varchar(250) NOT NULL,
	"description" varchar(250) NULL,
    "calories" int4 not null,
    "units" varchar(20) not null, -- enum,
    "createdAt" timestamptz not null default now(),
	"updatedAt" timestamptz null,
    "deletedAt" timestamptz null
);

-- Workout Data
create table if not exists "healthApp"."workouts" (
    "serialId" int4 generated always as identity primary key,
    "id" uuid unique not null,
    "userId" uuid NOT null references "healthApp"."users"("id"),
    "exercises" jsonb null, -- accepts an array of exerciseIds
    "checkInTime" timestamptz null,
    "checkOutTime" timestamptz null,
	"updatedAt" timestamptz null,
    "deletedAt" timestamptz null
);
