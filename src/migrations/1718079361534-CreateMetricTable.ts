import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMetricTable1718079361534 implements MigrationInterface {
    name = 'CreateMetricTable1718079361534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "metric" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "actionId" integer, CONSTRAINT "PK_7d24c075ea2926dd32bd1c534ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "action" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "habitId" integer, CONSTRAINT "PK_2d9db9cf5edfbbae74eb56e3a39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "habit" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "color" character varying NOT NULL, "resultId" integer, CONSTRAINT "PK_71654d5d0512043db43bac9abfc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "result" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "color" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_c93b145f3c2e95f6d9e21d188e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying(20) NOT NULL, "firstName" character varying(64) NOT NULL, "lastName" character varying(64) NOT NULL, "email" character varying(255) NOT NULL, "hashPassword" character varying NOT NULL, "salt" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "metric" ADD CONSTRAINT "FK_444b78e338c9bb34d5c1e15c63f" FOREIGN KEY ("actionId") REFERENCES "action"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "action" ADD CONSTRAINT "FK_f352a27f960f99bc46954fb4847" FOREIGN KEY ("habitId") REFERENCES "habit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "habit" ADD CONSTRAINT "FK_792b34848044502388b25604d37" FOREIGN KEY ("resultId") REFERENCES "result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_601be29c4bf75f59d0261f769ba" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_601be29c4bf75f59d0261f769ba"`);
        await queryRunner.query(`ALTER TABLE "habit" DROP CONSTRAINT "FK_792b34848044502388b25604d37"`);
        await queryRunner.query(`ALTER TABLE "action" DROP CONSTRAINT "FK_f352a27f960f99bc46954fb4847"`);
        await queryRunner.query(`ALTER TABLE "metric" DROP CONSTRAINT "FK_444b78e338c9bb34d5c1e15c63f"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "result"`);
        await queryRunner.query(`DROP TABLE "habit"`);
        await queryRunner.query(`DROP TABLE "action"`);
        await queryRunner.query(`DROP TABLE "metric"`);
    }

}
