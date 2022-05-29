import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

import { parseQueryParameters } from '@/utils';

import { PageContext } from './use-page-context';
import { decodeState } from './utils';

const useSocialCallbackHandler = () => {
  const { setToast } = useContext(PageContext);
  const { t } = useTranslation(undefined, { keyPrefix: 'main_flow' });
  const parameters = useParams();
  const navigate = useNavigate();

  const socialCallbackHandler = useCallback(() => {
    const data = window.location.search || '?' + window.location.hash.slice(1);
    const { state, error, error_description } = parseQueryParameters(data);
    const connectorId = parameters.connector;

    // Connector auth error
    if (error) {
      setToast(`${error}${error_description ? `: ${error_description}` : ''}`);
    }

    // Connector auth missing state
    if (!state || !connectorId) {
      setToast(t('error.missing_auth_data'));

      return;
    }

    const decodedState = decodeState(state);

    // Invalid state
    if (!decodedState) {
      setToast(t('error.missing_auth_data'));

      return;
    }

    const { platform, callbackLink } = decodedState;

    // Web/Mobile-Web redirect to sign-in/callback page to login
    if (platform === 'web') {
      navigate(
        {
          pathname: `/sign-in/callback/${connectorId}`,
          search: data,
        },
        {
          replace: true,
        }
      );

      return;
    }

    // Native Webview redirect to native app
    if (!callbackLink) {
      throw new Error('CallbackLink is empty');
    }

    window.location.assign(new URL(`${callbackLink}${data}`));
  }, [navigate, parameters.connector, setToast, t]);

  return socialCallbackHandler;
};

export default useSocialCallbackHandler;