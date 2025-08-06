// Re-export all utilities
export { generateId, generateShortId, isValidId } from './generateId';
export * from './formatters';
export { migrateCategoryData, ensureDefaultCategories, syncCategoryChanges, migrateCategoriesToIncludeIcons } from './categoryMigration';
