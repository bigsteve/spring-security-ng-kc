
export class Cards {

  public cardNumber: string;
  public customerId: number;
  public cardType: string;
  public totalLimit: number;
  public amountUsed: number;
  public availableAmount: number;
  
  constructor(cardNumber?: string,customerId?: number,cardType?: string,
    totalLimit?: number,amountUsed?: number, availableAmount?: number){
        this.cardNumber = cardNumber;
        this.customerId = customerId;
        this.cardType = cardType;
        this.totalLimit = totalLimit;
        this.amountUsed = amountUsed;
        this.availableAmount = availableAmount;
  }

}
