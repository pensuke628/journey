import * as yup from 'yup';

export const houseSchema = yup.object({
  name: yup.string().required('必須項目です'),
  postal_code: yup.number()
                  .typeError('郵便番号は数字で入力してください')
                  .min(1000000, "7桁の数字を入力してください")
                  .max(9999999, "7桁の数字を入力してください")
                  .nullable()
                  .transform((value, originalValue) =>
                    String(originalValue).trim() === '' ? null : value
                  ),
  prefectures: yup.string().required('必須です'),
}).required();