import { IsNumber, IsPositive } from "class-validator";
import { Type } from "class-transformer";

export class IdParamDto {
	@Type(() => Number)
	@IsNumber()
	@IsPositive()
	id!: number;
}

export class UserIdParamDto {
	@Type(() => Number)
	@IsNumber()
	@IsPositive()
	userId!: number;
}
