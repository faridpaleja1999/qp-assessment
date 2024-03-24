import { MigrationInterface, QueryRunner } from "typeorm";
import user from "./table/user";

export class userSeeder1710837507618 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await user.up(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
