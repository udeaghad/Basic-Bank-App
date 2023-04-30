import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('trxns', table => {
    table.integer('bank_code')
    table.text('bank')
    table.text('account_number')
    table.text('account_name')
    table.integer('reference')
    table.string('currency')
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('trxns', table => {
    table.dropColumns('bank_code', 'bank', 'account_number', 'account_name', 'reference', 'currency')
  });
}

