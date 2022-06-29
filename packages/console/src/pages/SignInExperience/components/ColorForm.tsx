import { absoluteLighten } from '@logto/shared';
import color from 'color';
import React, { useCallback, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Button from '@/components/Button';
import ColorPicker from '@/components/ColorPicker';
import FormField from '@/components/FormField';
import Switch from '@/components/Switch';

import { SignInExperienceForm } from '../types';
import * as styles from './index.module.scss';

const ColorForm = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console' });
  const {
    watch,
    register,
    control,
    setValue,
    formState: { isDirty },
  } = useFormContext<SignInExperienceForm>();

  const isDarkModeEnabled = watch('color.isDarkModeEnabled');
  const primaryColor = watch('color.primaryColor');

  const handleResetColor = useCallback(() => {
    const darkPrimaryColor = absoluteLighten(color(primaryColor), 10);
    setValue('color.darkPrimaryColor', darkPrimaryColor.hex());
  }, [primaryColor, setValue]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    // If it's enabled, the original dark mode color won't change, users need to click "reset".
    if (!isDarkModeEnabled) {
      handleResetColor();
    }
  }, [handleResetColor, isDarkModeEnabled, isDirty, primaryColor, setValue]);

  return (
    <>
      <div className={styles.title}>{t('sign_in_exp.color.title')}</div>
      <FormField title="admin_console.sign_in_exp.color.primary_color">
        <Controller
          name="color.primaryColor"
          control={control}
          render={({ field: { onChange, value } }) => (
            <ColorPicker value={value} onChange={onChange} />
          )}
        />
      </FormField>
      <FormField title="admin_console.sign_in_exp.color.dark_mode">
        <Switch
          label={t('sign_in_exp.color.dark_mode_description')}
          {...register('color.isDarkModeEnabled')}
        />
      </FormField>
      {isDarkModeEnabled && (
        <>
          <FormField isRequired title="admin_console.sign_in_exp.color.dark_primary_color">
            <Controller
              name="color.darkPrimaryColor"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ColorPicker value={value} onChange={onChange} />
              )}
            />
          </FormField>
          <div className={styles.darkModeTip}>
            {t('sign_in_exp.color.dark_mode_reset_tip')}
            <Button
              type="plain"
              size="small"
              title="admin_console.sign_in_exp.color.reset"
              onClick={handleResetColor}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ColorForm;
