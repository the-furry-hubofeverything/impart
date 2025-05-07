import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class NsfwTags1746577567101 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.addColumn(
      'tag',
      new TableColumn({
        name: 'isNsfw',
        type: 'boolean',
        isNullable: true,
        default: false
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('tag', 'isNsfw')
  }
}
