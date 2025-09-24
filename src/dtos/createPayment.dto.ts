import {
  IsPositive,
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
} from "class-validator";
import { PaymentMethod } from "../mongo/models/Payment";

export class CreatePaymentDto {
  @IsPositive({ message: "amount must be greater than 0" })
  @IsNumber()
  amount!: number;

  @IsString({ message: "reference must be a string" })
  @IsNotEmpty({ message: "reference should not be empty" })
  reference!: string;

  @IsEnum(PaymentMethod, { message: "method invalid cash | card | transfer" })
  method!: string;
}
