import React, { useContext, useMemo } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import { useStopAudioOnUnmount } from '@lib/audio/narrationPlayer';
import { useAlertDialog } from '@components/deck/dialogs';
import DeleteCampaignButton from '@components/campaign/DeleteCampaignButton';
import UploadCampaignButton from '@components/campaign/UploadCampaignButton';
import ScenarioComponent, { dynamicOptions } from './ScenarioComponent';
import withScenarioGuideContext, { ScenarioGuideInputProps } from './withScenarioGuideContext';
import CampaignGuideContext from './CampaignGuideContext';
import { useDeckActions } from '@data/remote/decks';
import { InjectedCampaignGuideContextProps } from './withCampaignGuideContext';
import space from '@styles/space';
import ScenarioGuideContext from './ScenarioGuideContext';
import { useUpdateCampaignActions } from '@data/remote/campaigns';
import CampaignHeader from './CampaignHeader';

export interface StandaloneGuideProps extends ScenarioGuideInputProps {
  campaignId: CampaignId;
  upload?: boolean;
}

function StandaloneGuideView({ campaignId, componentId, setCampaignServerId, upload }: StandaloneGuideProps & NavigationProps & InjectedCampaignGuideContextProps) {
  const { campaign } = useContext(CampaignGuideContext);
  const { processedScenario } = useContext(ScenarioGuideContext);
  useStopAudioOnUnmount();
  const [alertDialog, showAlert] = useAlertDialog();
  const deckActions = useDeckActions();
  const updateCampaignActions = useUpdateCampaignActions();
  const footer = useMemo(() => {
    return (
      <View style={space.paddingSideS}>
        <CampaignHeader style={space.paddingTopS} title={t`Settings`} />
        <UploadCampaignButton
          componentId={componentId}
          campaignId={campaign.id}
          campaign={campaign}
          deckActions={deckActions}
          setCampaignServerId={setCampaignServerId}
          showAlert={showAlert}
          standalone
          upload={upload}
        />
        <DeleteCampaignButton
          componentId={componentId}
          actions={updateCampaignActions}
          campaignId={campaignId}
          campaign={campaign}
          showAlert={showAlert}
          standalone
        />
      </View>
    );
  }, [componentId, upload, campaignId, setCampaignServerId, showAlert, updateCampaignActions, deckActions, campaign]);

  return (
    <>
      <ScenarioComponent
        componentId={componentId}
        standalone
        footer={campaign && processedScenario && footer}
      />
      { alertDialog }
    </>
  );
}


StandaloneGuideView.options = () => {
  return dynamicOptions(false);
};

export default withScenarioGuideContext(StandaloneGuideView);