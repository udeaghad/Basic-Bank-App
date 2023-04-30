import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('accts', table => {    
    table.specificType('id', 'INT(10) ZEROFILL AUTO_INCREMENT').primary()
    table.string('name', 255).notNullable()
    table.string('email', 255).notNullable()
    table.text('password', 'longtext').notNullable()
    table.decimal('balance', 8,2).defaultTo(0.00)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('trxns', table => {
      table.increments()
      table.decimal('deposit', 8,2).defaultTo(0.00)
      table.decimal('withdraw', 8,2).defaultTo(0.00)
      table.decimal('balance', 8,2).defaultTo(0.00)
      table.text('remarks', 'mediumtext')
      table
        .specificType('acct_id', 'INT(10) ZEROFILL')
        .references('id')
        .inTable('accts')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('accts')
    .dropTableIfExists('trxns')
}


