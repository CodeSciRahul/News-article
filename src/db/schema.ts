import {varchar, text,timestamp, integer, serial, pgTable, json } from "drizzle-orm/pg-core";


export const userPreferences = pgTable("userPreferences", {
    userId: varchar('user_id').primaryKey().notNull().unique(),
    category: json('category'),
    language: varchar('language', {length: 30}).default('eng'),
    location: varchar('location', {length: 70}).default('in')
})


export const articles = pgTable("articles", {
    id: serial("id").primaryKey().notNull(),
    userId: varchar('user_id', {length: 255}).notNull().unique(),
    title: varchar('title', {length: 255}).notNull(),
    link: varchar('link', {length: 512}).notNull(),
    snippet: varchar('snippet').notNull(),
    date: varchar('date', {length: 50}),
    source: varchar('source'),
    imageUrl: varchar('image_url', {length: 512}),
    category: varchar('category', {length: 50}).notNull(),
    createdAt: timestamp('created_at').defaultNow()
})