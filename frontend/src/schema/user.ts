import * as yup from 'yup';

export const UserSchema = yup.object({
  name: yup.string().required('必須項目です'),
  email: yup.string().email().required('必須項目です'),
  password: yup
            .string()
            .required('必須項目です'),
            // .matches(
            //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"),
  passwordConfirmation: yup.string()
     .oneOf([yup.ref('password'), null], 'パスワードが一致しません')
}).required();