import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const technicalFormSchema = z.object({ identifier: z.string().min(3) });
type TechnicalFormValues = z.infer<typeof technicalFormSchema>;

export function TechnicalFormScreen() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<TechnicalFormValues>({ defaultValues: { identifier: '' }, resolver: zodResolver(technicalFormSchema) });

  return <View><Text>{t('form.label')}</Text><Controller control={control} name="identifier" render={({ field: { onChange, value } }) => <TextInput accessibilityLabel={t('form.label')} onChangeText={onChange} value={value} />} />{errors.identifier ? <Text>{t('form.required')}</Text> : null}{submitted ? <Text>{t('form.success')}</Text> : null}<Button title={t('form.submit')} onPress={handleSubmit(() => setSubmitted(true))} /></View>;
}
