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
}
export interface IWithdraw {
  withdraw: Number;
  balance: Number;
  remarks: String;
  acct_id: String;
}