import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1759284595214 implements MigrationInterface {
    name = 'Initial1759284595214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "refreshToken" character varying(500), "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "current_weather_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cityName" character varying(100) NOT NULL, "country" character varying(100), "lat" numeric(10,6) NOT NULL, "lon" numeric(10,6) NOT NULL, "main" character varying(50) NOT NULL, "description" character varying(100) NOT NULL, "temperature" numeric(5,2) NOT NULL, "feelsLike" numeric(5,2) NOT NULL, "minTemperature" numeric(5,2) NOT NULL, "maxTemperature" numeric(5,2) NOT NULL, "pressure" integer NOT NULL, "humidity" integer NOT NULL, "windSpeed" numeric(5,2), "windDirection" integer, "clouds" integer, "fetchedAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4cf53bfce1822ff3baa62c4e784" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "current_weather_data"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
