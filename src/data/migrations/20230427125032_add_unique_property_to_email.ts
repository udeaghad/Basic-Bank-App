import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('accts', table => {
    table.unique(['email']);
});
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('accts', table => {
    table.dropUnique(['email'])
  })
}

