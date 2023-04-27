import bcrypt from 'bcryptjs';

const hashPassword = (password: any) =>{
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export default hashPassword;