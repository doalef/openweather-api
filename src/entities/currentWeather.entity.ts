import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("current_weather_data")
export class CurrentWeather {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 100 })
	cityName!: string;

	@Column({ type: "varchar", length: 100, nullable: true })
	country?: string;

	@Column({ type: "decimal", precision: 10, scale: 6 })
	lat!: number;

	@Column({ type: "decimal", precision: 10, scale: 6 })
	lon!: number;

	@Column({ type: "varchar", length: 50 })
	main!: string;

	@Column({ type: "varchar", length: 100 })
	description!: string;

	@Column({ type: "decimal", precision: 5, scale: 2 })
	temperature!: number;

	@Column({ type: "decimal", precision: 5, scale: 2 })
	feelsLike!: number;

	@Column({ type: "decimal", precision: 5, scale: 2 })
	minTemperature!: number;

	@Column({ type: "decimal", precision: 5, scale: 2 })
	maxTemperature!: number;

	@Column({ type: "int" })
	pressure!: number;

	@Column({ type: "int" })
	humidity!: number;

	@Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
	windSpeed?: number;

	@Column({ type: "int", nullable: true })
	windDirection?: number;

	@Column({ type: "int", nullable: true })
	clouds?: number;

	@Column({ type: "timestamp" })
	fetchedAt!: Date;

	@CreateDateColumn({ type: "timestamp" })
	createdAt!: Date;

	@UpdateDateColumn({ type: "timestamp" })
	updatedAt!: Date;
}
