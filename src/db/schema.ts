import {varchar,timestamp, serial, pgTable, json } from "drizzle-orm/pg-core";


export const userPreferences = pgTable("userPreferences", {
    userId: varchar('user_id').primaryKey().notNull().unique(),
    category: json('category'),
    language: varchar('language', {length: 30}).default('eng'),
    location: varchar('location', {length: 70}).default('in')
})


export const articles = pgTable("articles", {
    id: serial("id").primaryKey().notNull().unique(),
    userId: varchar('user_id', {length: 290}).notNull(),
    title: varchar('title', {length: 512}).notNull(),
    link: varchar('link', {length: 700}).notNull(),
    snippet: varchar('snippet').notNull(),
    date: varchar('date', {length: 80}),
    source: varchar('source'),
    imageUrl: varchar('image_url', {length: 812}),
    category: varchar('category', {length: 70}).notNull(),
    createdAt: timestamp('created_at').defaultNow()
})