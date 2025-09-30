import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity('current_weather_data')
export class CurrentWeather {
  @PrimaryGeneratedColumn("uuid")
	id: string;

  // Location information
  @Column({ type: 'varchar', length: 100 })
  cityName!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  lat!: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  lon!: number;

  // Weather conditions
  @Column({ type: 'varchar', length: 50 })
  main!: string;

  @Column({ type: 'varchar', length: 100 })
  description!: string;

  // Temperature data
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  temperature!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  feelsLike!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  minTemperature!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  maxTemperature!: number;

  // Atmospheric data
  @Column({ type: 'int' })
  pressure!: number;

  @Column({ type: 'int' })
  humidity!: number;

  // Wind data
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  windSpeed?: number;

  @Column({ type: 'int', nullable: true })
  windDirection?: number;

  // Cloud data
  @Column({ type: 'int', nullable: true })
  clouds?: number;

  // Time data
  @Column({ type: 'timestamp' })
  fetchedAt!: Date;

  // Relationship with User (optional - for user-specific weather queries)
  // @ManyToOne(() => User, user => user.weatherQueries, { nullable: true })
  // @JoinColumn({ name: 'userId' })
  // user?: User;

  @Column({ nullable: true })
  userId?: string;

  // Audit fields
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  // Indexes for better query performance
  // @Index();
  // @Index(['city', 'country']);
  // @Index(['latitude', 'longitude']);
  // @Index(['userId']);
}