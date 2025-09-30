import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { passwordHelper } from "../helpers/password";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 100 })
	name!: string;

	@Column({ type: "varchar", length: 100, unique: true })
	email!: string;

	@Column({ type: "varchar", length: 255 })
	password!: string;

	@Column({ type: "varchar", length: 500, nullable: true })
	refreshToken?: string;

	@Column({ type: "boolean", default: true })
	isActive!: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword(): Promise<void> {
		if (this.password) {
			// Only hash if password is modified or new
			if (this.isNewPassword()) {
				this.password = await passwordHelper.hashPassword(
					this.password
				);
			}
		}
	}

	private isNewPassword(): boolean {
		// This is a simplified check. You might want to implement more sophisticated change detection
		return (
			!this.password.startsWith("$2b$") &&
			!this.password.startsWith("$2a$")
		);
	}

	async validatePassword(password: string): Promise<boolean> {
		return passwordHelper.comparePassword(password, this.password);
	}
}
