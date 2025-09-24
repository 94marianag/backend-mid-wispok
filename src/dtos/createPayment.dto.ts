import { IsPositive, IsString, IsNumber, IsEnum } from "class-validator";
import { PaymentMethod } from "../mongo/models/Payment";

export class CreatePaymentDto {
  @IsPositive({ message: "amount must be greater than 0" })
  @IsNumber()
  amount!: number;

  @IsString({ message: "reference must be a string" })
  reference!: string;

  @IsEnum(PaymentMethod, { message: "method invalid cash | card | transfer" })
  method!: string;
}
