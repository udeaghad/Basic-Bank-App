export interface IInfo {
  name: String;
  email: String;
  password: any;  

}

export interface IDeposit {
  deposit: Number;
  balance: Number;
  remarks: String;
  acct_id: String;
  bank_code: Number; 
  bank: String; 
  account_number: String
  account_name: String 
  reference: Number;
  currency: String;
}
export interface IWithdraw {
  withdraw: Number;
  balance: Number;
  remarks: String;
  acct_id: String;
  bank_code: Number; 
  bank: String; 
  account_number: String
  account_name: String 
  reference: Number;
  currency: String;
}